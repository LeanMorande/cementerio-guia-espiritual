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

// Convierte un nombre de asset a ruta absoluta desde la raíz ("avatar_x.jpg"
// -> "/avatar_x.jpg"), para que el <img> carga bien en cualquier ruta de la
// SPA antes/después de la resolución. URLs completas o ya absolutas se pasan
// tal cual.
function asRoot(p) {
  const s = String(p || "");
  if (!s || /^(https?:|data:|blob:|\/)/i.test(s)) return s;
  return "/" + s;
}

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
      if (active) setResolved(r || asRoot(src));
    });
    return () => {
      active = false;
    };
  }, [src]);

  // Mientras resolvemos, mostramos `src` en formato absoluto (para no romper
  // en rutas anidadas). Cuando llega la URL real, la usamos.
  const shown = resolved === null ? asRoot(src) : resolved;

  return <img src={shown} alt={alt} {...rest} />;
}

