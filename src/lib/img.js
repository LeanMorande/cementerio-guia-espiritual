/* =====================================================================
   lib/img.js — Resolvedor de imágenes sin depender de la extensión.
   =====================================================================
   Permite escribir en los datos SOLO el NOMBRE (sin extensión) de una
   imagen de /public/. En runtime se prueba, en orden, `webp → avif →
   jpg → jpeg → png → gif` y se usa el primero que exista.

   Así, cambiar una imagen de `.jpg` a `.webp`/`.avif` (o viceversa) NO
   exige tocar el código: basta reemplazar el archivo en /public/.

   Resultados se cachean en memoria (Map) para que cada imagen solo pague
   la prueba de extensiones la primera vez — importante en conexiones
   lentas (zonas rurales).
   ===================================================================== */

// Orden de preferencia (el primero disponible gana).
export const IMG_EXT_ORDER = ["webp", "avif", "jpg", "jpeg", "png", "gif"];

// Base path donde se sirven los assets estáticos (carpeta /public).
export const IMG_BASE = ""; // rutas relativas, como hoy ("" => archivo en la raíz servida)

const cache = new Map(); // nombreBase -> urlResuelta (o "" si ninguna existe)

// Quita la extensión de un nombre si la trae ("x.jpg" -> "x").
export function stripExt(name) {
  if (!name) return "";
  return String(name).replace(/\.[a-zA-Z0-9]+$/, "");
}

// Prueba si una URL responde HTTP 200 (HEAD). Devuelve true/false.
async function exists(url) {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch (_err) {
    // fallback: probamos con GET (algunos servidores no soportan bien HEAD)
    try {
      const res = await fetch(url, { cache: "no-store" });
      return res.ok;
    } catch (_e2) {
      return false;
    }
  }
}

/**
 * Resuelve un nombre ("manos_orantes" o "manos_orantes.jpg") a la URL
 * real del archivo existente, devolviendo la URL base sin resolver mientras
 * no se completa la prueba (para no dejar el hueco en blanco).
 */
export async function resolveImg(name) {
  if (!name) return "";

  const base = stripExt(name);
  if (cache.has(base)) return cache.get(base);

  // Probamos siempre en orden webp→avif→jpg→... así, si existe tanto el
  // .jpg como el .webp del mismo nombre, gana el más moderno/ligero.
  for (const ext of IMG_EXT_ORDER) {
    const candidate = "" + base + "." + ext;
    if (await exists(candidate)) {
      cache.set(base, candidate);
      return candidate;
    }
  }

  // Ninguna extensión corresponde: cacheamos vacío para no repetir la
  // búsqueda en cada render y devolvemos el nombre original como fallback.
  cache.set(base, "");
  return String(name);
}

export function getImgCache() {
  return cache;
}
export function clearImgCache() {
  cache.clear();
}

