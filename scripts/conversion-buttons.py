#!/usr/bin/env python3
"""Add compact Amazon buttons (.btn-aff--sm) to an article's quick picks, comparison table and verdict.

Reuses the Amazon link already present in each product section (or in the per-model buttons of the
brand comparisons). Idempotent: lines/tables that already have a compact button are left alone.

Usage: python3 scripts/conversion-buttons.py src/content/articles/01-pronador.mdx [...]
"""
import re
import sys

BTN = ('<a href="{url}" class="btn-aff btn-aff--sm" target="_blank" '
       'rel="nofollow sponsored noopener">{text}</a>')
AMAZON = r'https://(?:www\.amazon\.es|link\.amazon)/[^"]+'
MULTIWORD_BRANDS = ('New Balance', 'Under Armour')


def product_links(s):
    """{product name: amazon url} from product sections and per-model pair buttons."""
    links = {}
    sec = re.compile(r'(?m)^## (?:\d+\.\s+(.+?)\s+—.*|(.+?) en detalle)\s*$([\s\S]*?)(?=^## |\Z)')
    for m in sec.finditer(s):
        url = re.search(rf'href="({AMAZON})"', m.group(3))
        if url:
            links[m.group(1) or m.group(2)] = url.group(1)
    # Per-model buttons of the brand comparisons ("Ver Hoka Bondi 9 en Amazon →"), not the standard CTA.
    for m in re.finditer(rf'<a href="({AMAZON})"[^>]*>Ver (?!precio actual)(.+?) en Amazon →</a>', s):
        links.setdefault(m.group(2), m.group(1))
    return links


def aliases(name):
    out = {name}
    base = re.sub(r' (Mujer)$', '', name)
    out.add(base)
    brand_words = 2 if base.startswith(MULTIWORD_BRANDS) else 1
    rest = ' '.join(base.split()[brand_words:])
    if rest:
        out.add(rest)
        out.add(re.sub(r'^Gel-', '', rest))
    return {a for a in out if len(a) >= 4}


def find_products(text, links):
    """Products mentioned in text, in order, longest alias first, non-overlapping."""
    cands = sorted(((a, n) for n in links for a in aliases(n)), key=lambda x: -len(x[0]))
    taken, hits = [], []
    for alias, name in cands:
        for m in re.finditer(rf'(?<![\w-]){re.escape(alias)}(?![\w-])', text):
            span = range(m.start(), m.end())
            if any(set(span) & set(t) for t in taken):
                continue
            taken.append(span)
            hits.append((m.start(), name, alias))
    seen, ordered = set(), []
    for _, name, alias in sorted(hits):
        if name not in seen:
            seen.add(name)
            ordered.append((name, alias))
    return ordered


def buttons(found, links):
    if len(found) == 1:
        return BTN.format(url=links[found[0][0]], text='Ver en Amazon')
    return ' '.join(BTN.format(url=links[n], text=f'Ver {a}') for n, a in found)


def section_bounds(s, title):
    m = re.search(rf'(?m)^## {title}\s*$', s)
    if not m:
        return None
    end = re.search(r'(?m)^## ', s[m.end():])
    return m.end(), m.end() + end.start() if end else len(s)


def process(path):
    s = open(path, encoding='utf-8').read()
    links = product_links(s)
    report = {'picks': 0, 'veredicto': 0, 'tablas': 0, 'tablas_omitidas': 0}

    # 1 + 4: quick picks and verdict lines
    for title, key, need_arrow in (('Resumen rápido', 'picks', True), ('Veredicto final', 'veredicto', False)):
        b = section_bounds(s, title)
        if not b:
            continue
        lines = s[b[0]:b[1]].split('\n')
        for i, line in enumerate(lines):
            if not line.startswith('- ') or 'btn-aff--sm' in line or (need_arrow and '→' not in line):
                continue
            target = line.split('→', 1)[1] if '→' in line else line
            found = find_products(target, links)
            if found:
                lines[i] = f'{line} {buttons(found, links)}'
                report[key] += 1
        s = s[:b[0]] + '\n'.join(lines) + s[b[1]:]

    # 2: comparison tables whose first column lists this article's products
    def add_column(m):
        rows = m.group(0).rstrip('\n').split('\n')
        head = [c.strip() for c in rows[0].strip('|').split('|')]
        if head[0] != 'Modelo' or 'Amazon' in head:
            return m.group(0)
        cells = []
        for row in rows[2:]:
            found = find_products(row.strip('|').split('|')[0].strip(), links)
            if len(found) != 1:
                report['tablas_omitidas'] += 1
                return m.group(0)
            cells.append(BTN.format(url=links[found[0][0]], text='Ver en Amazon'))
        report['tablas'] += 1
        out = [rows[0] + ' Amazon |', rows[1] + '--------|']
        out += [f'{row} {c} |' for row, c in zip(rows[2:], cells)]
        return '\n'.join(out) + '\n'

    s = re.sub(r'(?m)^\|.*\|\n\|[-:| ]+\|\n(?:\|.*\|\n?)+', add_column, s)
    open(path, 'w', encoding='utf-8').write(s)
    return report


if __name__ == '__main__':
    for p in sys.argv[1:]:
        print(p, process(p))
