/* =====================================================================
   COMPONENTS / SelectScreen.jsx — presentación del Ángel + opciones
   (30% diálogo + 70% opciones).
   ===================================================================== */
import { useEffect, useRef, useState } from "react";
import Teleprompter from "./Teleprompter.jsx";
import { Ic } from "./icons.jsx";

export default function SelectScreen({ cfg, eng, introDone, onSkip, onSelect }) {
  const hasIntro = !!cfg.bienvenida.introAudioUrl;
  const speaking = eng.playing && hasIntro && !introDone;
  const total = cfg.countdown || 20;
  const [secs, setSecs] = useState(total);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!introDone) return;
    const iv = setInterval(() => setSecs((s) => s - 1), 1000);
    return () => clearInterval(iv);
  }, [introDone]);

  useEffect(() => {
    if (introDone && secs <= 0 && !firedRef.current) {
      firedRef.current = true;
      const enabled = cfg.opciones.filter((o) => o.habilitado);
      if (enabled.length) onSelect(enabled[Math.floor(Math.random() * enabled.length)].id, true);
    }
  }, [secs, introDone, cfg.opciones, onSelect]);

  const C = 2 * Math.PI * 14;

  return (
    <div className="screen">
      {/* ============ 30% superior — diálogo del Ángel ============ */}
      <section className="sel-top">
        <div className="sdial">
          <div className={"savatar" + (speaking ? " speaking" : "")}>
            <img src={cfg.voces.angel.img} alt={cfg.voces.angel.nombre} />
            <b>{cfg.voces.angel.nombre}</b>
          </div>
          <div className="sballoon">
            {!introDone && hasIntro && eng.dur > 0 ? (
              <Teleprompter text={cfg.bienvenida.introTexto} audioRef={eng.audioRef} duration={eng.dur} />
            ) : !introDone && hasIntro ? (
              /* La duración del audio de la bienvenida aún no está disponible
                 (p. ej. autoplay bloqueado en móvil antes de cargar metadatos).
                 Mostramos el texto fluido en vez de romper el teleprompter. */
              <p className="sdialtext">{cfg.bienvenida.introTexto}</p>
            ) : (
              <p className="sdialtext">¿Con quién quieres orar?</p>
            )}
          </div>
        </div>
        {!introDone && hasIntro && (
          <button className="linkbtn sel-skip" onClick={onSkip}>
            Saltar presentación ›
          </button>
        )}
        {introDone && secs > 0 && (
          <div className="sel-count">
            <div className="cdring" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 34 34">
                <circle cx="17" cy="17" r="14" className="cdtrack" />
                <circle
                  cx="17" cy="17" r="14" className="cdprog"
                  strokeDasharray={C}
                  strokeDashoffset={(1 - secs / total) * C}
                />
              </svg>
              <span>{secs}</span>
            </div>
            <span className="cdnote">Elige con quién orar</span>
          </div>
        )}
      </section>

      {/* ============ 70% inferior — opciones ============ */}
      <section className="sel-bottom">
        <div className="options">
          {cfg.opciones.map((o) => (
            <button
              key={o.id}
              className={"opt" + (o.habilitado ? " enabled" : " disabled")}
              onClick={() => onSelect(o.id, false)}
            >
              <img className="thumb" src={o.img} alt="" />
              <span className="optmeta">
                <b>{o.titulo}</b>
                <i>{o.desc}</i>
              </span>
              {!o.habilitado ? <span className="pronto">Pronto</span> : <Ic.ChR />}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
