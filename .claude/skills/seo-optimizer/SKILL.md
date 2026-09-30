---
name: seo-optimizer
description: Aplica y verifica SEO on-page en uno o todos los artículos de guiadeportiva.es (frontmatter, links internos contextuales, FAQ/ItemList/Breadcrumb schema). Usar cuando el usuario pida optimizar SEO de un slug o de "todos".
---

# seo-optimizer

Input: slug del artículo, o `todos`.

## Cómo está armado el SEO en este proyecto (no reinventarlo)

- Frontmatter validado por `src/content/config.ts`: `title`, `slug`, `category` (`running` | `comparativas`),
  `keyword`, `seoTitle`, `seoDescription`, `publishDate`, `updatedDate` (opcional), `featured`, `excerpt`.
  **La fecha de actualización se llama `updatedDate`** (no `lastUpdated`).
- JSON-LD generado automáticamente en `src/components/ArticleLayout.astro`:
  - `Article` (con `dateModified` = `updatedDate`) y `BreadcrumbList` (Inicio > Running|Comparativas > Título).
  - `FAQPage` vía `src/components/FAQSchema.astro`, extraído de la sección `## Preguntas frecuentes`
    con formato `**¿Pregunta?**` + respuesta en la línea siguiente (`src/lib/seo.ts` → `extractFAQ`).
  - `ItemList` vía `src/components/ItemListSchema.astro`, extraído de encabezados `## N. Nombre — Subtítulo`
    o `## Nombre en detalle` (`extractProducts`). Cada `ListItem` apunta a `#producto-N`, el `id` que
    `src/lib/rehype-product-anchors.mjs` pone en ese encabezado. Sin `Product`/`Offer`/ratings (ver `article-generator`).
- Imagen OG por artículo generada en el build: `src/pages/og/[slug].png.ts` (`src/lib/og.ts`), 1200x630.
- Elementos de conversión que cada artículo debe tener (ver `article-generator`): botón compacto en cada pick del resumen,
  columna "Amazon" en la tabla comparativa, "Ideal si / Evítala si" en cada producto, sección `## ¿Qué talla pido?`
  antes de las FAQ, botón en cada línea del veredicto y barra fija móvil (pick "Mejor general" o `topPick`).
  Si faltan botones: `python3 scripts/conversion-buttons.py <archivo>` (idempotente).
- Sección `## Fuentes de los datos` al final con la fuente de cada dato técnico (ver `article-generator`).
- Sitemap dinámico (`src/pages/sitemap.xml.ts`) con `lastmod` = `updatedDate`. No hace falta tocarlo por artículo.

## Proceso (por artículo)

1. Localizar el archivo: `grep -l '^slug: "<slug>"' src/content/articles/*.mdx`.
2. **Frontmatter:**
   - `seoTitle` ≤ 60 caracteres, con keyword.
   - `seoDescription` ≤ 155 caracteres: gancho + beneficio + llamada a la acción. Sin precios, sin comillas dobles.
   - No afirmar cosas no verificables ("probadas", "las favoritas de los podólogos") salvo que el artículo lo sustente.
   - Medir longitudes con Python (`len()`), no a ojo.
3. **Links internos:** listar los que ya tiene (`grep -oE '\]\(/[a-z0-9-]+/\)'`). Objetivo 3-5 destinos distintos.
   Leer los demás artículos (frontmatter + temas) para elegir relacionados reales. Insertar dentro de frases
   existentes o una oración breve en el mismo párrafo, con anchor descriptivo ("zapatillas para dolor de rodilla",
   nunca "clic aquí"). No duplicar un destino ya enlazado, no enlazar el propio artículo, no forzar un link
   si no hay relación temática. Usar URLs relativas con barra final: `/slug/`.
4. **Contenido:** sin precios en € ni ratings inventados (ver `spain-language` para el idioma).
5. **Fecha:** actualizar `updatedDate` a hoy **solo** si cambió el contenido del artículo.
6. `npm run build` y verificar en `dist/`:
   ```bash
   python3 - <<'PY'
   import re,json,glob,os
   for f in glob.glob('dist/*/index.html'):
       h=open(f).read()
       for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>',h,re.S): json.loads(b)
       for href in re.findall(r'href="(/[^"#?]*/)"',h):
           assert os.path.exists('dist'+href+'index.html'), (f,href)
   print('JSON-LD válido y sin links internos rotos')
   PY
   ```
   Y confirmar en el HTML del artículo: `FAQPage` con tantas preguntas como el MDX, `ItemList` con un elemento
   por producto (cada `#producto-N` existe en la página), `BreadcrumbList`, `og:image` = `/og/<slug>.png`, "Actualizado el …" visible,
   la barra `sticky-pick` con el modelo esperado y todos los links de Amazon con `rel="nofollow sponsored noopener"`.
   Si una FAQ o producto no aparece, el problema es el formato del encabezado en el MDX: corregir el MDX.
7. Opcional: validar online con
   `curl -s -X POST https://validator.schema.org/validate --data-urlencode "html@dist/<slug>/index.html"`
   (la respuesta empieza con `)]}'`; mirar `totalNumErrors` y `totalNumWarnings`).
8. Commit: `feat: SEO optimization for <slug>` (o `for all articles`), push a `main`, esperar deploy
   con `gh api repos/Valec5/guiadeportiva-es/commits/<sha>/status`.
9. Actualizar "Historial" en `~/Guiadep/CLAUDE.md`.
