/* =====================================================================
   components/SmartImg.jsx — <img> que resuelve el archivo real de /public/
   probando la extensión (webp→avif→jpg→...) si se le pasa un nombre sin
   extensión (o con una que ya no existe).

   Uso (idéntico a <img>):
     <SmartImg src="manos_orantes" alt="" className="..." />
   También acepta el nombre ya con extensión ("manos_orantes.jpg"): en ese
   caso lo usa directo si existe, y solo prueba otras extensiones si no.
   ===================================================================== */
// Convierte un nombre de asset a ruta absoluta desde la raíz ("avatar_x.jpg"
// -> "/avatar_x.jpg"), para que el <img> cargue bien en cualquier ruta de la
// SPA (raíz o anidada). URLs completas o ya absolutas se pasan tal cual.
function asRoot(p) {
  const s = String(p || "");
  if (!s || /^(https?:|data:|blob:|\/)/i.test(s)) return s;
  return "/" + s;
}

export default function SmartImg({ src, alt = "", ...rest }) {
  // Las imágenes ya llevan su extensión real en los datos (.jpg, .webp…).
  // Renderizamos la ruta absoluta directamente para que el archivo se pida y
  // visualice de inmediato, igual en la raíz que en rutas anidadas.
  const shown = asRoot(src);

  return <img src={shown} alt={alt} {...rest} />;
}

