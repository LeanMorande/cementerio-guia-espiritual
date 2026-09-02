# INFORME DEFINITIVO — Bug: el `<audio>` vuelve a 0 al hacer *seek* en Chrome/Android móvil

> **Para:** IA / desarrollador que se encargará de resolver el bug de una vez.
> **Rol:** este informe es EL punto de partida. Contiene el estado real del repo, TODAS las
> pruebas hechas (con resultado), los datos de diagnóstico, lo DESCARTADO, y la dirección
> recomendada. Se incluye además el dato más reciente: **el archivo reexportado con Audacity
> tampoco lo resolvió**, que descarta varias teorías.

---

## 1. Resumen ejecutivo

- App React (Vite), un único `<audio>` nativo (`preload="metadata"`).
- Los MP3 se sirven desde un **Cloudflare Worker** (`cementerio-guia-espiritual.ldmorande.workers.dev`),
  que proxya a los archivos del repo (`public/sounds/*.mp3`). El worker se recluye desde GitHub;
  tras un push tarda ~5-20 s en propagar (verificado con `curl` por tamaño del archivo).
- Síntoma: en **Chrome/Android** (Poco X6 Pro), en CIERTOS pasos *modo-canto*, al hacer seek a
  una posición (barra de progreso o botón "retroceder 10 s") el audio **vuelve a 0.0 y se
  reinicia**. En **desktop NO ocurre**.
- En los pasos que fallan, los logs del `<audio>` (con eruda) muestran:
  `rdy=4 (HAVE_ENOUGH_DATA)`, `net=1 (IDLE)` → el buffer/descarga está **COMPLETO**, pero
  **`seekable = [0.0-0.0]`** (rango de salto vacío). Por eso todo seek cae a 0.
- **Confirmado en player NATIVO de Chrome (sin la app):** abriendo la URL directa del `.mp3`,
  `canto_hijo_prodigo.mp3` **no se adelanta** (se reinicia), mientras `diario_de_maria.mp3` **sí**
  se adelanta. → El bug NO es de la app, es del contenido/servicio del MP3 frente a Chromium.
- **Dato más reciente:** `canto_hijo_prodigo.mp3` se reexportó con **Audacity** (ahora `Xing=True`,
  167 kbps, 5.6 MB, sin ID3) y **AÚN SIGUE SIN ADELANTARSE**. Esto **descartó** la hipótesis
  "cabecera Xing ⇒ seekable".
- Ya se probaron re-codificaciones FFmpeg (192k CBR, 320k CBR, decode→WAV→encode, LAME) sin éxito.

**Dirección recomendada:** el problema persiste igual en el player nativo y con otro encoder.
El punto común (tanto el archivo original como el de Audacity, y a la vez diario_de_maria SÍ funciona
por el MISMO worker) es la dupla **archivo + servicio HTTP del worker**. Falta probar la vía diagonal
decisiva: **reproducir desde un Blob completo** (fetch→`URL.createObjectURL`) de esos mismos `.mp3`;
eso separa definitivamente "archivo" de "streaming/Range" del worker.

---

## 2. Síntoma y criterios de reproducción

- **Dispositivo:** Chrome Android — Poco X6 Pro, Android reciente, wifi rápido.
- **Solo móvil.** En desktop (Chrome/Firefox) y en DevTools mobile-emulation suele NO fallar
  (el buffer se completa antes del primer seek).
- **Pasos implicados** (*modo-canto*):
  - FALLAN: `p4_canto` (`canto_hijo_prodigo.mp3`), `p6_canto` (`salmo_51.mp3`), y se reportó
    también `m7_canto` (`miserere.mp3`, camino María) en algún momento.
  - FUNCIONAN (largos/canto, buenas referencias): `m5_canto` (`diario_de_maria.mp3`, 312 s),
    `p10_canto` (`oracion_pueblos.mp3`, 126 s), `canto_trinidad.mp3`, `padre_nuestro_ave_gloria.mp3`.
- El botón **▶/⏸ siempre funciona**. El **retroceder 10 s (`rewind`)** también provoca el reset a 0
  en los pasos que fallan.
- No correlaciona con tamaño (diario_de_maria 12 MB funciona; miserere 12 MB falla) ni con
  bitrate nominal aislado.

---

## 3. Evidencia de diagnóstico (logs reales del `<audio>` vía eruda)

La app está instrumentada (`logAudio`) y en cada evento (`seeking/seeked/waiting/stalled/emptied/
abort/playing/loadeddata/canplay/error`) imprime: `ct=currentTime`, `dur`, evento, `rdy=readyState`,
`net=networkState`, `seek=[...]`, `+Δtms`.

### 3.1 En un paso que FALLA (dur 269.1 s ≈ canto_hijo_prodigo) — log real
```
[audio] ct=0.00 dur=269.1 seeking rdy=1 net=1 seek=[0.0-0.0]
[audio] ct=0.00 dur=269.1 waiting rdy=1 net=1 seek=[0.0-0.0]
[audio] ct=0.00 dur=269.1 seeked  rdy=4 net=1 seek=[0.0-0.0]   ← Chrome "completa" el seek…
[audio] ct=0.00 dur=269.1 canplay rdy=4 net=1 seek=[0.0-0.0]
[audio] ct=0.00 dur=269.1 playing rdy=4 net=1 seek=[0.0-0.0]   ← …pero ct queda en 0.00
```
(Se repite por el watchdog de `applySeek`, con saltos de ~90 ms y largos de +29 s/+144 s.)

**Lectura:** `rdy=4` + `net=1` = Chromium dice tener datos "hasta el final" y no descargando;
pese a eso `seekable` es `[0.0-0.0]`. Chromium considera el stream **no posicionable**. Reasignar
`currentTime` repetidas veces NO puede mover un seekable vacío → ningún "reintento en JS" lo arregla.

### 3.2 En un paso funcional (m5_canto, diario_de_maria, dur 311.8 s) — log real
```
[audio] ct=0.00 dur=311.8 canplay rdy=4 net=1 seek=[0.0-311.8]
[audio] ct=49.01  dur=311.8 seeking rdy=1 net=1 seek=[0.0-311.8]   ← seekable COMPLETO
[audio] ct=49.01  dur=311.8 seeked  rdy=4 net=1 seek=[0.0-311.8]
[audio] ct=211.23 dur=311.8 seeking ... seek=[0.0-311.8]           ← respeta el target
```

**Conclusión:** `seekable` es la diferencia objetiva y medible. Los que funcionan dan
`seekable=[0..durTotal]` ya desde `loadeddata`; los que fallan dan `seekable=[0..0]` aun en `rdy=4`.

---

## 4. PRUEBA CLAVE YA HECHA: player NATIVO (separa app vs contenido)

Se abrió en Chrome del Poco la URL **directa** del `.mp3` (sin la app), se esperó ~5 s y se arrastró
la barra nativa:

| URL `/sounds/...mp3`                          | ¿Se adelanta en player nativo? | Conclusión |
|-----------------------------------------------|-------------------------------|------------|
| `diario_de_maria.mp3`                         | ✅ Sí                          | archivo/stream busca bien |
| `canto_hijo_prodigo.mp3` (original CapCut)    | ❌ No, se reinicia             | contenido no seekable por Chromium |
| `canto_hijo_prodigo.mp3` (Audacity reexport)  | ❌ No, sigue igual             | **re-export NO lo arregló** |

**Conclusión sólida:** no es tu app. Es la combinación **archivo MP3 + servidor/streaming**. Punto
común (original Y Audacity, ambos en el mismo worker): el archivo `.mp3` de `canto_hijo_prodigo`
falla; `diario_de_maria`, por el mismo worker, funciona. → Primer sospechoso serio: **cómo sirve el
worker los bytes** (Range/206) de esos archivos. Con el dato de Audacity además queda claro que NO es
atribuible al encoder de CapCut.

---

## 5. Comprobación objetiva del deploy/streaming (para la próxima IA)

Propagación del worker (útil para verificar cache por tamaño):
```
curl -s -o NUL -w "%{http_code} %{content_type} %{size_download}"
  https://cementerio-guia-espiritual.ldmorande.workers.dev/sounds/canto_hijo_prodigo.mp3
→ 200 audio/mpeg  <size>
```
**Acción recomendada de la próxima IA (antes de tocar más código):** comparar con `curl` sobre un
archivo que FALLA vs uno que funciona, inspeccionando:
- `curl -I` → ¿hay `Accept-Ranges: bytes`?, `Content-Length`, `ETag`.
- `curl -H "Range: bytes=0-1023" -I` → ¿responde `206 Partial Content` con `Content-Range`?

Si el worker NO emite `Accept-Ranges` o no responde 206 correctamente para ciertos archivos, esa es
una causa raíz muy creíble que explica TODA la sintomatología (desktop tolerante, móvil no).

---

## 6. DOSSIER de archivos (estado actual, commit 5ca26ae)

Medido con `ffprobe` + barrido de cabecera (primeros 512 KiB).

| archivo | paso | kbps* | dur(s) | Xing | Info | LAME | ¿seek móvil? |
|---------|------|------:|-------:|:----:|:----:|:----:|:---:|
| diario_de_maria.mp3 | m5_canto | 320 | 312 | F | T | T | ✅ |
| oracion_pueblos.mp3 | p10_canto | 320 | 126 | F | T | T | ✅ |
| canto_trinidad.mp3 | m2_canto | 320 | 47 | F | T | T | ✅ |
| padre_nuestro_ave_gloria.mp3 | m9/p8 | 192 | 261 | F | F | T | ✅ |
| **miserere.mp3** | m7_canto | 320 | 313 | F | T | T | ❌ |
| **salmo_51.mp3** | p6_canto | 320 | 176 | F | T | T | ❌ |
| **canto_hijo_prodigo.mp3** (Audacity) | p4_canto | 167 | 269 | T | F | T | ❌ |

\* bitrate puede ser VBR/ABR nominal. **Referencias funcionales** en itálica arriba.

**Qué NO explica el DOSSIER (para no volver a caer en estas trampas):**
1. NO es "tener Xing" → el de Audacity (Xing=T) falla; los que funcionan no tienen Xing sino Info.
2. NO es "tener Info" → miserere/salmo tienen Info (a 320k, ya recodificados por nosotros) y fallan;
   diario/oracion/canto_trinidad también Info y funcionan.
3. NO es el tamaño (12 MB falla, 12 MB funciona).
4. NO es el bitrate aislado.
5. Ninguno de estos campos simples separa 100% a "siempre-funcionan" de "fallan". La diferencia podría
   estar en la **tabla/índice interno (TOC dentro del Xing/Info)**: el campo `frames`/`bytes` del TOC,
   ausencia/truncado del TOC de 100 bytes, o un *gap* de muestreo inicial en el archivo.

---

## 7. HISTORIAL COMPLETO DE PRUEBAS (cronológico, resultado)

1. **Fix clásico `pause → set currentTime → play` + reintentos** → No resuelve (`seekable=[0-0]`).
2. **Fix "seek sin pausar" + watchdog** (`applySeek`, vigente en HEAD) → correcto como mejor
   esfuerzo; no puede forzar seek sobre seekable vacío.
3. **`<audio>` oculto global de precarga** (commit be9f806, luego REVERTIDO en be933e2):
   descargaba en paralelo para "calentar" offsets. **ROMPIÓ `m7_canto` del camino María** (que
   funcionaba) y se revirtió. Idea complementaria digna de revisitar, acotada SOLO a pasos que fallan.
4. **Commit 336e559 (código + audios):**
   - Quitado POR COMPLETO el reintento `onError (.mp3 → .MP3)` (ciego, generaba 404 falsos + `emptied`).
   - `preload="auto"` → `preload="metadata"`.
   - Renombrados (git mv) todos `.MP3` → `.mp3` para cuadrar con defaults.
   - Recodificados misérere/salmo/canto_hijo a **192k CBR** (libmp3lame, `-map_metadata -1`).
   → voz OK; seek NO mejoró.
5. **Commit 0ee88f0:** recodificación **320k CBR LAME=True** de los 3 (MP3→WAV→MP3) → aún falla.
6. **Commit 5ca26ae:** `canto_hijo_prodigo.mp3` **reexportado con Audacity** (Xing=True, 167k)
   → **TODAVÍA falla en player nativo.** (Último dato confirmado.)

**Prueba diagonal NO hecha todavía (la más valiosa):** reproducir los `.mp3` problemáticos desde un
**Blob completo** (fetch → `URL.createObjectURL`) en vez de streaming por la URL. Si desde blob el
seek FUNCIONA para esos mismos archivos → causa = **streaming/Range del worker**, solución = servir
blob o arreglar el proxy. Si aun desde blob falla → causa = archivo (recontenido interno).

---

## 8. Código relevante actual (referencia)

### 8.1 El `<audio>` (`src/App.jsx`), `preload="metadata"`, sin reintento .MP3
```jsx
<audio
  ref={audioRef}
  preload="metadata"
  onLoadedMetadata={(e) => {
    logAudio("loadedmetadata", e);
    const d = e.target.duration || 0;
    durRef.current = isFinite(d) && d > 0 ? d : durRef.current;
    setDur(d);
  }}
  onPlay={() => setPlaying(true)}
  onPause={() => setPlaying(false)}
  onEnded={handleEnded}
  onTimeUpdate={(e) => setCur(e.target.currentTime)}
  /* DEBUG: onSeeking/onSeeked/onWaiting/onStalled/onEmptied/onAbort/onPlaying/
     onLoadedData/onCanPlay → logAudio(...) */
  onError={(e) => { const a = e.currentTarget; logAudio("error code="+(a.error&&a.error.code), e); }}
/>
```

### 8.2 `applySeek` (no pausa; asigna currentTime + watchdog suave)
```js
const applySeek = (a, targetTime) => {
  const wasPlaying = !a.paused;
  const setPos = () => { try { a.currentTime = targetTime; } catch (_) {} };
  setPos(); // NO pausamos (móvil: pausa corta el avance del buffer; forzar play() a zona aun sin cargar = reset a 0)
  const tries = [150, 400, 800, 1400];
  const timerIds = [];
  const maybeFix = () => {
    const now = a.currentTime || 0;
    if (now < targetTime - 2) {
      setPos();
      if (wasPlaying && a.paused && now >= 0.5) { try { a.play(); } catch (_) {} }
    }
  };
  tries.forEach((ms) => timerIds.push(window.setTimeout(maybeFix, ms)));
  a.__seekCleanup = () => timerIds.forEach((id) => clearTimeout(id));
};
```
`rewind` (retrocede 10 s) y `seekTo(ratio)` calculan `targetTime` con la `duration` real
(`a.duration` > `durRef` > estado `dur`) y llaman a `applySeek`.

### 8.3 Instrumentación (DEBUG TEMPORAL)
`index.html` inyecta **eruda** y `src/App.jsx` define `logAudio`. Ambos son provisionales para
diagnóstico y deben revertirse al cerrar el caso (añaden ruido).

---

## 9. Causas raíz a profundizar (por plausibilidad)

1. **(Más probable, SIN testear) Servicio HTTP del Cloudflare Worker en streaming:**
   ¿emite `Accept-Ranges: bytes` y responde `206 Partial Content` con `Content-Range` correcto para
   TODOS los `.mp3`? Si para algunos no (sirve 200 completo cuando se pide Range, o corta el rango),
   Chromium móvil no arma el `seekable`. (Desktop tolera porque pre-bufferiza.) → `curl -I` + `Range`.
2. **Reproducción desde Blob completo** (diagnóstico que separa archivo/servicio): fetch completo →
   blob → objectURL. Si funciona → arreglar servicio o usar blob. (No explorado aún.)
3. **Estructura interna de la tabla de seek (TOC del Xing/Info):** en los que fallan el TOC/`frames`/
   `bytes` podría estar ausente/incorrecto; o hay *gap* de muestreo inicial. Avanzar solo tras descartar
   (1)/(2), comparando byte a byte la sección Xing/Info de un archivo bueno vs uno malo.
4. **`preload="metadata"` en móvil con estos archivos:** si bien m5 funciona con metadata, no descartar
   `"auto"`/forzar descarga en pasos que fallan.
5. **coherencia de rutas tras renombrar `.MP3`→`.mp3`:** confirmar que el worker/navegador resuelvan
   exactamente `/sounds/xxx.mp3` como usa `defaults.js`.

---

## 10. Pedido concreto a la próxima IA

Se espera que produzca, además de su análisis, un **gran conjunto de pasos/diagnóstico** y que
**aplique una mejora robusta al código de audio**. Alcance sugerido:

1. **Paso A (diagnóstico, minutos):** reproducir en el móvil el MISMO archivo problemático por
   (a) HTTP directo del worker (streaming) y (b) por **Blob completo** (fetch → `URL.createObjectURL`).
   Registrar si el seek funciona en (b).
2. **Paso B:** según (A) elegir la corrección: (i) arreglar el servicio/worker para emitir Range/206
   correcto, (ii) reproducir los MP3 problemáticos desde Blob en memoria, o (iii) normalizar el
   archivo solo si (b) tampoco funciona (indica problema de contenido).
3. **Robustez permanente (pedido del usuario):**
   - No depender de un único `currentTime=` ciego cuando `seekable` no cubre el target.
   - Si `seekable.end(0) < target` (zona aún no posicionable), **no resetear a 0**: limitar la barra,
     o esperar/descargar la zona antes, y solo aplicar el seek cuando `seekable` lo permita.
   - Definir patrón global óptimo: Blob siempre vs Blob solo para pasos largos/`>N MB` + streaming
     para el resto (balance memoria vs predictibilidad).

---

## 11. Estado y rama

- Rama `main`. Último commit: `5ca26ae`.
- `git status` limpio salvo este informe sin trackear.
- Instrumentación DEBUG (eruda + logAudio) ACTIVA; revertir al validar.
