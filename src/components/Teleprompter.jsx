/* =====================================================================
   COMPONENTS / Teleprompter.jsx — telepronter sincronizado.
   ===================================================================== */
import { useMemo, useRef, useState, useCallback, useLayoutEffect, useEffect } from "react";

export default function Teleprompter({ text, audioRef, duration, hint }) {
  const lines = useMemo(
    () => text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
    [text]
  );
  const segs = useMemo(() => {
    if (!duration || duration <= 0 || !lines.length) return [];
    const w = lines.map((l) => Math.max(l.length, 10));
    const tot = w.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    return w.map((x) => {
      const s = (acc / tot) * duration;
      acc += x;
      return [s, (acc / tot) * duration];
    });
  }, [lines, duration]);

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
            {l}
          </p>
        ))}
      </div>
      {hint && <div className="tp-hint">{hint}</div>}
    </div>
  );
}
