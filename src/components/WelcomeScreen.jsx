/* =====================================================================
   COMPONENTS / WelcomeScreen.jsx — bienvenida (1 toque = sonido).
   ===================================================================== */
import { Ic } from "./icons.jsx";

export default function WelcomeScreen({ cfg, onStart }) {
  return (
    <div className="splash">
      <div className="sbg" style={{ backgroundImage: "url(" + cfg.bienvenida.fondo + ")" }} />
      <div className="sveil" />
      <div className="scontent">
        <div className="semb">
          <Ic.Cross s={40} />
        </div>
        <h1 className="stitle">{cfg.bienvenida.titulo}</h1>
        <div className="sdiv" />
        <p className="stext">{cfg.bienvenida.subtitulo}</p>
        <button className="btn gold big start" onClick={onStart}>
          <Ic.Play s={22} />
          <span>Iniciar la visita</span>
        </button>
        <p className="stap">Con este toque autorizas el sonido de la experiencia</p>
      </div>
    </div>
  );
}
