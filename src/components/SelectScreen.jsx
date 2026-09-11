



/* =====================================================================
   COMPONENTS / SelectScreen.jsx — presentación del Ángel + opciones
   (30% diálogo + 70% opciones).
   ===================================================================== */
import { useEffect, useRef, useState } from "react";
import Teleprompter from "./Teleprompter.jsx";
import { Ic } from "./icons.jsx";
import SmartImg from "./SmartImg.jsx";

export default function SelectScreen({ cfg, eng, introDone, onSkip, onSelect, fxActive }) {
  const hasIntro = !!cfg.bienvenida.introAudioUrl;
  const speaking = eng.playing && hasIntro && !introDone;
  const total = cfg.countdown || 20;
  const [secs, setSecs] = useState(total);
  const [picking, setPicking] = useState(null);
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

        // S1-PICK: la tarjeta elegida queda "presionada" 500 ms y luego se dispara
  // la secuencia del efecto de camino (App: S2-TEXT → S3-IMAGE → S4-FLASH).
  const pick = (o) => {
    if (picking) return;
    if (!o.habilitado) { onSelect(o.id, false); return; }
    // Pausa el audio de bienvenida AL INSTANTE (sin resetear): el teleprompter
    // se queda quieto en su línea actual y no "salta" al inicio.
    const a = eng.audioRef && eng.audioRef.current;
    if (a && !a.paused) a.pause();
    setPicking(o.id);
    window.setTimeout(() => {
      setPicking(null);
      onSelect(o.id, false);
    }, 500);
  };

  const C = 2 * Math.PI * 14;

  return (
    <div className="screen">
      {/* ============ 30% superior — diálogo del Ángel ============ */}
      <section className="sel-top">
        <div className="sdial">
          <div className={"savatar" + (speaking ? " speaking" : "")}>
            <SmartImg src={cfg.voces.angel.img} alt={cfg.voces.angel.nombre} />
            <b>{cfg.voces.angel.nombre}</b>
          </div>
                                        <div className="sballoon">
                                          {picking || fxActive ? (
                                            /* Al elegir: se OCULTA por completo el texto (ni teleprompter ni
                                               texto estático) para que no se vea nada "justificándose".
                                               Se combinan ambas ventanas: `picking` cubre los primeros 500ms
                                               (antes de que onSelect active selectFx) y `fxActive` cubre toda
                                               la secuencia del efecto (TEXT + IMAGE + FLASH). */
                                            null
                                          ) : !introDone && hasIntro && eng.dur > 0 ? (
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
              className={"opt" + (o.habilitado ? " enabled" : " disabled") + (picking === o.id ? " picking" : "")}
              onClick={() => pick(o)}
              aria-pressed={picking === o.id}
            >
              <SmartImg className="thumb" src={o.img} alt="" />
                            <span className="optmeta">
                <b><span className="hl">{o.titulo}</span></b>
                <i><span className="hl">{o.desc}</span></i>
              </span>
              {!o.habilitado ? <span className="pronto">Pronto</span> : <Ic.ChR />}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
