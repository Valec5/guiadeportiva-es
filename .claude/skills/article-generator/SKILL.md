---
name: article-generator
description: Crea un artículo nuevo completo (guía de compra o comparativa) en guiadeportiva.es a partir de keyword, categoría, slug y productos, con estructura AIDA para conversión y SEO, y lo pasa por spain-language, human-polish y seo-optimizer. Usar cuando el usuario pida un artículo nuevo.
---

# article-generator

## Input esperado

```
Keyword principal: mejores zapatillas trail running mujer
Categoría: running | comparativas            # "guías" → running (ver abajo)
Slug: mejores-zapatillas-trail-mujer
Productos (5-8):
  1. Marca Modelo - rango de precio - mejor para X
  2. ...
Ángulo editorial (opcional): énfasis en drop bajo
```

- **Categoría**: el enum de `src/content/config.ts` solo admite `running` y `comparativas`. Una "guía" de compra
  va en `running`; un "X vs Y" en `comparativas`. Una categoría nueva exige cambiar el enum y crear su página
  de archivo: preguntar antes.
- **Rango de precio**: solo orienta el texto ("gama de entrada/media/alta/premium"). Nunca se publica una cifra.

## Antes de escribir

- El slug no existe: `grep -l '^slug: "<slug>"' src/content/articles/*.mdx`.
- Leer 1-2 artículos parecidos para el tono (p. ej. `01-pronador.mdx`, `21-pegasus-41-vs-ghost-16.mdx`).
- **Datos técnicos (peso, drop, espuma, stack) solo con fuente**: ficha oficial de la marca, RunRepeat,
  Running Shoes Guru, RTINGS. Peso y drop = dato de marca (no de laboratorio, salvo que la marca no publique).
  Sin fuente: descripción cualitativa **comparativa** ("más firme que la Pegasus 41"), nunca el adjetivo suelto,
  y nunca un número inventado. Preguntar al usuario si falta algo esencial.

## Fase A — Archivo y frontmatter

Archivo `src/content/articles/NN-nombre-corto.mdx`, con `NN` = siguiente número libre (`ls src/content/articles | tail -1`).

```yaml
---
title: "Las N Mejores <Keyword> 2026"           # keyword + año
slug: "<slug>"
category: "running"                              # o "comparativas"
keyword: "<keyword principal>"
seoTitle: "<≤60 caracteres, keyword al principio>"
seoDescription: "<≤155: gancho + beneficio + acción, sin precios, sin comillas dobles, sin muletillas>"
publishDate: YYYY-MM-DD                          # hoy
updatedDate: YYYY-MM-DD                          # hoy
excerpt: "<1-2 frases con gancho, sin precios>"
featured: false
---
```

## Fase B — Estructura (AIDA). Los formatos de encabezado alimentan el JSON-LD: respetarlos

1. **`## Resumen rápido`** (lo primero del artículo): 3 picks
   `- **Mejor general** → Modelo`, `- **Mejor relación calidad-precio** → Modelo`, `- **Premium** → Modelo`
   (adaptables al nicho). Luego un párrafo breve de contexto con 1-2 links internos.
   El pick "Mejor general" es el de la barra fija del móvil; si no hay picks, `topPick: "<producto>"` en el frontmatter.
2. **H2 de contexto del nicho** (100-150 palabras): por qué importa elegir bien y qué variables definen una buena opción.
3. **`## Tabla comparativa`** en **markdown** (no `ComparisonTable.astro`: ese componente heredado obliga a columnas de
   "Precio" y "Nota" que el sitio no puede publicar). Primera columna **`Modelo`**, cada fila empieza por el nombre
   exacto del producto; luego `Peso | Drop | Mejor para`. **Sin columna de precio.** La columna "Amazon" con
   botones la añade `scripts/conversion-buttons.py` cuando hay links (ver `article-linker`).
4. **Un H2 por producto**, con este formato exacto (lo usan `extractProducts` → `ItemList` y
   `rehype-product-anchors.mjs` → `#producto-N`):

   ```mdx
   ## 1. Marca Modelo — Subtítulo concreto (sin "versátil", "perfecto"…)

   **Mejor para:** <perfil de comprador concreto>

   <Párrafo: tecnología con nombre propio (FF Blast+, DNA Loft v3, PWRRUN+…), para quién es.>

   **Pros:**
   - 3-4 bullets cortos, con dato de ficha cuando lo haya (gramos, mm, material)

   **Contras:**
   - 2-3 honestos. Siempre al menos uno; nunca "no tiene contras".

   **Ideal si** <perfil concreto>.

   **Evítala si** <perfil concreto, sin datos nuevos>.

   <div class="aff-cta">
     <a href="PLACEHOLDER_AMAZON" class="btn-aff btn-aff--lg" target="_blank" rel="nofollow sponsored noopener">Ver precio actual y disponibilidad en Amazon →</a>
   </div>
   ```
   El CTA ya funciona como "precio actual en Amazon": nunca un precio estático. `article-linker` sustituye
   `PLACEHOLDER_AMAZON` por la URL real.
   En comparativas "X vs Y", los productos van como `## Nombre en detalle` o `## 1. Nombre — …`.
5. **H2 educativo** (200-300 palabras): cómo elegir (drop, pisada, superficie, peso del corredor, según el nicho),
   con una pregunta retórica al lector.
6. **`## ¿Qué talla pido?`** (80-120 palabras), justo antes de las FAQ. Partir de la variante del deporte
   (running/trail/entrenamiento/spinning/pádel: copiar de un artículo de esa categoría) y **reformularla**:
   no puede ser idéntica a la de otro artículo (ver Fase E). Solo afirmaciones de horma ampliamente conocidas.
7. **`## Preguntas frecuentes`**: mínimo 4, formato exacto (lo parsea `extractFAQ`; el FAQPage lo genera el layout,
   no hay que importar `FAQSchema.astro`):
   ```mdx
   **¿Pregunta?**
   Respuesta en una sola línea.
   ```
8. **`## Veredicto final`**: una entradilla con opinión jugada ("si solo compras una, que sea X") y una línea por
   perfil `- **Si ...:** Modelo` (nombre tal cual, para que el script le añada su botón). Nunca "cualquiera de
   estas opciones es excelente".
9. **`## Fuentes de los datos`**: una línea por modelo con los enlaces de donde salen peso, drop y especificaciones
   (`target="_blank" rel="noopener"`) y `Cómo seleccionamos y contrastamos los datos: [metodología](/metodologia/).`

Artículos informativos (sin productos): sin tabla, picks, CTA ni talla; cierre con `## Conclusión` + fuentes.

## Fase C — Reglas duras de contenido

- Tuteo de España, nunca voseo (`spain-language`).
- Sin precios en € en ningún sitio (cuerpo, tablas, títulos, metas). "Gama de entrada/media/alta/premium".
- Sin ratings, estrellas, reseñas ni valoraciones inventadas. **Ningún schema `Product`/`Offer`/`AggregateRating`**:
  el artículo genera `ItemList` (ver `seo-optimizer`, Fase D).
- **Sin experiencia propia inventada** ("después de probarla", "en nuestras tiradas"): contradice `/afiliados/` y
  `/metodologia/`. Sí: primera persona plural de opinión ("la que elegiríamos"), datos de ficha y análisis publicados
  citados ("en las pruebas de laboratorio de RunRepeat").
- Nombres oficiales de modelo. Sin urgencia falsa.

## Fase D — Pipeline al terminar el MDX (en este orden)

1. `spain-language` sobre el archivo nuevo.
2. `human-polish` sobre el archivo nuevo.
3. `seo-optimizer` sobre el archivo nuevo: 3-5 links internos salientes, y 1-2 entrantes desde artículos
   relacionados (actualizando su `updatedDate`). Si encaja en un grupo de `src/pages/running/index.astro` o
   `src/pages/comparativas/index.astro`, añadirlo ahí. El sitemap se genera solo.

## Fase E — Verificación

```bash
npm run build
grep -oE '"@type":"(Question|ListItem|BreadcrumbList)"' dist/<slug>/index.html | sort | uniq -c
# Lista negra de human-polish en el archivo nuevo: debe salir vacío (patrón completo en su SKILL.md)
grep -noiE "versátil|excepcional|óptim|robust|en resumen|en conclusión|cabe destacar|es importante destacar" src/content/articles/NN-*.mdx
grep -nE '^## .*versátil' src/content/articles/NN-*.mdx                    # vacío
# Bloque de talla no duplicado (pasar la ruta del archivo nuevo):
python3 - src/content/articles/NN-nombre.mdx <<'EOF'
import glob,re,sys
get=lambda f:(re.search(r'## ¿Qué talla pido\?\n\n(.*?)\n\n',open(f).read(),re.S) or [None,None])[1]
new=sys.argv[1]; t=get(new)
dup=[f for f in glob.glob('src/content/articles/*.mdx') if f!=new and get(f)==t]
print('DUPLICADO con',dup) if t and dup else print('talla OK')
EOF
```

## Commit y reporte

- Commit `feat: new article <slug>`, push a `main`, esperar deploy
  (`gh api repos/Valec5/guiadeportiva-es/commits/<sha>/status --jq '.state'`).
- Reporte: ruta del archivo, frontmatter completo, productos con su `PLACEHOLDER_AMAZON` listos para
  `article-linker`, interlinks de `seo-optimizer`, resultado del build.
- Actualizar "Historial" y "Pendientes" en `~/Guiadep/CLAUDE.md` (el artículo queda pendiente de links de Amazon).
