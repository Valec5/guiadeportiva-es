---
name: seo-optimizer
description: Aplica SEO on-page a un artículo de guiadeportiva.es (o a todos con "all") sin tocar el contenido textual - frontmatter/metas, H2 con muletillas, interlinking contextual con rotación de anchors y verificación de schemas (FAQPage, ItemList, BreadcrumbList). Ortogonal a human-polish.
---

# seo-optimizer

Input: slug del artículo (match flexible, como en `article-linker`) o `all`.

## Territorio (no pisar a human-polish)

| Toca | No toca |
|---|---|
| Frontmatter: `title`, `seoTitle`, `seoDescription`, `excerpt`, `keyword`, `updatedDate` | Prosa del cuerpo (muletillas, ritmo, voz: es de `human-polish`) |
| Encabezados H2/H3 | Tablas, botones y links de afiliado |
| Links internos (insertar, quitar duplicados, arreglar rotos) | Datos técnicos, `## Fuentes de los datos` |
| Verificación de schemas | Nunca borra información factual |

Para insertar un link puede envolver una frase existente o añadir **una** oración corta de enlace;
no reescribe párrafos.

## Fase A — Frontmatter

Comprobar en cada artículo:
- `title`: keyword principal + año (`2026`) en guías y comparativas. Excepción: artículos informativos
  perennes (`cuanto-duran-…`, `como-saber-si-soy-pronador`) no llevan año en el `title` (sí puede ir en `seoTitle`).
- `seoTitle`: ≤60 caracteres, keyword al principio (se acepta "Mejores" delante si la keyword lo incluye o
  es una guía de "mejores"). Cambiar un `seoTitle` que ya posiciona solo si incumple: no reescribir por reescribir.
- `seoDescription`: ≤155 caracteres, gancho + beneficio + llamada a la acción. Sin precios, sin comillas dobles,
  sin "versátil", "ideal", "perfecto", "excepcional" ni el resto de la lista negra de `human-polish`.
- `excerpt`: mismas reglas; nunca prometer "precios" (el sitio no publica precios).
- `slug`, `category` (`running` | `comparativas`, enum de `src/content/config.ts`), `keyword`, `publishDate`, `featured`: presentes.
- `updatedDate` → hoy (es el campo que usa el proyecto; no existe `lastUpdated`).

## Fase B — H2 con muletillas

Si un H2/H3 contiene una palabra de la lista negra de `human-polish` ("versátil", "perfecto", "excepcional"…),
reescribirlo con un sustituto preciso al contexto ("La más versátil" → "Para rodajes y cambios de ritmo").

- En encabezados de producto (`## N. Nombre — Subtítulo` o `## Nombre en detalle`) **solo** se cambia el
  subtítulo tras ` — `: el nombre alimenta el `ItemList` y el ancla es `#producto-N`, que no depende del texto.
- Tras cambiar un encabezado, buscar links a su ancla vieja en todo el sitio:
  ```bash
  grep -rnoE '\]\(/[^)]*#[^)]*\)|href="/[^"]*#[^"]*"' src
  ```

## Fase C — Interlinking

Objetivo: **3-5 destinos internos distintos** por artículo, dentro del cuerpo (no como lista final).

1. Elegir destinos por afinidad: keyword, categoría, productos y marcas en común, perfil de lector.
2. Anchor descriptivo con la keyword del destino ("zapatillas para pronador", "cuánto duran las zapatillas de running");
   nunca "clic aquí" ni "este artículo".
3. **Sin duplicados**: un mismo destino una sola vez por artículo (fuera de `## Fuentes de los datos`).
   Si hay dos, quitar uno o cambiarlo por otro destino relevante.
4. Rotación: consultar y actualizar `.claude/skills/seo-optimizer/anchor-map.json`
   (`map[origen][destino] = [anchors]`). Si otro artículo ya usa el mismo anchor hacia el mismo destino, preferir
   una variante. Regenerarlo al final (ver script abajo).
5. Solo destinos que existen: slugs de `src/content/articles/` o páginas estáticas
   (`/metodologia/`, `/sobre-nosotros/`, `/running/`, `/comparativas/`…). Formato `/slug/`.

## Fase D — Schemas

Los schemas **no se importan en el MDX**: los genera `src/components/ArticleLayout.astro` a partir del contenido.

- `FAQSchema.astro` (FAQPage): sale de `## Preguntas frecuentes` con el formato `**¿Pregunta?**` + respuesta
  **en una sola línea** (lo parsea `extractFAQ` en `src/lib/seo.ts`). Mínimo 4 preguntas en artículos nuevos.
- `ItemListSchema.astro` (ItemList): un `ListItem` por encabezado de producto, `url` = `…/<slug>/#producto-N`.
- `BreadcrumbList`: en el layout (y en `CategoryArchive.astro` para las categorías).
- **Nunca `Product`/`Offer`/`AggregateRating`/`Review`.** Sin precio en vivo, Google los marca como error
  ("Either offers, review, or aggregateRating should be specified"); por eso el sitio pasó a `ItemList`
  (CLAUDE.md, 2026-09-29). `ProductSchema.astro` ya no existe. Si algún día hay Product Advertising API con
  precio en vivo, se replantea entonces. No inventar precio, rating ni review.

## Fase E — Verificación

```bash
npm run build
# Por página: FAQ y ItemList presentes
for d in dist/*/; do f=$d/index.html; q=$(grep -o '"@type":"Question"' $f | wc -l); i=$(grep -o '"@type":"ListItem"' $f | wc -l); [ $q -gt 0 ] && echo "$(basename $d) faq=$q items=$i"; done
```

Script de auditoría de metas, links y anchor map (desde la raíz del proyecto):

```bash
python3 - <<'EOF'
import re,glob,json
slugs={re.search(r'^slug: "(.*)"',open(f).read(),re.M)[1] for f in glob.glob('src/content/articles/*.mdx')}
static={'metodologia','sobre-nosotros','afiliados','running','comparativas','contacto','privacidad','cookies','aviso-legal'}
amap={}
for f in sorted(glob.glob('src/content/articles/*.mdx')):
    s=open(f).read(); fm=s.split('---')[1]; slug=re.search(r'^slug: "(.*)"',fm,re.M)[1]
    for k,lim in (('seoTitle',60),('seoDescription',155)):
        v=re.search(rf'^{k}: "(.*)"',fm,re.M)[1]
        if len(v)>lim: print('LARGO',f,k,len(v))
    body=s.split('---',2)[2].split('## Fuentes de los datos')[0]
    links=re.findall(r'\[([^\]]+)\]\(/([^)#/]+)/?\)',body); dests=[d for _,d in links]
    for d in set(dests):
        if dests.count(d)>1: print('DUP',f,d)
        if d not in slugs|static: print('ROTO',f,d)
    if len({d for d in dests if d in slugs})<3: print('POCOS',f)
    amap[slug]={}
    for a,d in links:
        if d in slugs: amap[slug].setdefault(f'/{d}/',[]).append(a)
json.dump({'map':amap},open('.claude/skills/seo-optimizer/anchor-map.json','w'),ensure_ascii=False,indent=1)
EOF
grep -nE '^#{2,3} .*(versátil|perfect|excepcional|óptim|robust|innovador|revolucionari)' src/content/articles/*.mdx   # debe salir vacío
```

## Commit y reporte

- Un artículo: `feat: SEO optimization for <slug>`. Modo `all`: `feat: SEO optimization pass across all articles`.
- Push a `main`, esperar deploy (`gh api repos/Valec5/guiadeportiva-es/commits/<sha>/status --jq '.state'`).
- Reporte: metas actualizadas (antes → después), H2 reescritos (antes → después), interlinks nuevos
  (origen → destino, anchor), schemas verificados, resultado del build.
- Actualizar "Historial" y "Pendientes" en `~/Guiadep/CLAUDE.md`.
