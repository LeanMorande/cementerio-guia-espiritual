# AYUDA-MEMORIA · cementerio-guia-espiritual

> **Para qué:** resumen breve y accionable de la arquitectura, decisiones clave y
> limitaciones, para que una IA (o un humano) con poco contexto vuelva rápido.
> NO pretende explicar todo: es el "mapa" para no romper lo que ya funciona.

---

## Proyecto y despliegue
- **App React (Vite).** Entrada: `src/main.jsx` → `src/App.jsx`. Motor de audio y
  config: `src/lib/*`, `src/config/defaults.js`.
- **Hosting:** sitio estático en **Cloudflare Workers Assets** (dominio
  `cementerio-guia-espiritual.ldmorande.workers.dev`). Se despliega al hacer push a
  `main` de GitHub (Cloudflare construye `npm run build` y sirve `dist/`).
- **Audios:** archivos MP3 en `public/sounds/*.mp3` (se copian a `dist/sounds/`).
  Imágenes OG en `public/`.

## ⚠️ CÓDIGO QUE NO SE TOCA A LA LIGERA (y por qué)
- **Audio reproduce desde BLOB**, NO por streaming directo (decisión clave, §"Cómo
  funciona el audio" más abajo).
- **NO volver a `preload="auto"`** ni a reintentos `.mp3 → .MP3`: eso reintrodujo
  reinicios a 0 en móvil.
- **`m7_canto`/Miserere** y otros pasos largos dependen de la solución Blob para el seek.

## Qué limita (información de contexto)
- Los `.mp3` que sirven MP3 por streaming al <audio> NO son fiables para *seek* porque
  **Cloudflare no responde `HTTP Range/206`** (devuelve `200` con el archivo completo,
  ignorando el `Range`). Confirmado con `curl`. → Por eso se descarga completo a un Blob.
- En Desktop no se notaba el bug (buffer completo antes de buscar); se manifestaba en
  Chrome/Android móvil (el `<audio>` no arma `seekable` → volvía a 0 al hacer seek).
- **Costo del approach Blob:** cada audio debe descargarse completo una vez (los cantos
  ≈12 MB tardan unos segundos); mitigado con precarga en paralelo (ver motor de audio).

## Cómo funciona el audio (resumen algorítmico)
1. `<audio ref={audioRef}>` con `preload="metadata"` (único elemento).
2. `getBlobSource(url)` → descarga el `.mp3` completo (`fetch`→`.blob()`→
   `URL.createObjectURL`) y lo cachea en `blobUrlRef` (Map FIFO, máx. `BLOB_CACHE_MAX = 8`).
3. `playUrl(url)` / `loadAudio(url, autoplay)` reproducen siempre desde ese **objectURL**,
   no desde la URL de red. Fallback a streaming si el Blob falla.
4. `prefetchBlob(url)` descarga en paralelo SIN reproducir (para precargar).
5. Precarga automática: intro al entrar en "welcome"; primeros pasos al elegir camino
   (`onSelect`); pasos siguientes vía `prefetchNeighbors` mientras suena cada paso.
6. `applySeek(a, target)`: si el audio suena, SOLO asigna `currentTime` (sin pausar ni
   forzar play); un watchdog suave re-asegura si quedó detrás. (Con Blob, `seekable` es
   completo por lo que el seek siempre respeta la posición.)
7. Anclando a paso fin no reproduce → `stopAudio`, cambia ruta a "fin".

## Autoplay móvil (regla que conservar)
- `unlockAudio()` (desbloquea el `AudioContext`) se llama en gestos de usuario
  (`iniciarVisita`, togglePlay) y antes de cada `play()`.
- La primera reproducción que "abra el sonido" debe venir de una interacción (ej. el
  botón Iniciar / elegir opción). El resto de pasos se encadenan por esa sesión ya activa.

## Estructura / navegación de rutas
Rutas: `welcome` → `config | select | path | fin`.
- `welcome`: pantalla previa / QR → `iniciarVisita()` → `select`.
- `select`: elige camino (María/Padre/Jesús) → `onSelect(id)` → `path`.
- `path`: reproduce el array de pasos (`getPath(id)`); `PathScreen` muestra guiado.
- `fin`: fin de recorrido → "fin".

## Configuración de contenidos
- Editable en backoffice (`ConfigScreen`) y persistida en `localStorage` bajo
  `ccn-v6`; los valores por defecto vienen de `src/config/defaults.js`.
- "Voces" agrupan estilo recorrido; los ~pasos por camino agrupan audio/imagen/
  subtítulo.

## Cómo diagnosticar rápido si algo de audio falla otra vez
1. Verifica con devtools (chomeo escritorio) que el `src` del `<audio>` sea `blob:…`
   y que `seekable` sea `[0..durComplete]`.
2. Si volvió a reproducirse por la URL directa (no `blob:`), el fallback a streaming
   se activó → revisá `getBlobSource` (¿está bloqueado por CORS/politica o falla fetch?).
3. `curl -I -H "Range: bytes=0-1023" <url-mp3>` → si responde `200` completo (no `206`),
   reafirma que NO se puede depender del streaming (la causa original).

## Recordatorio de convenciones internas
- Todos los audios en `public/sounds/*.mp3` en MINÚSCULA.
- Un solo elemento `<audio>` en todo el recorrido.
- El instrumento de debug temporal (eruda + `logAudio`) YA está quitado y no debe
  volver a producción.
