/* =====================================================================
   COMPONENTS / StepLayout.jsx — maquetación reutilizable del paso
   (proporciones 30% / 50% / 20% de 100vh).
   - 30% superior: diálogo del personaje (avatar ~15% + texto ~85%)
   - 50% central:   imagen de la escena (o placeholder en modo Admin)
   - 20% inferior:  controles (progreso, botonera, firma)
   ===================================================================== */
import { useRef } from "react";
import { Ic } from "./icons.jsx";
import { fmtTime } from "../lib/utils.js";
import Teleprompter from "./Teleprompter.jsx";

const FIRMA = "† CEMENTERIO CATÓLICO DE COLONIA CRESPO";

export default function StepLayout({
  id,
  speaker,
  speaking,
  texto,
  imagen,
  caption,
  admin,
  audioName,
  hasAudio,
  tipo,
  accion,
  eng,
  onNext,
  onPrev,
  last,
  idx,
  totalSteps,
}) {
  const barRef = useRef(null);
  const dragRef = useRef(false);
  const pct = eng.dur ? Math.min(100, (eng.cur / eng.dur) * 100) : 0;

  const seekFrom = (e) => {
    const bar = barRef.current;
    if (!bar || !eng.dur) return;
    const r = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    eng.seekTo(ratio);
  };

  // Modo de renderizado según la nueva propiedad `tipo`.
  const isVoice = tipo === "modo-voz";
  const isCanto = tipo === "modo-canto" || !speaker || !speaker.img;
  const nombre = speaker?.nombre || "Canto";
  const balloon = accion ? accion : texto;

  // Teleprompter scrolleante: solo para subtítulos (sin acción/canto) con
  // audio cargado y duración conocida. Sin audio → texto completo fijo.
  const useTeleprompter = !admin && !accion && !!texto && hasAudio && eng.dur > 0;

  return (
    <div
      className={"steplayout" + (isVoice ? " voice" : " canto")}
      key={idx}
      style={{ animationDelay: idx === 0 ? "1.9s" : "0s" }}
    >
      {/* ============ franja admin (imagen + audio, siempre visible) ============ */}
      {admin && (
        <div className="sadmbars">
          <span className="sadmitem">
            <b>#</b> ID: <code>{id || "(sin id)"}</code>
          </span>
          {/* En modo-voz no hay imagen central, así que no se muestra esa línea. */}
          {!isVoice && (
            <span className="sadmitem">
              <Ic.Img s={13} /> imagen: <code>{imagen || "(sin imagen)"}</code>
            </span>
          )}
          <span className={"sadmitem" + (hasAudio ? "" : " miss")}>
            <Ic.Note s={13} /> audio: <code>public/sounds/{audioName || "(sin definido)"}</code>
          </span>
        </div>
      )}

      {/* ============ superior — diálogo (80vh en modo-voz, 30% en modo-canto) ============ */}
      <section
        className={"sstep sstep-top" + (isVoice ? " layout-voz-top" : "")}
        style={isVoice ? { flex: "1 1 0%", minHeight: 0 } : undefined}
      >
        <div className="sdial">
          <div className={"savatar" + (isCanto ? " canto" : "") + (speaking ? " speaking" : "")}>
            {!isCanto ? (
              <img src={speaker.img} alt={nombre} />
            ) : (
              <span className="cantoic">♫</span>
            )}
            <b>{nombre}</b>
          </div>
          <div className="sballoon">
            {admin ? (
              <textarea
                className="sadmtext"
                readOnly
                value={balloon || ""}
                onFocus={(e) => e.target.select()}
              />
            ) : useTeleprompter ? (
              <Teleprompter text={texto} audioRef={eng.audioRef} duration={eng.dur} />
            ) : (
              <p className="sdialtext">{balloon || (isCanto ? accion || "Canto" : "—")}</p>
            )}
          </div>
        </div>
      </section>

      {/* ============ 50% central — imagen de la escena (se oculta en modo-voz) ============ */}
      {!isVoice && (
        <section className="sstep sstep-mid">
          <figure className="sscene">
            {imagen && !admin ? (
              <>
                <img src={imagen} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
                {caption && <figcaption className="ccap">{caption}</figcaption>}
              </>
            ) : (
              <div className="splaceholder">
                <Ic.Img s={40} />
                <span>Imagen: {imagen || "(sin imagen)"}</span>
              </div>
            )}
          </figure>
        </section>
      )}

      {/* ============ 20% inferior — controles + firma ============ */}
      <footer className="sstep sstep-bottom">
        <div className="prow">
          <span className="ptime num">{fmtTime(eng.cur)}</span>
          <div
            className="pbar"
            ref={barRef}
            role="slider"
            aria-label="Progreso del audio"
            onPointerDown={(e) => { dragRef.current = true; e.currentTarget.setPointerCapture(e.pointerId); seekFrom(e); }}
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

        <div className="controles-reproductor">
          <button className="btn ghost prevbtn" onClick={onPrev} disabled={idx === 0} aria-label="Paso anterior">
            <Ic.ChL />
            <span>Atrás</span>
          </button>
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

        <p className="sfirma">{FIRMA}</p>
      </footer>
    </div>
  );
}

