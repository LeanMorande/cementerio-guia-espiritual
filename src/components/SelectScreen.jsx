/* =====================================================================
   COMPONENTS / SelectScreen.jsx — presentación del Ángel + opciones.
   ===================================================================== */
import { useEffect, useRef, useState } from "react";
import SpeakerPanel from "./SpeakerPanel.jsx";
import LiveCaption from "./LiveCaption.jsx";
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
      <SpeakerPanel img={cfg.voces.angel.img} nombre={cfg.voces.angel.nombre} speaking={speaking} />
      {!introDone && hasIntro && (
        <div className="capwrap">
          <LiveCaption text={cfg.bienvenida.introTexto} audioRef={eng.audioRef} duration={eng.dur} />
          <button className="linkbtn" onClick={onSkip}>
            Saltar presentación ›
          </button>
        </div>
      )}
      <div className="choosewrap">
        <div className="chooserow">
          <h2>¿Con quién quieres orar?</h2>
          {introDone && secs > 0 && (
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
          )}
        </div>
        {introDone && <p className="cdnote">Si no eliges, elegiremos por ti</p>}
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
      </div>
    </div>
  );
}
