/* =====================================================================
   COMPONENTS / SpeakerPanel.jsx — avatar parlante (Ángel / María / canto).
   ===================================================================== */
export default function SpeakerPanel({ img, nombre, speaking, canto }) {
  return (
    <header className="selhead">
      {canto ? (
        <div className={"avatar canto" + (speaking ? " speaking" : "")} aria-hidden="true">
          <span className="cantoic">♪</span>
        </div>
      ) : (
        <div className={"avatar" + (speaking ? " speaking" : "")}>
          <img src={img} alt={nombre} />
        </div>
      )}
      <div className="avatar-meta">
        <b>{nombre}</b>
        <i>{speaking ? "te está hablando…" : ""}</i>
      </div>
    </header>
  );
}
