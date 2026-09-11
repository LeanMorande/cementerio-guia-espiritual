/* =====================================================================
   worker.js — Cloudflare Worker de ccc.camposanto.workers.dev
   =====================================================================
   Rutas:
     - OPTIONS /api/feedback : preflight CORS.
     - POST   /api/feedback  : procesa el feedback y lo envía a Telegram.
     - GET    (resto)        : sirve la aplicación React (Assets de dist/),
                               con manejo de errores para rutas inexistentes
                               (p. ej. /favicon.ico) sin romper con un 500.
   Secretos requeridos (wrangler secret / dashboard):
     - TELEGRAM_BOT_TOKEN
     - TELEGRAM_CHAT_ID
   Notas de robustez:
     - Los errores se registran con console.error (logs de Cloudflare) y NO se
       exponen en la respuesta HTTP para no filtrar datos sensibles.
     - Si Telegram responde con "migrate_to_chat_id" (grupo migrado a
       supergrupo), se reintenta el envío automáticamente con el nuevo ID.
   ===================================================================== */
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // 1. SI ES UNA PETICIÓN POST Y VA A /api/feedback: Procesar Telegram
    if (request.method === "POST" && url.pathname === "/api/feedback") {
      try {
        const data = await request.json();
        const { stars, comment, camino = "Dios Padre" } = data;

        const botToken = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
          console.error(
            "Faltan secretos de Telegram (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)."
          );
          return new Response(
            JSON.stringify({ error: "Servicio no disponible" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const estrellasEmoji = "⭐".repeat(stars || 0);

        let text = `<b>NUEVO FEEDBACK RECIBIDO</b> 🕊️\n\n`;
        text += `<b>Recorrido:</b> ${camino}\n`;
        text += `<b>Calificación:</b> ${estrellasEmoji} (${stars}/5)\n`;
        if (comment && comment.trim() !== "") {
          text += `<b>Comentario:</b> ${comment.trim()}\n`;
        }

        await sendToTelegram(botToken, chatId, text);

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        // El detalle queda en los logs de Cloudflare, nunca en la respuesta.
        console.error(
          "Error procesando feedback:",
          err && err.message ? err.message : err
        );
        return new Response(
          JSON.stringify({ error: "No se pudo procesar el feedback" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 2. CUALQUIER OTRA RUTA: Servir la aplicación React (Assets) con manejo
    //    de errores para no devolver un 500 cuando falta un asset (favicon, etc.).
    try {
      return await env.ASSETS.fetch(request);
    } catch (err) {
      console.error(
        "Error sirviendo asset:",
        err && err.message ? err.message : err
      );
      return new Response("Recurso no encontrado", {
        status: 404,
        headers: corsHeaders,
      });
    }
  },
};

/**
 * Envía un mensaje a Telegram. Si la respuesta indica que el chat fue migrado
 * a supergrupo ("migrate_to_chat_id"), reintenta UNA vez con el nuevo ID.
 * Lanza un Error con el detalle (para que quede en los logs) si falla.
 */
async function sendToTelegram(botToken, chatId, text) {
  const doSend = (targetChatId) =>
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: text,
        parse_mode: "HTML",
      }),
    });

  let response = await doSend(chatId);
  let result = await response.json().catch(() => null);

  // Reintento automático si el grupo fue migrado a supergrupo.
  const migrateTo =
    result && result.parameters && result.parameters.migrate_to_chat_id;
  if (!response.ok && migrateTo) {
    console.error(
      `Chat migrado a supergrupo. Reintentando con chat_id=${migrateTo} ` +
        `(actualiza el secreto TELEGRAM_CHAT_ID a este valor).`
    );
    response = await doSend(migrateTo);
    result = await response.json().catch(() => null);
  }

  if (!response.ok || !result || result.ok !== true) {
    const detail = result ? JSON.stringify(result) : `HTTP ${response.status}`;
    throw new Error("Error en la API de Telegram: " + detail);
  }

  return result;
}
