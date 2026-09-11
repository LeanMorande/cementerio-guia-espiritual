/* =====================================================================
   worker.js — Cloudflare Worker de ccc.camposanto.workers.dev
   =====================================================================
   - POST : procesa el feedback y lo envía a Telegram.
   - GET  : sirve la aplicación React (Assets de `dist/`).
   Secretos requeridos (wrangler secret / dashboard):
     - TELEGRAM_BOT_TOKEN
     - TELEGRAM_CHAT_ID
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

    // 1. SI ES UNA PETICIÓN POST: Procesar el Feedback para Telegram
    if (request.method === "POST") {
      try {
        const data = await request.json();
        const { stars, comment, camino = "Dios Padre" } = data;

        const botToken = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
          return new Response(
            JSON.stringify({ error: "Faltan secretos de Telegram" }),
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

        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: text,
              parse_mode: "HTML",
            }),
          }
        );

        if (!response.ok) throw new Error("Error en la API de Telegram");

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 2. SI ES UNA PETICIÓN GET (o cualquier otra): Servir la aplicación React (Assets)
    return env.ASSETS.fetch(request);
  },
};
