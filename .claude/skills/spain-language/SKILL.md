---
name: spain-language
description: Garantiza español peninsular en todo el texto de guiadeportiva.es - tuteo (nunca voseo), léxico de España en lugar de rioplatense/latinoamericano y sin modismos. Usar antes de cada commit que toque src/content/ o src/pages/, al cierre de article-generator (antes de human-polish) y manualmente sobre cualquier archivo.
---

# spain-language

El público del sitio es España. Todo el texto visible va en **tuteo peninsular**.

## Orden y límites

- Corre **antes** de `human-polish` (que trabaja sobre tuteo ya correcto) y al cierre de `article-generator`.
- Ortogonal a `seo-optimizer`: no cambia estructura, links, metas por SEO ni encabezados por SEO.
- Dónde aplica: `src/content/articles/*.mdx` (cuerpo y textos del frontmatter: `title`, `seoTitle`,
  `seoDescription`, `excerpt`), `src/pages/**/*.astro` (las legales guardan HTML dentro de un string `html`),
  textos de `src/components/*.astro`.
- No tocar: código, bloques de código, atributos HTML, URLs, slugs, nombres de producto o marca,
  campos técnicos del frontmatter (`slug`, `category`, fechas, `featured`, `topPick`).

## Voseo → tuteo

| Voseo | Tuteo | Voseo | Tuteo |
|---|---|---|---|
| tenés | tienes | sabés | sabes |
| querés | quieres | hacés | haces |
| buscás | buscas | preferís | prefieres |
| corrés | corres | pensás | piensas |
| podés | puedes | creés | crees |
| elegís | eliges | mirás | miras |
| necesitás | necesitas | probás | pruebas |
| para vos / vos | para ti / tú | usás | usas |
| sos | eres | encontrás | encuentras |
| empezás | empiezas | venís / jugás / perdés | vienes / juegas / pierdes |

Regla general: `-ás` → `-as`, `-és` → `-es`, `-ís` → `-es`, **ojo con los irregulares y los que diptongan**
(tener, querer, poder, venir, jugar, encontrar, perder, preferir, competir, empezar, probar, pensar).
Imperativos: elegí → elige, mirá → mira, probá → prueba, revisá → revisa, hacé → haz, fijate → fíjate;
con pronombre: hacelo → hazlo, probala → pruébala, elegila → elígela.

## Léxico y giros de España

| Rioplatense / LATAM | España |
|---|---|
| acá / allá | aquí / allí ("más allá de" es correcto) |
| livianas | ligeras |
| se achica | se reduce / se encoge (según contexto: diferencias → se reduce; prenda → se encoge) |
| recién empiezas | si acabas de empezar |
| ya usaste | ya has usado (pretérito perfecto para pasado reciente) |
| manejar (un coche) | conducir |
| plata (dinero) | dinero |
| remera | camiseta |
| championes | zapatillas |
| pileta | piscina |
| computadora | ordenador |
| celular | móvil |
| confiable | fiable |
| tomar clases | ir a clase |

Modismos a eliminar: che, laburo, boludo, bárbaro, copado, zarpado, piola, groso, posta, dale.

## Falsos positivos (NO cambiar)

`estás`, `está`, `más`, `además`, `demás`, `detrás`, `través`, `interés`, `revés`, `país`, `después`, `sí`, `así`,
`aquí`, `allí`, `qué`, futuros (`encontrarás`, `perderás`, `será`, `durará`), `antepié`, `mediopié`, "más allá",
"tenis" (el deporte), "GuíaDeportiva.es es".

## Verificación (desde la raíz; debe quedar en cero salvo falsos positivos)

```bash
python3 - <<'EOF'
import re,glob
VOS="tenés querés buscás corrés podés elegís necesitás sos empezás sabés hacés preferís pensás creés mirás probás usás encontrás venís jugás perdés obtenés competís pronás priorizás tomás".split()
LEX=[r"\bacá\b",r"(?<!más )\ballá\b",r"\blivian[oa]s?\b",r"\bse achica\b",r"\brecién\b",r"\bya usaste\b",r"\bmanejar\b",r"\bplata\b",
     r"\bremeras?\b",r"\bchampiones\b",r"\bpiletas?\b",r"\bcomputadoras?\b",r"\bcelular(es)?\b",r"\bvos\b",r"\bconfiables?\b",
     r"\bche\b",r"\blaburo\b",r"\bboludo\b",r"\bbárbaro\b",r"\bcopado\b",r"\bzarpado\b",r"\bpiola\b",r"\bgroso\b",r"\bposta\b",r"\bfijate\b",r"\bdale\b"]
for f in sorted(glob.glob('src/content/articles/*.mdx')+glob.glob('src/pages/**/*.astro',recursive=True)+glob.glob('src/components/*.astro')):
    s=re.sub(r'https?://\S+|href="[^"]*"','',open(f).read())
    hits=[w for w in VOS if re.search(rf'\b{w}\b',s,re.I)]+[m.group(0) for p in LEX for m in re.finditer(p,s,re.I)]
    if hits: print(f,hits)
EOF
# Revisión manual de candidatos (casi todo serán falsos positivos de la lista de arriba):
grep -rhoE "\b[A-Za-zñ]+(ás|és|ís)\b" src/content src/pages src/components | sort | uniq -c | sort -rn
grep -rhoE "\b[A-Za-zñ]+[áéí]\b" src/content src/pages src/components | sort | uniq -c | sort -rn
```

Reemplazar con coincidencia de palabra completa y respetando mayúsculas (Tenés → Tienes). Cambiar un encabezado
cambia su ancla: revisar links internos a esa ancla.

De paso, reportar erratas evidentes (palabras repetidas, tildes que faltan en "también", "técnica", "análisis"…,
palabras que no existen) y corregirlas si no hay duda.

## Reporte

- Reemplazos por archivo, con conteo por tipo (voseo, léxico, modismo).
- Erratas corregidas de paso.
- Resultado del grep final (cero, o lista de falsos positivos justificados).
