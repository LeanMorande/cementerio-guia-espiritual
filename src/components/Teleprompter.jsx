import { useMemo, useRef, useState, useCallback, useLayoutEffect, useEffect } from "react";

/* Convierte el texto en un array de palabras con su posición inicial
   (índice de carácter) dentro del string original. Se usa para poder mapear
   cada fragmento de texto (keyframe) a una posición concreta del audio. */
function tokenize(text) {
  const toks = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text || "")) !== null) toks.push({ w: m[0], i: m.index });
  return toks;
}

/* Convierte el texto en un array de líneas acotadas (word-wrap aprox.)
   para que quepan varias por ventana y el scroll sea fluido.
   El máximo de caracteres por línea es responsivo: en móviles se permiten
   menos caracteres para evitar que las líneas se desborden y queden palabras
   sueltas/huérfanas; en pantallas anchas se aprovecha el espacio.
   Además calcula `startChars` y `endChars` (posiciones inicial/final en el
   string original) de cada línea, necesarios para la sincronización por
   keyframes (asociar frases a segundos concretos del audio). */
function wrapLines(text, maxChars, winWidth) {
  // Límite por caracteres según el ancho de la ventana (y el de la caja).
  const limit =
    maxChars ||
    (winWidth ? (winWidth <= 600 ? 30 : winWidth <= 900 ? 40 : 48) : 48);
  // Los saltos de línea explícitos (`\n`) se respetan como líneas
  // independientes del teleprompter: sirven para mostrar bloques separados
  // (p. ej. "Padre Nuestro\nAve María (3)\nGloria") que se van iluminando
  // según la sección del audio. Un segmento largo se sigue partiendo por el
  // límite de caracteres para no desbordar la ventana.
  const segments = (text || "").split(/\r?\n/);
  const lines = [];
  let charOffset = 0; // offset global para poder mapear a keyframes
  for (const seg of segments) {
    const toks = tokenize(seg);
    let cur = "";
    let curStart = 0; // posición char global del primer token de la línea
    let curEnd = 0; //   posición char global del fin del último token agregado
    for (const t of toks) {
      const absStart = charOffset + t.i;
      if ((cur + " " + t.w).trim().length > limit && cur) {
        lines.push({ text: cur.trim(), startChars: curStart, endChars: curEnd });
        cur = t.w;
        curStart = absStart;
        curEnd = absStart + t.w.length;
      } else {
        if (!cur) curStart = absStart;
        cur = (cur + " " + t.w).trim();
        curEnd = absStart + t.w.length;
      }
    }
    if (cur) lines.push({ text: cur.trim(), startChars: curStart, endChars: curEnd });
    else if (seg.trim() === "" && lines.length) lines.push({ text: "", startChars: charOffset, endChars: charOffset });
    charOffset = charOffset + seg.length + 1; // +1 por el salto de línea
  }
  if (!lines.length) lines.push({ text: "", startChars: 0, endChars: 0 });
  return lines;
}

/* Estima las sílabas de un texto en español (golpes de voz). Cada secuencia
   vocálica equivale, de forma aproximada, a una sílaba. La duración del habla
   correlaciona mejor con sílabas que con cantidad de caracteres, lo que
   reduce el desfase del teleprompter en audios de ritmo variable/largos. */
export function countSyllables(text) {
  const s = (text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const groups = s.match(/[aeiouy]+/g);
  return groups ? Math.max(groups.length, 1) : 1;
}

function lineWeight(line) {
  // Peso principal por sílabas; se suma un mínimo de caracteres para que
  // líneas muy cortas no colapsen a peso casi nulo.
  return Math.max(2, countSyllables(line) + line.length * 0.12);
}

export default function Teleprompter({ text, audioRef, duration, hint, keyframes }) {
  // Ancho de la ventana para redividir el texto según el espacio disponible
  // (en móvil se generan líneas más cortas → menos palabras sueltas).
  const [winW, setWinW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 900));
  useEffect(() => {
    const onR = () => setWinW(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  // Las líneas son objetos { text, startChars, endChars }.
  const lines = useMemo(() => wrapLines(text || "", undefined, winW), [text, winW]);

  /* Sincronización por keyframes (compensación manual).
     Los keyframes definen que cierto fragmento de texto debe mostrarse a
     partir de un segundo concreto del audio (porque la voz real no es
     monótona: tiene pausas, reflexiones, cambios de ritmo). Construimos una
     tabla de "puntos de control" (posición char → tiempo) y luego
     interpolamos linealmente entre ellos para cada línea:
       - posición 0          → tiempo 0
       - cada keyframe       → su segundo t
       - posición final      → duración total del audio
     Si no hay keyframes, se cae al algoritmo por defecto (reparto
     proporcional por sílabas/peso a lo largo de la duración total). */
  const segs = useMemo(() => {
        if (!duration || duration <= 0 || !lines.length) return [];

    const buildPoints = () => {
      const totalChars = (text || "");
      const points = [
        { pos: 0, t: 0 },
        { pos: totalChars.length, t: duration },
      ];
      const rawText = totalChars;
      if (Array.isArray(keyframes)) {
        for (const kf of keyframes) {
          if (!kf || typeof kf.t !== "number" || !kf.sub) continue;
          const pos = rawText.indexOf(kf.sub);
          if (pos !== -1) points.push({ pos, t: kf.t });
        }
      }
      // Ordena por posición char y garantiza tiempos crecientes.
      points.sort((a, b) => a.pos - b.pos || a.t - b.t);
      return points;
    };
    const points = buildPoints();

    // Interpola el tiempo para una posición char según los puntos de control.
    const timeAt = (pos) => {
      let a = points[0];
      let b = points[points.length - 1];
      for (let i = 0; i < points.length; i++) {
        if (points[i].pos >= pos) { b = points[i]; a = points[i - 1] || points[0]; break; }
      }
      if (b.pos === a.pos) return b.t;
      const ratio = (pos - a.pos) / (b.pos - a.pos);
      return a.t + ratio * (b.t - a.t);
    };

                // Sin keyframes (o sin ninguno válido, p. ej. fragmento no encontrado):
    // reparto proporcional por sílabas/peso (algoritmo original).
    if (points.length <= 2) {
      const w = lines.map((l) => lineWeight(l.text));
      const tot = w.reduce((a, b) => a + b, 0) || 1;
      let acc = 0;
      return w.map((x) => {
        const s = (acc / tot) * duration;
        acc += x;
        return [s, (acc / tot) * duration];
      });
    }

        // Con keyframes: interpola por los puntos de control (posición char →
    // tiempo). Cada línea recibe un intervalo [inicio, fin] según su offset.
    return lines.map((l) => {
      const start = timeAt(l.startChars);
      const end =
        l === lines[lines.length - 1] ? duration : timeAt(l.endChars);
      return [start, Math.max(start, end)];
    });
  }, [lines, duration, keyframes, text]);

  const winRef = useRef(null);
  const trackRef = useRef(null);
  const lineEls = useRef([]);
  const centersRef = useRef([]);
  const winHRef = useRef(0);
  const segsRef = useRef(segs);
  const dispRef = useRef(null);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(0);
  segsRef.current = segs;

  const measure = useCallback(() => {
    centersRef.current = lineEls.current.map((el) => (el ? el.offsetTop + el.offsetHeight / 2 : 0));
    if (winRef.current) winHRef.current = winRef.current.clientHeight;
    dispRef.current = null;
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [lines, measure]);

  useEffect(() => {
    const onR = () => measure();
    window.addEventListener("resize", onR);
    let alive = true;
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(() => { if (alive) measure(); }).catch(() => {});
    return () => { alive = false; window.removeEventListener("resize", onR); };
  }, [measure]);

  useEffect(() => {
    let raf;
    const loop = () => {
      const win = winRef.current,
        track = trackRef.current,
        s = segsRef.current;
      if (win && track && s.length && centersRef.current.length) {
        const a = audioRef.current;
        const t = a ? a.currentTime : 0;
        let idx = s.length - 1;
        for (let i = 0; i < s.length; i++) {
          if (t < s[i][1]) { idx = i; break; }
        }
        if (idx !== activeRef.current) { activeRef.current = idx; setActive(idx); }
        const target = centersRef.current[idx] - winHRef.current / 2;
        dispRef.current = dispRef.current == null ? target : dispRef.current + (target - dispRef.current) * 0.12;
        track.style.transform = "translate3d(0," + -dispRef.current.toFixed(2) + "px,0)";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [audioRef]);

  return (
    <div className="tp" ref={winRef}>
      <div className="tp-track" ref={trackRef}>
                {lines.length === 0 && <p className="tp-line future">Agrega el texto en Configuración…</p>}
        {lines.map((l, i) => (
          <p
            key={i}
            ref={(el) => { lineEls.current[i] = el; }}
            className={"tp-line " + (i === active ? "active" : i < active ? "past" : "future")}
          >
            {l.text}
          </p>
        ))}
      </div>
      {hint && <div className="tp-hint">{hint}</div>}
    </div>
  );
}

