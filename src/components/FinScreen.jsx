/* =====================================================================
   COMPONENTS / FinScreen.jsx — cierre del recorrido.
   ===================================================================== */
import { IMG_FIN } from "../config/defaults.js";
import { Ic } from "./icons.jsx";

export default function FinScreen({ onHome }) {
  return (
    <div className="splash">
      <div className="sbg" style={{ backgroundImage: "url(" + IMG_FIN + ")" }} />
      <div className="sveil" />
      <div className="scontent">
        <div className="semb">
          <Ic.Cross s={40} />
        </div>
        <h1 className="stitle">Quédate en paz</h1>
        <div className="sdiv" />
        <p className="stext">
          Aquí te estamos esperando, para que vengas a encontrarte con Dios y con el alma de tus
          seres queridos.
        </p>
        <button className="btn gold big" onClick={onHome}>
          <span>Volver al inicio</span>
        </button>
      </div>
    </div>
  );
}
