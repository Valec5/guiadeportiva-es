---
name: article-linker
description: Reemplaza los placeholders de CTA de afiliado por links reales de Amazon en un artículo MDX de guiadeportiva.es. Usar cuando el usuario pase un slug de artículo y una lista "Producto → URL de Amazon".
---

# article-linker

## Input esperado

```
Artículo: zapatillas-running-pronador
Producto 1: Asics Gel-Kayano 31 → https://...
Producto 2: ...
```

## Dónde está cada cosa

- Artículos: `src/content/articles/NN-nombre.mdx`. El archivo **no** se llama como el slug:
  buscarlo por el frontmatter con `grep -l '^slug: "<slug>"' src/content/articles/*.mdx`.
- Cada producto es una sección `## N. Nombre — Subtítulo` (en comparativas: `## Nombre en detalle`).
- El placeholder está al final de la sección del producto:
  `**[Ver precio actual y disponibilidad en Amazon →]**` (variante vieja: `**[Ver precio actual en Amazon →]**`).
- Comparativas (08, 13, 15) usan placeholders por marca/modelo: `**[Ver Alphafly en Amazon →]**`,
  `**[Ver Hoka en Amazon →]** | **[Ver On Running en Amazon →]**`, etc. Reemplazar cada uno por separado.

## Proceso

1. **Validar cada URL antes de insertarla:**
   ```bash
   curl -sL -o /dev/null -m 20 -w "%{http_code} %{url_effective}\n" "<URL>"
   ```
   El destino final debe ser `amazon.es`, el producto correcto y contener `tag=guiadeportiva-21`.
   Los links cortos de SiteStripe (`https://link.amazon/...`, `amzn.to/...`) son válidos si terminan así.
   Un 503 de Amazon a curl es bloqueo anti-bot, no un error, si la URL final es correcta.
   Si un link no llega a amazon.es o no lleva el tag, **no insertarlo** y avisar al usuario.
2. Para cada producto, ubicar la sección `## N. <Nombre> —` que coincide con el nombre recibido
   y reemplazar **el placeholder de esa sección** (no el primero que aparezca) por:
   ```html
   <div class="aff-cta">
     <a href="URL" class="btn-aff btn-aff--lg" target="_blank" rel="nofollow sponsored noopener">Ver precio actual y disponibilidad en Amazon →</a>
   </div>
   ```
   - `rel="nofollow sponsored noopener"` es obligatorio (política de Amazon Associates).
   - **Nunca** usar sintaxis `{:target=...}`: en MDX `{` es una expresión JS y rompe el build.
3. Reglas de contenido: no agregar precios, "desde X €", ratings ni disponibilidad fija.
4. Verificar:
   ```bash
   grep -n -B25 'btn-aff' <archivo> | grep -E '^[0-9]+-## |btn-aff'   # cada link bajo su producto
   grep -n 'Ver precio actual' <archivo> | grep -v btn-aff              # placeholders restantes
   ```
   Si un producto recibido no tiene sección en el artículo, o queda un placeholder de un producto
   recibido sin reemplazar, avisar.
5. Actualizar `updatedDate` del frontmatter a hoy.
6. `npm run build` y confirmar que el HTML de `dist/<slug>/index.html` tiene los links.
   El link de Amazon no va al JSON-LD: el artículo usa `ItemList` (nombre + ancla `#producto-N`), sin precios ni ofertas.
7. Commit solo del MDX: `feat: add real affiliate links to <slug>` y push a `main`.
8. Esperar el deploy: `gh api repos/Valec5/guiadeportiva-es/commits/<sha>/status --jq '.state'` hasta `success`.
9. Actualizar "Historial" y "Pendientes" en `~/Guiadep/CLAUDE.md`.
