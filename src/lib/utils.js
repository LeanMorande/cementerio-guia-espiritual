/* =====================================================================
   LIB / UTILS — utilidades puras (sin efectos, sin storage).
   ===================================================================== */

/** Formatea segundos a "m:ss". */
export function fmtTime(s) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return m + ":" + String(ss).padStart(2, "0");
}

/** Crea un Blob WAV silencioso de `seconds` (utilidad para pruebas). */
export function makeSilence(seconds) {
  const sr = 8000,
    n = Math.floor(sr * seconds);
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const ws = (o, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  ws(0, "RIFF");
  v.setUint32(4, 36 + n * 2, true);
  ws(8, "WAVE");
  ws(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sr, true);
  v.setUint32(28, sr * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  ws(36, "data");
  v.setUint32(40, n * 2, true);
  return new Blob([buf], { type: "audio/wav" });
}
