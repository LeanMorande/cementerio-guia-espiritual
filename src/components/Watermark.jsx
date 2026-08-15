/* =====================================================================
   COMPONENTS / Watermark.jsx — marca de agua estática.
   ===================================================================== */
import { Ic } from "./icons.jsx";

export default function Watermark({ dark }) {
  return (
    <div className={"wm" + (dark ? " wm-dark" : "")} aria-hidden="true">
      <Ic.Cross s={9} />
      <span>Cementerio Católico de Colonia Nueva</span>
    </div>
  );
}
