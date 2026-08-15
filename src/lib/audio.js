/* =====================================================================
   LIB / AUDIO — motor de audio con rutas estáticas /sounds/
   =====================================================================
   Eliminado IndexedDB/blobs: todas las rutas apuntan a /sounds/*.mp3
   que se sirven desde la carpeta pública del proyecto.
   ===================================================================== */

let audioCtxShared = null;

/** Desbloquea el contexto de audio (requisito iOS/Android). Un toque. */
export function unlockAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioCtxShared) audioCtxShared = new AC();
    if (audioCtxShared.state === "suspended") audioCtxShared.resume();
    const buf = audioCtxShared.createBuffer(1, 1, audioCtxShared.sampleRate);
    const node = audioCtxShared.createBufferSource();
    node.buffer = buf;
    node.connect(audioCtxShared.destination);
    node.start(0);
  } catch (e) {
    /* silencioso */
  }
}

/** Lee la duración de un MP3 (desde /sounds/) sin reproducirlo. */
export function probeDuration(url) {
  return new Promise((res) => {
    const a = document.createElement("audio");
    a.preload = "metadata";
    a.src = url;
    const done = () => res(isFinite(a.duration) ? a.duration : 0);
    a.onloadedmetadata = done;
    a.onerror = done;
    // Fallback de seguridad
    setTimeout(done, 3000);
  });
}
