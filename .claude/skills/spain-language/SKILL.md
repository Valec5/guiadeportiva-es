---
name: spain-language
description: Garantiza que todo el texto de guiadeportiva.es esté en español de España (tuteo peninsular, sin voseo ni modismos rioplatenses). Usar siempre que se escriba o edite contenido del sitio (artículos MDX, páginas .astro, meta descriptions, textos de componentes) y antes de cada commit que toque texto.
---

# spain-language

El público del sitio es España. Todo el texto visible va en **tuteo peninsular**. Nunca voseo.

## Dónde aplica

- `src/content/articles/*.mdx` (cuerpo y frontmatter: `title`, `seoTitle`, `seoDescription`, `excerpt`)
- `src/pages/**/*.astro` (incluidas las legales, que guardan HTML dentro de un string `html`)
- Textos en `src/components/*.astro`

No tocar: código, nombres de variables, URLs, slugs, atributos HTML, nombres de productos o marcas.

## Reglas

**Presente (voseo → tuteo):** tenés → tienes, querés → quieres, podés → puedes, sos → eres, buscás → buscas,
corrés → corres, necesitás → necesitas, elegís → eliges, empezás → empiezas, sabés → sabes, hacés → haces,
venís → vienes, jugás → juegas, preferís → prefieres, perdés → pierdes, obtenés → obtienes,
encontrás → encuentras, competís → compites, pronás → pronas, priorizás → priorizas, tomás → tomas.
Regla general: `-ás` → `-as`, `-és` → `-es`, `-ís` → `-es`, **ojo con los verbos que diptongan o son irregulares**
(tener → tienes, querer → quieres, poder → puedes, venir → vienes, jugar → juegas, encontrar → encuentras,
perder → pierdes, preferir → prefieres, competir → compites, empezar → empiezas).

**Imperativos:** elegí → elige, mirá → mira, probá → prueba, revisá → revisa, consultá → consulta,
encontrá → encuentra, descubrí → descubre, empezá → empieza, dejá → deja, bajá → baja, evitá → evita,
comprá → compra, hacé → haz, fijate → fíjate.
Con pronombre pegado (no llevan tilde en voseo): hacelo → hazlo, comparala → compárala, probala → pruébala,
elegila → elígela, mirala → mírala.

**Pronombres y adverbios:** vos → tú, para vos → para ti, con vos → contigo, acá → aquí, allá → allí
(pero "más allá de" es correcto y se mantiene).

**Modismos rioplatenses:** eliminar (che, laburo, re + adjetivo, "dale", "boludo", etc.).

## Falsos positivos (NO cambiar)

`estás`, `está`, `más`, `además`, `demás`, `detrás`, `través`, `interés`, `estrés`, `sí`, `así`, `aquí`, `qué`,
futuros (`encontrarás`, `perderás`, `será`), `antepié`, `mediopié`, `Más allá`.
En el grep de imperativo + pronombre aparecen sustantivos normales: `modelo(s)`, `entresuela`, `paralela`.

## Verificación antes de commitear

Correr desde la raíz del proyecto y revisar cada resultado (deberían quedar solo falsos positivos):

```bash
# Presente voseante (-ás/-és/-ís)
grep -rhoE "[A-Za-zñ]+(ás|és|ís)\b" src --include='*.mdx' --include='*.astro' | sort | uniq -c | sort -rn
# Imperativos voseantes (-á/-é/-í)
grep -rhoE "[A-Za-zñ]+[áéí]\b" src --include='*.mdx' --include='*.astro' | sort | uniq -c | sort -rn
# Imperativo + pronombre, vos/sos/acá
grep -rnowE "vos|sos|acá|che|laburo|fijate|[A-Za-z]+(elo|ela|alo|ala|ilo|ila)" src --include='*.mdx' --include='*.astro'
```

Reemplazar con coincidencia de palabra completa y respetando mayúsculas (Tenés → Tienes).
Cambiar el encabezado de una sección cambia su ancla (`#...`); el índice se regenera solo, pero revisar
si algún link interno apunta a esa ancla.

Si se modificó el cuerpo de un artículo, actualizar su `updatedDate` a la fecha de hoy.
