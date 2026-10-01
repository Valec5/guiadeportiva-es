---
name: human-polish
description: Quita el tono de texto generado por IA de los artículos de guiadeportiva.es (vocabulario delator, ritmo plano, voz neutra, adjetivos vacíos) sin tocar datos, SEO ni estructura. Usar automáticamente después de article-generator y de spain-language, antes de cada commit que toque src/content/articles/, y manualmente sobre cualquier artículo existente.
---

# human-polish

Google penaliza el contenido genérico desde las updates de 2024 y los lectores lo detectan en segundos.
Esta skill reescribe la prosa para que suene a una persona con criterio, no a un modelo.

## Orden y límites

- Corre **después** de `article-generator` (artículos nuevos) y **después** de `spain-language` (no deshacer el tuteo).
- Es ortogonal a `seo-optimizer`: **nunca** toca encabezados H2/H3, schemas, links internos ni campos SEO del
  frontmatter (`title`, `seoTitle`, `seoDescription`, `excerpt`, `keyword`, `slug`). Sí actualiza `updatedDate`
  (regla del sitio al cambiar contenido).
- No toca: tablas, botones/links de afiliado, `## Fuentes de los datos`, preguntas de las FAQ (`**¿...?**`),
  formato `**Pros:**` / `**Contras:**` / `**Ideal si**` / `**Evítala si**` (solo su contenido).
- **Nunca borra información factual.** Si reescribe una frase con un dato, el dato sigue.
- Todas las reglas del sitio siguen vigentes: sin precios, sin ratings, nombres oficiales, tuteo,
  **no afirmar pruebas físicas** de las zapatillas (ver fase 3).

## Fase 1 — Vocabulario delator

Reescribir en contexto (no basta con borrar la palabra: la frase tiene que seguir diciendo algo).

| Tipo | Lista negra |
|---|---|
| Aperturas | "En el mundo de…", "En la era de…", "En el competitivo mundo de…", "Si estás buscando…", "¿Alguna vez te has preguntado…?" |
| Relleno | "Es importante destacar/mencionar/señalar", "Cabe destacar/mencionar", "Vale la pena señalar", "No es un secreto que", "Sin lugar a dudas", "Como ya sabrás" |
| Marketing hueco | "Desbloquea tu potencial", "Lleva tu X al siguiente nivel", "Experiencia única", "La elección perfecta para", "revolucionario", "innovador", "de vanguardia" (salvo tecnología realmente nueva, p. ej. la placa de carbono en 2017), "Sumérgete en", "Embárcate en" |
| Adjetivos vacíos | "robusto", "versátil", "integral", "óptimo", "excepcional" |
| Dobles decorativos | "cómoda y transpirable", "ligera y resistente", "duradera y confortable" |
| Cierres | "En resumen", "En conclusión", "Esperamos que esta guía", "¡No esperes más!" |

"Versátil" se sustituye diciendo **para qué** sirve ("vale para rodajes, series y tiradas largas").
"Excepcional" se sustituye por el hecho que lo justifica ("tacos de 5,8 mm que muerden el barro").

## Fase 2 — Ritmo

- Detectar párrafos de 3-4 oraciones de longitud parecida y romperlos.
- Al menos una oración corta (3-6 palabras) cada 3 párrafos.
- Al menos un párrafo de una sola oración por sección H2 de prosa (las secciones de tablas o listas no cuentan).
- Conectores: máximo 2 "Además" y 1 "Por otro lado" por artículo.

## Fase 3 — Voz

- Juicios concretos en primera persona del plural, de vez en cuando:
  "Puede resultar algo pesada" → "Nos parece demasiado pesada para ritmos rápidos".
  **Sin umbrales inventados** (nada de "por debajo de 65 kg" si no hay fuente).
- **Marcadores de experiencia: solo los reales.** El sitio no prueba físicamente las zapatillas
  (la página de afiliados lo declara). Prohibido: "después de probarla", "en las tiradas que hicimos",
  "comparándola lado a lado". Permitido: experiencia de análisis atribuida a su fuente
  ("en las pruebas de laboratorio de RunRepeat", "repasando las tres últimas versiones en sus fichas",
  "es la queja que más se repite entre usuarios"). Si algún día se prueban de verdad, se actualizan
  esta regla, la metodología y la página de afiliados a la vez.
- Comparaciones laterales con modelos del mismo rango, **solo si las respaldan datos de ficha**:
  "misma filosofía que la Adrenaline (GuideRails) con 2 mm menos de drop". Nada de sensaciones
  inventadas ("se siente como una Nimbus 25 pero más firme") sin una fuente que lo diga.

## Fase 4 — Datos específicos

- Donde diga "ligera", "amortiguada", "con buen drop": añadir el dato concreto **si ya está en la tabla del
  artículo o en una fuente de `## Fuentes de los datos`**: gramos, drop en mm, altura de stack, espuma
  (FF Blast+, DNA Loft v3, PWRRUN+…).
- Si el dato no está con certeza: mantener la descripción cualitativa, pero con comparación verificable
  ("la más ligera de las tres de esta guía con peso publicado") en vez del adjetivo suelto.
- Dato nuevo = fuente nueva en `## Fuentes de los datos`. Sin fuente, no se publica.

## Fase 5 — Imperfecciones controladas (por artículo)

- 1-2 oraciones que empiecen por "Y" o "Pero".
- 1 paréntesis con aclaración lateral (ojo, no confundir con el modelo anterior).
- 1 "la verdad" o "sinceramente" en el veredicto o en su entradilla.
- 1 pregunta retórica real al lector en la parte educativa (guía de compra, "cómo elegir", etc.).

## Fase 6 — Verificación final

- Ningún par de párrafos consecutivos con la misma estructura de arranque.
- No más de 3 bullets seguidos de longitud casi idéntica en una lista.
- Lista negra en cero en la prosa (o justificada: p. ej. "integral" como término técnico). Las apariciones en
  encabezados, tablas y frontmatter son terreno de `seo-optimizer`: se listan, no se tocan.
- **No introducir cifras nuevas sin fuente** al reescribir (porcentajes, meses, km): es fácil colarlas en un veredicto.
- El veredicto tiene al menos una opinión jugada ("si solo compras una, que sea X"), nunca
  "cualquiera de estas opciones es excelente".
- Reglas de siempre: `spain-language` (greps), sin precios, sin ratings, no afirmar pruebas físicas,
  `npm run build` en verde.

Grep de la lista negra (desde la raíz del proyecto):

```bash
grep -rnoiE "en el (competitivo )?mundo de|en la era de|si estás buscando|alguna vez te has preguntado|es importante (destacar|mencionar|señalar)|cabe (destacar|mencionar)|vale la pena señalar|no es un secreto|sin lugar a dudas|como ya sabrás|desbloquea|siguiente nivel|experiencia única|elección perfecta|revolucionari|innovador|de vanguardia|sumérgete|embárcate|\brobust[oa]s?\b|\bversátil(es)?\b|\bintegral(es)?\b|\bóptim[oa]s?\b|\bexcepcional(es)?\b|en resumen|en conclusión|esperamos que esta guía|no esperes más" src/content/articles
grep -rcw "Además" src/content/articles   # máximo 2 por archivo
```

Grep de experiencia falsa (debe salir vacío; "hicimos el mismo análisis" de marcas es un falso positivo válido):

```bash
grep -rniE "(las|la) (hemos )?probad|después de probar|tras probar|hicimos|en nuestras pruebas|lado a lado|probamos" src/content/articles
```
