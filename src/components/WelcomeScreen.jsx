/* =====================================================================
   COMPONENTS / WelcomeScreen.jsx — bienvenida (1 toque = sonido).
   ===================================================================== */
import { Ic } from "./icons.jsx";

export default function WelcomeScreen({ cfg, onStart, admin, onToggleAdmin }) {
  return (
    <div className="splash">
      <div className="sbg" style={{ backgroundImage: "url(" + cfg.bienvenida.fondo + ")" }} />
      <div className="sveil" />
      <button
        className="admin-a"
        aria-label="Activar modo admin"
        title="Modo administrador (A)"
        onClick={onToggleAdmin}
      >
        A
      </button>
      {admin && <div className="admin-chip">Modo Admin ACTIVO</div>}
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
        <p className="stap">Con este toque activas el sonido de la experiencia</p>
        <p className="sfooter">
          <span className="sfooter-t">La aplicación es 100% gratuita.</span>
          <span className="sfooter-s">(no ingreses tus datos o información bancaria)</span>
        </p>
      </div>
    </div>
  );
}
