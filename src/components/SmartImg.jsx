/* =====================================================================
   components/SmartImg.jsx — <img> que resuelve el archivo real de /public/
   probando la extensión (webp→avif→jpg→...) si se le pasa un nombre sin
   extensión (o con una que ya no existe).

   Uso (idéntico a <img>):
     <SmartImg src="manos_orantes" alt="" className="..." />
   También acepta el nombre ya con extensión ("manos_orantes.jpg"): en ese
   caso lo usa directo si existe, y solo prueba otras extensiones si no.
   ===================================================================== */
import { useEffect, useState } from "react";
import { resolveImg } from "../lib/img.js";

export default function SmartImg({ src, alt = "", ...rest }) {
  const [resolved, setResolved] = useState(null);

  useEffect(() => {
    let active = true;
    setResolved(null);
    if (!src) {
      if (active) setResolved("");
      return;
    }
    resolveImg(src).then((r) => {
      if (active) setResolved(r || src);
    });
    return () => {
      active = false;
    };
  }, [src]);

  // Mientras resolvemos, mostramos `src` tal cual (para no dejar hueco si el
  // nombre trae una extensión existente). Cuando llega la URL real, la usamos.
  const shown = resolved === null ? src || "" : resolved;

  return <img src={shown} alt={alt} {...rest} />;
}

