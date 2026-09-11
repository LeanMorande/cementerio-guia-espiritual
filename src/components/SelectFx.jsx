









/* =====================================================================
   COMPONENTS / SelectFx.jsx — efecto de inicio de camino (overlay).
   Se muestra al elegir una tarjeta en el selector (o por timeout) y corre
   las fases S2-TEXT / S3-IMAGE / S4-FLASH sobre la pantalla del selector.
   S1-PICK ocurre sobre el propio botón (lo maneja SelectScreen), así que
   aquí no se renderiza nada en esa fase.

   Props:
     phase  "PICK" | "TEXT" | "IMAGE" | "FLASH"
     id     id de la opción ("padre" | "jesus" | "maria")
     img    imagen de la tarjeta elegida (o.img)
   Nomenclatura para depurar: S1-PICK, S2-TEXT, S3-IMAGE, S4-FLASH.
   ===================================================================== */
import { Ic } from "./icons.jsx";

export default function SelectFx({ phase, id, img, out }) {
  if (!phase || phase === "PICK") return null;

  const titulo3 =
    id === "padre" ? "Piedad del Padre" : id === "jesus" ? "Redención de Jesús" : "Virgen María";

  return (
    <div className={"selectfx s-" + phase.toLowerCase() + (out ? " s-out" : "")}>
      {/* S2-TEXT: pantalla negra con el texto "Comenzando: El camino de la…" */}
      {phase === "TEXT" && (
        <>
          <div className="veil2-cross">
            <Ic.Cross s={34} />
          </div>
          <div className="veil2-inner">
            <p className="veil2-txt">
              <span className="veil2-l1">Comenzando:</span>
              <span className="veil2-l2">El camino de la</span>
              <span className="veil2-l3">{titulo3}</span>
            </p>
          </div>
        </>
      )}

      {/* S3-IMAGE y S4-FLASH usan la MISMA <img> (no se re-monta entre fases,
          así no hay salto/parpadeo). En FLASH se le añade la clase que la
          ACALARA hacia blanco: la luz sale DE la imagen, no es un blanco seco. */}
      {img && (phase === "IMAGE" || phase === "FLASH") && (
        <img
          className={"selectfx-img" + (phase === "FLASH" ? " selectfx-img-flash" : "")}
          src={img}
          alt=""
        />
      )}
      {phase === "FLASH" && <div className="selectfx-flash" aria-hidden="true" />}
    </div>
  );
}
