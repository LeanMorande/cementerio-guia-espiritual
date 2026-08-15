/* =====================================================================
   COMPONENTS / LiveCaption.jsx — subtítulo en vivo de una línea.
   ===================================================================== */
import { useMemo, useRef, useState, useEffect } from "react";

export default function LiveCaption({ text, audioRef, duration }) {
  const lines = useMemo(
    () => text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
    [text]
  );
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const linesRef = useRef(lines);
  linesRef.current = lines;
  const durRef = useRef(duration);
  durRef.current = duration;

  useEffect(() => {
    let raf;
    const loop = () => {
      const a = audioRef.current;
      const ls = linesRef.current;
      const d = durRef.current;
      if (a && ls.length && d > 0) {
        const t = a.currentTime;
        const w = ls.map((l) => Math.max(l.length, 10));
        const tot = w.reduce((x, y) => x + y, 0) || 1;
        let acc = 0,
          found = ls.length - 1;
        for (let i = 0; i < ls.length; i++) {
          acc += w[i];
          if (t < (acc / tot) * d) { found = i; break; }
        }
        if (found !== idxRef.current) { idxRef.current = found; setIdx(found); }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [audioRef]);

  if (!lines.length) return null;
  return (
    <p key={idx} className="livecap">
      {lines[idx]}
    </p>
  );
}
