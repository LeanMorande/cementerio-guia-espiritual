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
  imagenes,
  caption,
  admin,
  audioName,
  hasAudio,
  tipo,
  accion,
  contain,
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

  // Obtiene la coordenada horizontal del toque/clic de forma fiable, tanto en
  // mouse (clientX) como en táctil (touches/changedTouches). En Safari iOS el
  // campo clientX a veces no existe en el evento síntesis "click"; por eso
  // preferimos leer touches cuando están disponibles.
  const clientXOf = (e) => {
    const t = (e && (e.touches || e.changedTouches)) || [];
    const t0 = t && t[0];
    if (t0 && typeof t0.clientX === "number") return t0.clientX;
    if (e && typeof e.clientX === "number") return e.clientX;
    return NaN;
  };

  const seekFrom = (e) => {
    const bar = barRef.current;
    if (!bar) return;
    const clientX = clientXOf(e);
    if (!isFinite(clientX)) return;
    const r = bar.getBoundingClientRect();
    // Evita dividir por ancho nulo o posición fuera.
    if (r.width <= 0) return;
    const rawRatio = (clientX - r.left) / r.width;
    // Clamp a [0, 1]; nunca enviamos ratios negativos ni >1.
    const ratio = Math.max(0, Math.min(1, rawRatio));
    eng.seekTo(ratio);
  };

  // Inicia/reanuda el arrastre. No usamos setPointerCapture para evitar bugs
  // de coordenadas en iOS/Android; manejamos la barra con toques/mouse.
  const onBarDown = (e) => {
    e.preventDefault();
    dragRef.current = true;
    seekFrom(e);
  };
  const onBarMove = (e) => {
    if (!dragRef.current) return;
    seekFrom(e);
  };
  const onBarUp = (e) => {
    dragRef.current = false;
    seekFrom(e);
  };

  // Modo de renderizado según la nueva propiedad `tipo`.
  const isVoice = tipo === "modo-voz";
  const isCanto = tipo === "modo-canto" || !speaker || !speaker.img;
  const nombre = speaker?.nombre || "Canto";
  const balloon = accion ? accion : texto;

  // Teleprompter scrolleante: solo para subtítulos (sin acción/canto) con
  // audio cargado y duración conocida. Sin audio → texto completo fijo.
  const useTeleprompter = !admin && !accion && !!texto && hasAudio && eng.dur > 0;

  // Transición de imágenes (slides): si el paso define un array `imagenes`,
  // se reparten en partes iguales a lo largo de la duración del audio y se
  // muestra la imagen correspondiente al progreso actual (crossfade).
  // Reutilizable en cualquier paso con `tipo: "modo-canto"` o con imagen.
  const slides =
    imagenes && imagenes.length > 1 && eng.dur > 0
      ? imagenes
      : imagen
      ? [imagen]
      : [];
  const slideIndex =
    slides.length > 1 && eng.dur > 0
      ? Math.min(slides.length - 1, Math.floor((eng.cur / eng.dur) * slides.length))
      : 0;

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
          {/* Referencias de slides (varias imágenes por paso) para saber qué guardar */}
          {!isVoice && imagenes && imagenes.length > 1 && (
            <span className="sadmitem">
              <Ic.Img s={13} /> slides ({imagenes.length}):{" "}
              <code>{imagenes.map((im) => "public/" + im).join(", ")}</code>
            </span>
          )}
          <span className={"sadmitem" + (hasAudio ? "" : " miss")}>
            <Ic.Note s={13} /> audio: <code>public/sounds/{audioName || "(sin definido)"}</code>
          </span>
          {!isVoice && slides.length > 1 && (
            <span className="sadmitem">
              <Ic.Play s={13} /> slide actual: <code>{slideIndex + 1}/{slides.length}</code>
            </span>
          )}
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
        <section className={"sstep sstep-mid" + (contain && slides.length > 1 ? " slides-contain" : "")}>
          {slides.length > 1 && !admin ? (
            <figure className={"sscene slides" + (contain ? " contain-box" : "")}>
              {/* En modo contain, una imagen fantasma (invisible) establece el
                  tamaño real de la caja según la proporción de las imágenes. */}
              {contain && <img className="sizer" src={slides[0]} alt="" aria-hidden="true" />}
              {slides.map((im, i) => (
                <img
                  key={i}
                  src={im}
                  alt=""
                  className={(i === slideIndex ? "on" : "") + (contain ? " contain" : "")}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ))}
              {caption && <figcaption className="ccap">{caption}</figcaption>}
              {/* Indicador de progresión de slides */}
              <span className="slide-dots">
                {slides.map((_, i) => (
                  <i key={i} className={i === slideIndex ? "on" : ""} />
                ))}
              </span>
            </figure>
          ) : (
            <figure className="sscene">
              {slides.length === 1 && !admin ? (
                <>
                  <img src={slides[0]} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
                  {caption && <figcaption className="ccap">{caption}</figcaption>}
                </>
              ) : (
                <div className="splaceholder">
                  <Ic.Img s={40} />
                  <span>Imagen: {slides[0] || "(sin imagen)"}</span>
                </div>
              )}
            </figure>
          )}
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
            onTouchStart={onBarDown}
            onTouchMove={onBarMove}
            onTouchEnd={onBarUp}
            onPointerDown={onBarDown}
            onPointerMove={onBarMove}
            onPointerUp={onBarUp}
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

