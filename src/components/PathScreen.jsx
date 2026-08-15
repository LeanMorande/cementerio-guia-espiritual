/* =====================================================================
   COMPONENTS / PathScreen.jsx — paso del camino (audio/progreso).
   ===================================================================== */
import { useRef } from "react";
import SpeakerPanel from "./SpeakerPanel.jsx";
import Teleprompter from "./Teleprompter.jsx";
import { Ic } from "./icons.jsx";
import { fmtTime } from "../lib/utils.js";

export default function PathScreen({ cfg, idx, onExit, onNext, eng }) {
  const barRef = useRef(null);
  const dragRef = useRef(false);
  const seg = cfg.camino[idx];
  const last = idx === cfg.camino.length - 1;
  if (!seg) return null;

  const speaker = seg.voz ? cfg.voces[seg.voz] : null;
  const speaking = eng.playing && !!seg.audioUrl;
  const pct = eng.dur ? Math.min(100, (eng.cur / eng.dur) * 100) : 0;

  const seekFrom = (e) => {
    const bar = barRef.current;
    if (!bar || !eng.dur) return;
    const r = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    eng.seekTo(ratio);
  };

  return (
    <div className="screen">
      <div className="phead">
        <button className="iconbtn" onClick={onExit} aria-label="Salir del camino">
          <Ic.Close s={20} />
        </button>
        <div className="phead-c">
          <span className="mnum">Camino con la Virgen María</span>
          <h1>
            Paso {idx + 1} de {cfg.camino.length}
          </h1>
        </div>
        <span className="phead-sp" />
      </div>

      {speaker && <SpeakerPanel img={speaker.img} nombre={speaker.nombre} speaking={speaking} />}
      {!speaker && <SpeakerPanel nombre="Canto" speaking={speaking} canto />}

      {seg.tipo === "subtitulo" ? (
        <Teleprompter
          text={seg.texto}
          audioRef={eng.audioRef}
          duration={eng.dur}
          hint={
            !seg.audioUrl
              ? "Agrega el audio de este paso en Configuración (⚙)"
              : !eng.playing && eng.cur < 0.2
              ? "Toca ▶ para escuchar"
              : ""
          }
        />
      ) : (
        <figure className="cimg">
          <img src={seg.imagen} alt="" />
          {seg.caption && <figcaption className="ccap">{seg.caption}</figcaption>}
        </figure>
      )}

      <div className="deck">
        <div className="prow">
          <span className="ptime num">{fmtTime(eng.cur)}</span>
          <div
            className="pbar"
            ref={barRef}
            role="slider"
            aria-label="Progreso del audio"
            onPointerDown={(e) => {
              dragRef.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              seekFrom(e);
            }}
            onPointerMove={(e) => { if (dragRef.current) seekFrom(e); }}
            onPointerUp={() => { dragRef.current = false; }}
            onPointerCancel={() => { dragRef.current = false; }}
          >
            <div className="ptrack">
              <div className="pfill" style={{ width: pct + "%" }} />
            </div>
          </div>
          <span className="ptime num dim">{fmtTime(eng.dur)}</span>
        </div>
        <div className="trow">
          <button className="btn ghost" onClick={eng.rewind} aria-label="Retroceder 10 segundos">
            <Ic.Back10 />
            <span>10 s</span>
          </button>
          <button
            className={"play" + (!eng.playing ? " idle" : "")}
            onClick={eng.togglePlay}
            aria-label={eng.playing ? "Pausar" : "Reproducir"}
          >
            {eng.playing ? <Ic.Pause /> : <Ic.Play />}
          </button>
          <button className="btn ghost nextbtn" onClick={onNext}>
            <span>{last ? "Finalizar" : "Siguiente"}</span>
            <Ic.ChR />
          </button>
        </div>
      </div>
    </div>
  );
}
