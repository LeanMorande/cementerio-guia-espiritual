/* =====================================================================
   COMPONENTS / PathScreen.jsx — paso del camino (usa StepLayout).
   ===================================================================== */
import StepLayout from "./StepLayout.jsx";
import { Ic } from "./icons.jsx";
export default function PathScreen({ cfg, idx, onExit, onNext, onPrev, eng, admin }) {
  const seg = cfg.camino[idx];
  const last = idx === cfg.camino.length - 1;
  if (!seg) return null;

  const speaker = seg.voz ? cfg.voces[seg.voz] : null;
  const speaking = eng.playing && !!seg.audioUrl;

  const audioName = seg.audioUrl ? seg.audioUrl.split("/").pop() : null;
  const hasAudio = !!seg.audioUrl;
  return (
    <div className="screen">
      <div className="phead">
        <button className="iconbtn" onClick={onExit} aria-label="Salir del camino">
          <Ic.Close s={20} />
        </button>
        <div className="phead-c">
          <span className="mnum">
            <span className="mnum-title">Camino con la Virgen María:</span>{" "}
            <span className="mnum-step">Paso {idx + 1} de {cfg.camino.length}</span>
          </span>
        </div>
        <span className="phead-sp" />
      </div>

      <StepLayout
        id={seg.id}
        speaker={speaker}
        speaking={speaking}
        texto={seg.texto}
        imagen={seg.imagen}
        imagenes={seg.imagenes}
        contain={seg.contain}
        caption={seg.caption}
        admin={admin}
        audioName={audioName}
        hasAudio={hasAudio}
        tipo={seg.tipo}
        accion={seg.accion}
        eng={eng}
        onNext={onNext}
        onPrev={onPrev}
        last={last}
        idx={idx}
        totalSteps={cfg.camino.length}
      />
    </div>
  );
}

