---
name: article-generator
description: Crea un artículo nuevo completo (guía de compra o comparativa) en guiadeportiva.es a partir de una keyword, categoría, slug y lista de productos. Usar cuando el usuario pida un artículo nuevo.
---

# article-generator

## Input esperado

```
Keyword: mejores zapatillas trail running mujer
Categoría: running | comparativas
Slug: mejores-zapatillas-trail-mujer
Productos:
1. Nombre - Marca - Mejor para X
2. ...
```

## Antes de escribir

- Confirmar que el slug no existe: `grep -l '^slug: "<slug>"' src/content/articles/*.mdx`.
- Leer 1-2 artículos existentes parecidos para copiar tono y estructura (p. ej. `01-pronador.mdx`).
- Si no conoces datos técnicos fiables de un producto (peso, drop, tecnología), **no inventarlos**:
  preguntar al usuario o marcarlos claramente como pendientes antes de publicar.

## Archivo

`src/content/articles/NN-nombre-corto.mdx`, donde `NN` es el siguiente número libre con dos dígitos
(`ls src/content/articles | tail -1`). El nombre del archivo no tiene que coincidir con el slug.

## Frontmatter (todos los campos)

```yaml
---
title: "Las N Mejores <keyword> 2026"
slug: "<slug>"
category: "running"            # o "comparativas" (enum en src/content/config.ts)
keyword: "<keyword>"
seoTitle: "<≤60 caracteres, con keyword>"
seoDescription: "<≤155: gancho + beneficio + llamada a la acción, sin precios ni comillas dobles>"
publishDate: YYYY-MM-DD        # hoy
updatedDate: YYYY-MM-DD        # hoy
excerpt: "<1 frase, sin precios>"
featured: false
---
```

## Estructura (AIDA) — respetar los formatos de encabezado, el JSON-LD depende de ellos

1. `## Resumen rápido` — 3 picks: `- **Mejor general** → Modelo`, `- **Mejor precio** → Modelo`, `- **Premium** → Modelo`.
   Luego un párrafo de contexto (~100 palabras).
2. `## Tabla comparativa` — columnas técnicas (Modelo | Peso | Drop | ... | Mejor para). **Sin columna de precio.**
3. Un bloque por producto, **con este encabezado exacto** (lo usan `extractProducts` para el `ItemList` y
   `rehype-product-anchors.mjs` para darle el ancla `#producto-N`):
   ```mdx
   ## 1. Marca Modelo — Mejor para X

   **Mejor para:** ...

   <Párrafo descriptivo: tecnología, para quién es.>

   **Pros:**
   - (3-4)

   **Contras:**
   - (2-3, honestos)

   **[Ver precio actual y disponibilidad en Amazon →]**
   ```
   El placeholder se reemplaza después con la skill `article-linker`. El nombre del producto debe empezar
   por la marca y usar el nombre oficial del modelo.
   Structured data: el artículo genera un `ItemList` (cada `ListItem` con `position`, `name` y `url` =
   `https://guiadeportiva.es/<slug>/#producto-N`). **No** usar `Product`/`Offer`/`AggregateRating`: sin precio
   en vivo quedan incompletos y Google los marca como error. No inventar precio, rating ni review.
4. Sección educativa (`## Cómo elegir…`, `## ¿Cómo saber si…?`, etc.).
5. `## Preguntas frecuentes` — mínimo 4, **con este formato** (lo usa `extractFAQ` para el FAQPage schema):
   ```mdx
   **¿Pregunta?**
   Respuesta en la línea siguiente.
   ```
   Una línea en blanco entre preguntas.
6. `## Veredicto final` — una línea por perfil de corredor: `- **Si ...:** Modelo`.

## Reglas

- Idioma: aplicar la skill `spain-language` (tuteo peninsular, nunca voseo) y correr su verificación con grep.
- Sin precios específicos en € (ni en tablas, ni "~€", ni en títulos), sin ratings/estrellas inventados.
  Hablar de "gama de entrada/media/alta/premium".
- No afirmar que el producto fue probado físicamente (ver `/metodologia/`).
- Interlinking: 3+ links a artículos existentes, dentro del texto, anchor descriptivo, URL `/slug/`.
  Idealmente, agregar también 1-2 links **hacia** el artículo nuevo desde artículos relacionados
  (y actualizar su `updatedDate`).
- Si encaja en algún grupo de `src/pages/running/index.astro` o `src/pages/comparativas/index.astro`
  (por pisada, precio, marca, perfil, otros deportes), agregarlo a esa lista de links.
- Sitemap: se genera solo desde la colección, no hace falta tocarlo.

## Cierre

1. `npm run build` y verificar en `dist/<slug>/index.html`: FAQPage (≥4 preguntas), `ItemList` con un elemento por producto
   (cada `url` apunta a un `id` que existe en la página),
   BreadcrumbList, JSON-LD parseable y links internos existentes (ver script en la skill `seo-optimizer`).
2. Commit: `feat: new article <slug>`, push a `main`, esperar deploy con
   `gh api repos/Valec5/guiadeportiva-es/commits/<sha>/status`.
3. Actualizar "Historial" y "Pendientes" en `~/Guiadep/CLAUDE.md` (el artículo queda pendiente de links de Amazon).
