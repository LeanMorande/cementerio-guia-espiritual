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

      {/* S3-IMAGE y S4-FLASH: fondo sacro + imagen del camino elegido.
          El fondo .selectfx-bg (SobreFondo.webp) reemplaza el fondo negro y
          sirve de marco dorado; .selectfx-img se enmarca dentro de él.
          En FLASH se añade la clase que ACALARA hacia blanco tanto al fondo
          como a la imagen: la luz sale de ambas, no es un blanco seco.
          Ambas <img> viven en el mismo contenedor de fase para que no haya
          salto/parpadeo entre IMAGE y FLASH. */}
      {img && (phase === "IMAGE" || phase === "FLASH") && (
        <>
          <img src="/SobreFondo.webp" className="selectfx-bg" alt="Fondo sacro" />
          <img
            className={"selectfx-img" + (phase === "FLASH" ? " selectfx-img-flash" : "")}
            src={img}
            alt=""
          />
        </>
      )}
      {phase === "FLASH" && <div className="selectfx-flash" aria-hidden="true" />}
    </div>
  );
}

