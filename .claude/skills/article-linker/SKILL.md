---
name: article-linker
description: Reemplaza los placeholders de CTA de afiliado por links reales de Amazon en un artículo MDX de guiadeportiva.es sin romper el build. Usar cuando el usuario pase un slug de artículo y una lista "Producto → URL de Amazon".
---

# article-linker

## Input esperado

```
Artículo: pronador                       # slug o parte del slug / del nombre de archivo
Producto 1: Asics Gel-Kayano 31 → https://link.amazon/...
Producto 2: Brooks Adrenaline GTS 25 → https://www.amazon.es/dp/...?tag=guiadeportiva-21
```

## 1. Encontrar el artículo

Los archivos llevan prefijo numérico y su nombre no siempre coincide con el slug (`01-pronador.mdx` →
`zapatillas-running-pronador`). Buscar en este orden y quedarse con una sola coincidencia:

```bash
grep -l '^slug: "<slug>"' src/content/articles/*.mdx      # slug exacto
ls src/content/articles/ | grep -i '<texto>'                # match flexible por nombre de archivo
grep -l '^slug: ".*<texto>.*"' src/content/articles/*.mdx   # match flexible por slug
```

Si hay 0 o más de 1 candidato, preguntar al usuario antes de seguir.

## 2. Validar cada URL (antes de tocar el archivo)

```bash
curl -sL -o /dev/null -m 20 -w "%{http_code} %{url_effective}\n" "<URL>"
```

- El destino final debe ser `amazon.es`, el producto correcto y llevar `tag=guiadeportiva-21`.
- Links cortos de SiteStripe (`https://link.amazon/...`, `amzn.to/...`) valen si terminan así.
- Un 503 de Amazon a curl es bloqueo anti-bot, no un error, si la URL final es correcta.
- Si no llega a amazon.es o no lleva el tag: **no insertarlo** y reportarlo.

## 3. Localizar el placeholder de cada producto

Cada producto es una sección `## N. Nombre — Subtítulo` (en comparativas, `## Nombre en detalle`).
El placeholder es **el más cercano después del nombre, dentro de esa misma sección** (nunca el primero del archivo).
Variantes aceptadas:

- `**[Ver precio actual y disponibilidad en Amazon →]**` (formato actual)
- `[Ver precio actual en Amazon →]` o `**[Ver precio actual en Amazon →]**` (formato antiguo)
- `<a href="PLACEHOLDER_AMAZON" ...>...</a>` (lo genera `article-generator`)
- En comparativas, placeholders por modelo: `**[Ver Alphafly en Amazon →]**`.

Casos:
- **Producto no encontrado** en el artículo → no inventar sección ni link; reportar "producto no encontrado" y seguir.
- **Ya enlazado** (la sección ya tiene `<a href="https://...amazon...` o `link.amazon`) → no tocar; reportar "ya enlazado, saltado".

## 4. Reemplazar

Formato del sitio (CLAUDE.md, "Reglas del sitio"): caja `.aff-cta` con el botón grande.

```html
<div class="aff-cta">
  <a href="URL" class="btn-aff btn-aff--lg" target="_blank" rel="nofollow sponsored noopener">Ver precio actual y disponibilidad en Amazon →</a>
</div>
```

Reglas duras:
- `rel="nofollow sponsored noopener"` **completo, siempre** (política de Amazon Associates). Nunca omitir ninguno de los tres.
- `target="_blank"`.
- **Nunca** sintaxis `{:target=...}`: en MDX `{` abre una expresión JS y rompe el build.
- Sin precios, "desde X €", ratings ni disponibilidad fija en el texto del botón ni alrededor.

Después, los botones compactos (`.btn-aff--sm`) del resumen, la tabla (columna "Amazon") y el veredicto
reutilizan el mismo link:

```bash
python3 scripts/conversion-buttons.py src/content/articles/<archivo>.mdx   # idempotente
```

Una tabla "omitida" en la salida significa que alguna fila no coincide con un producto: revisarla.
La barra fija del móvil toma sola el pick "Mejor general". Actualizar `updatedDate` a hoy.

## 5. Verificar y publicar

```bash
grep -n -B25 'btn-aff--lg' <archivo> | grep -E '^[0-9]+-## |btn-aff'      # cada link bajo su producto
grep -nE 'Ver precio actual|PLACEHOLDER_AMAZON' <archivo> | grep -v 'href="http'   # placeholders restantes
npm run build
```

- Si el build falla: `git checkout -- <archivo>`, reportar el error y no commitear.
- El link no va al JSON-LD: el artículo usa `ItemList` (nombre + `#producto-N`), sin precio ni oferta.
- Commit solo del MDX: `feat: add real affiliate links to <slug> article (<N> products)` y push a `main`.
- Deploy: `gh api repos/Valec5/guiadeportiva-es/commits/<sha>/status --jq '.state'` hasta `success`
  (normalmente ~60 s). Comprobación en vivo:
  ```bash
  curl -s https://guiadeportiva.es/<slug>/ | grep -c 'btn-aff--lg'   # = productos con link
  ```
  (`btn-aff` a secas cuenta también los botones compactos y la barra móvil.)
- Actualizar "Historial" y "Pendientes" en `~/Guiadep/CLAUDE.md`.

## Reporte

- Links insertados (producto → URL final validada)
- Productos no encontrados / ya enlazados / URLs rechazadas (y por qué)
- Resultado del build
- URL en producción: `https://guiadeportiva.es/<slug>/`
