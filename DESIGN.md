---
name: GuíaDeportiva.es
description: Guías de compra de zapatillas deportivas con criterio técnico, para leer en el móvil y decidir.
colors:
  orange: "#E8500A"
  orange-dark: "#C7440A"
  orange-tint: "#FBEFE7"
  ink: "#1A1714"
  ink-soft: "#57514B"
  ink-faint: "#6E675F"
  ink-body: "#332F2B"
  orange-ink: "#B5400A"
  foot-text: "#CFC8C1"
  foot-muted: "#A39B93"
  paper: "#FFFFFF"
  paper-warm: "#FAF7F4"
  paper-warm-2: "#F4EFE9"
  line: "#E7E0D8"
  line-strong: "#D8CFC4"
  green: "#1E7A47"
  green-tint: "#E7F2EB"
  red: "#B23A2E"
  red-tint: "#F6E9E7"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Inter, sans-serif"
    fontSize: "clamp(40px, 6.5vw, 74px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, Inter, sans-serif"
    fontSize: "clamp(32px, 5vw, 52px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque, Inter, sans-serif"
    fontSize: "clamp(26px, 3vw, 32px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "17.5px"
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1.45
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    fontFeature: "tnum"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.1em"
rounded:
  xs: "5px"
  sm: "8px"
  md: "10px"
  lg: "14px"
spacing:
  sp-1: "8px"
  sp-2: "12px"
  sp-3: "16px"
  sp-4: "24px"
  sp-5: "40px"
  sp-6: "56px"
  pad: "clamp(20px, 5vw, 64px)"
  maxw: "1200px"
  measure: "68ch"
components:
  button-affiliate-lg:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
    height: "48px"
  button-affiliate-sm:
    backgroundColor: "{colors.orange-dark}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "7px 12px"
  button-primary:
    backgroundColor: "{colors.orange-dark}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  tag:
    backgroundColor: "{colors.orange-tint}"
    textColor: "{colors.orange-ink}"
    rounded: "{rounded.xs}"
    padding: "5px 11px"
---

# Design System: GuíaDeportiva.es

<!-- Documentado el 2026-10-01 a partir del código (src/styles/global.css, tailwind.config.mjs, src/components/*.astro)
     y actualizado tras la pasada de audit/polish del mismo día. -->

## Overview

**Creative North Star: "El cuaderno técnico del corredor"**

Un sitio de lectura antes que de escaparate: papel cálido, tinta casi negra y un único naranja que marca lo que
importa (la decisión y el clic a Amazon). Los datos técnicos (peso, drop, fechas, etiquetas) hablan en monoespaciada,
como apuntes de un cuaderno de entrenamiento; los titulares, en una grotesca con carácter. La densidad es de revista:
columnas de lectura de ~70 caracteres, aire generoso entre bloques y muy poca ornamentación.

El usuario descartó explícitamente gradientes decorativos, glassmorphism, modo oscuro llamativo, iconos decorativos,
botones pill exagerados, sombras genéricas y separadores sin información.

**Key Characteristics:**
- Papel cálido (`#FAF7F4`) para cabeceras y bandas; blanco para la columna de lectura.
- Un solo acento, naranja `#E8500A`, reservado para CTA, enlaces y marcas de estado.
- Mono (JetBrains Mono) para metadatos y datos técnicos; nunca para párrafos.
- Bordes finos cálidos (`#E7E0D8`) en lugar de sombras para separar superficies.

## Colors

Paleta cálida y sobria con un único acento.

### Primary
- **Naranja Pista** (#E8500A): CTA de afiliado, botón principal, barra de progreso, viñetas de lista, marca del logo.
- **Naranja Tostado** (#C7440A): fondo de botones con texto pequeño (`.btn-aff--sm`, `.btn-primary`: 4,9:1 con blanco)
  y anillo de foco.
- **Naranja Tinta** (#B5400A): todo texto naranja sobre fondo claro (enlaces, etiquetas, índice activo): 5,7:1.
- **Naranja Velo** (#FBEFE7): fondo de etiquetas (`.tag`) e iconos de categoría.

### Neutral
- **Tinta** (#1A1714): titulares, texto fuerte, fondo del footer y del botón "Ver guías".
- **Tinta Suave** (#57514B): texto secundario, entradillas, bio.
- **Tinta Tenue** (#6E675F): metadatos, migas de pan, etiquetas mono (5,6:1 sobre blanco).
- **Tinta de Lectura** (#332F2B): párrafos y listas de la prosa.
- **Papel** (#FFFFFF) / **Papel Cálido** (#FAF7F4) / **Papel Cálido 2** (#F4EFE9): fondos.
- **Línea** (#E7E0D8) / **Línea Fuerte** (#D8CFC4): bordes y divisores.
- Verde (#1E7A47) y rojo (#B23A2E) con sus tintes: reservados para pros/contras (componentes heredados).

### Named Rules
**The One Orange Rule.** El naranja marca acción o estado; no se usa como decoración de fondo en superficies grandes.

**The Two Oranges Rule.** `#E8500A` solo como superficie con texto blanco grande (CTA principal a 19px/700, que es
"texto grande" WCAG con 3,76:1) o como elemento no textual (viñetas, barra de progreso, bordes de estado). Para texto
naranja, `#B5400A`; para botones con texto pequeño, `#C7440A`.

## Typography

**Display Font:** Bricolage Grotesque (fallback Inter, sans-serif)
**Body Font:** Inter (fallback system-ui)
**Label/Mono Font:** JetBrains Mono (fallback ui-monospace)

**Character:** una grotesca expresiva y comprimida para titulares, un texto neutro y muy legible para leer largo, y una
mono que da tono de ficha técnica a los datos. Las tres están autoalojadas (fontsource).

### Hierarchy
- **Display** (800, clamp(40px, 6.5vw, 74px), 0.98): solo el H1 de la portada.
- **Headline** (700, clamp(32px, 5vw, 52px), 1.06): un único H1 para artículos (`.art-head h1`), páginas estáticas
  (`.page-title`) y categorías (`.cat-title`).
- **Title** (700, clamp(26px, 3vw, 32px), 1.15): H2 de la prosa, 56px arriba y 16px abajo. H3: 600, clamp(19px, 2vw, 21px).
- **Body** (400, 17.5px, 1.7; primer párrafo 18-19.5px): `.prose`, medida máx. 68ch. Listas a 16.5px/1.65.
- **Body-sm** (15px/1.6): bio, tarjetas, tablas. **Caption** (13-13.5px): migas, índice, botones compactos.
- **Data** (JetBrains Mono 14px, cifras tabulares): celdas numéricas de las tablas (`td.num`: gramos, mm).
- **Label** (500, 11-12.5px, tracking 0.06-0.14em, mayúsculas): eyebrows, etiquetas, cabeceras de tabla, migas, meta.

## Layout

- Contenedor `.wrap`: máx. 1200px con padding lateral `clamp(20px, 5vw, 64px)`.
- Artículo: rejilla `240px | 1fr` con índice lateral sticky (`top: 96px`) a partir de 900px; por debajo, una columna y
  sin índice. Barra de progreso fija de 3px arriba.
- Bandas a sangre (`.hero`, `.art-head`, `.page-head`, `.related`, `.posts-section`) en papel cálido con borde de 1px.
- Escala de espaciado: 8 / 12 / 16 / 24 / 40 / 56 px (`--sp-1`…`--sp-6`). Prosa: párrafos y listas 24px; H2 56/16;
  H3 40/12; tablas 24/40; CTA de afiliado 40px arriba y abajo.
- Índice: lateral sticky (`top: header + 24px`) en ≥900px; plegable (`details.toc-mobile`) bajo el aviso de
  transparencia en móvil. La rejilla usa `minmax(0, 1fr)` para que las tablas anchas no desborden la página.
- Móvil: barra fija inferior con el pick principal (`StickyPick`), menú en cajón lateral.

## Elevation & Depth

Plano por defecto, con capas tonales (papel blanco sobre papel cálido) y bordes finos. Las sombras aparecen solo como
respuesta a estado (hover de tarjetas) o para separar elementos fijos (barra móvil, cajón).

### Shadow Vocabulary
- **CTA en reposo** (`0 1px 2px rgba(199,68,10,.25)`), **hover** (`0 10px 22px -10px rgba(232,80,10,.45)` con
  `translateY(-2px)`, solo con `hover: hover`) y **activo** (`0 2px 6px -2px rgba(232,80,10,.4)`).
- Las tarjetas no llevan sombra: en hover cambian el borde a naranja.
- **Barra fija** (`0 -10px 30px -18px rgba(26,23,20,.35)`): `StickyPick` en móvil.

## Shapes

Esquinas suavemente redondeadas, nunca pill: 5px en etiquetas, 8px en botones pequeños y enlaces de navegación,
10-11px en botones, 14px en tarjetas y cajas. Bordes de 1px en tono cálido.

## Components

### Buttons
- **CTA de afiliado grande** (`.aff-cta .btn-aff--lg`): `#E8500A`, texto blanco 19px/700, 14px 28px (16px 24px y
  ancho completo en móvil), mín. 48px de alto, radio 10px. Caja `.aff-cta` en papel cálido con borde, 40px arriba y
  abajo. Foco: contorno 2px `#C7440A` con 2px de separación. Texto fijo: "Ver precio actual y disponibilidad en Amazon →".
- **CTA compacto** (`.btn-aff--sm`): `#C7440A`, 13.5px/600, 7px 12px (mín. 40px de alto en táctil), radio 8px.
- **Primario** (`.btn-primary`, `#C7440A`) y **secundario** (`.btn-secondary`): portada y contacto, mín. 48px.

### Cards / Containers
- Tarjetas de artículo y relacionadas: blanco, borde `#E7E0D8`, radio 14px, imagen OG 1200/630 arriba.
- Cajas de nota (`.disclosure`, `.bio`, `.team-card`): papel cálido, borde fino, radio 14px.

### Navigation
- Cabecera sticky de 72px, fondo blanco translúcido con desenfoque, enlaces 15px/500 con fondo cálido en hover.
- Migas de pan en mono 12.5px, separador `/`.
- Índice lateral: mono en mayúsculas para el título, enlaces 14px con borde izquierdo naranja en el activo.

### Tablas comparativas
Markdown envuelto en `.table-scroll` (scroll horizontal con sombras de borde; `src/lib/rehype-table-scroll.mjs`).
Ancho completo de la columna de lectura; primera columna (modelo) fija al desplazar; cabeceras Inter 13px/600 sobre
papel cálido; celdas de 14px 16px; filas separadas por borde de 1px, sin cebreado; celdas numéricas en mono (`td.num`).

## Do's and Don'ts

### Do:
- **Do** usar el naranja `#E8500A` solo para acción y estado.
- **Do** escribir pesos, drops y metadatos en JetBrains Mono.
- **Do** separar superficies con bordes cálidos de 1px antes que con sombras.

### Don't:
- **Don't** publicar precios, ratings, estrellas ni valoraciones en ningún componente.
- **Don't** cambiar el texto del CTA de afiliado.
- **Don't** usar gradientes decorativos, glassmorphism, modo oscuro llamativo, iconos decorativos, botones pill
  exagerados, sombras genéricas tipo `shadow-lg` ni separadores sin información.
- **Don't** combinar Inter con Space Mono.
- **Don't** poner eyebrows o rótulos encima de los titulares, iconos decorativos en tarjetas ni bordes laterales de color
  de más de 1px en cajas.
- **Don't** usar `#E8500A` para texto de tamaño normal (no llega a AA): usa `#B5400A`.
