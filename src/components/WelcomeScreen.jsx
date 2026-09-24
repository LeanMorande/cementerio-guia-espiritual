/* =====================================================================
   COMPONENTS / WelcomeScreen.jsx — bienvenida (1 toque = sonido).
   ===================================================================== */
import { Ic } from "./icons.jsx";

export default function WelcomeScreen({ cfg, onStart, admin, onToggleAdmin, fxPhase }) {
  // fxPhase: "" | "PICK" | "REVEAL" | "ZOOM" | "FLASH"  (efecto de inicio)
  const fxClass = fxPhase ? " wfx-" + fxPhase.toLowerCase() : "";
  return (
    <div className={"splash" + fxClass}>
      <div className="sbg" style={{ backgroundImage: "url(" + cfg.bienvenida.fondo + ")" }} />
      <div className="sveil welcome-veil" />
      {/* ------------------------------------------------------------------
         BOTÓN ADMIN — RETIRADO (versión funcional final inicial / público).
         ----------------------------------------------------------------
         El botón visible "A" de la esquina superior derecha está desactivado.
         El modo admin tampoco se activa por tecla (ver el bloque comentado en
         src/App.jsx). Para volver a EDITAR contenido:
           - Rápido: añadir "#config" a la URL (pantalla del desarrollador).
           - Restaurar UI admin: descomentar el <button className="admin-a">
             de abajo Y el useEffect de la tecla "A" en src/App.jsx.
         El CSS (.admin-a) y el chip quedan intactos y reutilizables.
      */}

      {/* <button
        className="admin-a"
        aria-label="Activar modo admin"
        title="Modo administrador (A)"
        onClick={onToggleAdmin}
      >
        A
      </button> */}
      {admin && <div className="admin-chip">Modo Admin ACTIVO</div>}
      <div className="scontent welcome">
        <header className="shead">
                    <div className="semb">
            <Ic.Cross s={44} />
          </div>
          <h1 className="stitle">
            <span className="stitle-l1">Cementerio Católico</span>
            <span className="stitle-l2">de</span>
            <span className="stitle-l3">Colonia Crespo</span>
          </h1>
          <div className="sdiv" />
          <p className="stext">{cfg.bienvenida.subtitulo}</p>
        </header>
        <div className="smid">
          <button className="btn gold big start" onClick={onStart}>
            <Ic.Speaker s={26} />
            <span>Toca aquí para empezar</span>
          </button>
          <p className="stap">Con este toque activas el sonido de la experiencia</p>
        </div>
                <div className="trust-foot">
          <div className="trust-badge">
            <span className="trust-icon">
              <Ic.Shield s={22} />
            </span>
            <span className="trust-title">Aplicación 100% Gratuita</span>
          </div>
          <p className="trust-note">Nunca te pediremos que ingreses<br />datos personales o bancarios.</p>
        </div>
      </div>
    </div>
  );
}

