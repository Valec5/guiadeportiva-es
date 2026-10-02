# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Corredores aficionados y amateurs en España, de 25 a 50 años, que están a punto de gastar entre 100 y 300 € en unas
zapatillas y buscan una recomendación honesta antes de comprar. También lectores de otros deportes cubiertos por el
sitio (trail, crossfit, gimnasio, spinning, pádel). Aproximadamente el 70 % del tráfico llega desde el móvil, casi
siempre a un artículo concreto desde Google.

## Product Purpose

GuíaDeportiva.es es un sitio de guías de compra de calzado deportivo, financiado con el programa de afiliados de
Amazon España (Amazon Associates). Cada guía compara modelos con datos técnicos contrastados (peso, drop, espuma,
tecnologías) y recomienda uno por perfil de corredor. El éxito es que el lector entienda qué zapatilla le encaja y
haga clic en el CTA de afiliado hacia Amazon para ver precio y disponibilidad.

## Positioning

Criterio técnico con fuentes: cada dato de las fichas sale de la marca o de análisis publicados (RunRepeat,
Running Shoes Guru, RTINGS) y se cita en "Fuentes de los datos" al final de cada artículo. Recomendaciones por
perfil con opinión explícita, sin marketing agresivo ni clickbait.

## Operating Context

- Lectura larga en móvil: el lector llega por búsqueda, escanea el resumen y la tabla, lee la ficha del modelo que le
  interesa y decide.
- Conversión principal: clic al CTA `.btn-aff--lg` dentro de `.aff-cta`, con el texto fijo
  "Ver precio actual y disponibilidad en Amazon →". Botones compactos `.btn-aff--sm` ("Ver en Amazon") en resumen,
  tabla y veredicto, y barra fija móvil con el pick "Mejor general".
- Superficies: portada, archivos de categoría (/running/, /comparativas/), artículo tipo (`ArticleLayout.astro`, con
  tabla de contenidos lateral, barra de progreso de lectura y breadcrumbs), páginas estáticas (sobre-nosotros,
  metodología, afiliados, contacto) y legales (privacidad, cookies, aviso legal).

## Capabilities and Constraints

- Stack: Astro 4 + MDX + Tailwind, sitio estático, deploy en Vercel con cada push a `main`.
- Structured data desde `ArticleLayout.astro` (no se importa en el MDX): Article, BreadcrumbList, FAQPage e ItemList.
  Nunca Product/Offer/AggregateRating.
- Sin cookies, sin analítica y sin recursos de terceros (tipografías autoalojadas con fontsource).
- Imágenes de producto: no hay hasta tener acceso a la API de Amazon. No se descargan imágenes de Amazon ni de
  fabricantes; solo imágenes OG propias generadas en el build.

## Brand Commitments

- Idioma: español peninsular, tuteo, **nunca voseo**.
- Tono: profesional y cercano, con criterio técnico (gramaje, drop, materiales). Nada de marketing agresivo ni clickbait.
- Identidad visual fijada por el usuario (binding): color primario naranja `#E8500A`; base blanca con grises oscuros
  cálidos; tipografías Bricolage Grotesque (titulares), Inter (texto) y JetBrains Mono (datos técnicos: pesos, drops).
- Antipatrones vetados por el usuario: gradientes decorativos sin función, glassmorphism, dark mode llamativo o neón,
  iconos decorativos sin significado, la combinación Inter + Space Mono, botones pill exagerados, sombras genéricas
  tipo `shadow-lg`, separadores decorativos sin información.
- El texto del CTA principal es fijo; solo se puede cambiar su estilo.

## Evidence on Hand

- 25 artículos en `src/content/articles/*.mdx`, cada uno con `## Fuentes de los datos`.
- Página `/metodologia/` y `/afiliados/` que declaran que las recomendaciones se basan en especificaciones, datos del
  fabricante y opiniones de usuarios.
- **No existen y no se pueden inventar:** precios (no se publican), ratings, valoraciones o reseñas, testimonios,
  pruebas físicas propias ("probamos", "testamos"), fotos del equipo (la de "Sobre nosotros" es un marcador).

## Product Principles

1. La honestidad convierte: datos con fuente y opinión clara, nunca claims inventados.
2. El artículo es el producto: legibilidad de lectura larga en móvil antes que decoración.
3. El CTA invita sin gritar: visible y fácil de pulsar, nunca con aspecto de banner publicitario.
4. Coherencia entre portada, artículos, comparativas y páginas estáticas.

## Accessibility & Inclusion

- Lectura cómoda en móvil (tamaño de texto que no dispare el zoom de iOS, tap targets de al menos 44-48 px).
- Contraste WCAG AA en texto y controles; foco visible en elementos interactivos.
