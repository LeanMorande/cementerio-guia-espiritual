/* =====================================================================
   CONFIG / DEFAULTS — Cementerio Católico de Colonia Nueva
   =====================================================================
   Estado inicial incrustado en código (sin localStorage).
   Todos los audios se cargan desde /sounds/.
   ===================================================================== */

/* Imágenes generadas (por defecto) */
export const IMG_FONDO =
  "https://image.qwenlm.ai/public_source/41848ce9-4248-4497-a737-761782afd87c/1750d02fc-78b6-48aa-b2e3-076a34512d06.png";
export const IMG_ANGEL =
  "https://image.qwenlm.ai/public_source/41848ce9-4248-4497-a737-761782afd87c/1b8bfcde2-4cee-406d-98ff-16abbdd0420d.png";
export const IMG_MARIA_AV =
  "https://image.qwenlm.ai/public_source/41848ce9-4248-4497-a737-761782afd87c/14763bc9c-863c-45e7-842f-236cd53a06eb.png";
export const IMG_PADRE =
  "https://image.qwenlm.ai/public_source/41848ce9-4248-4497-a737-761782afd87c/1d66b4569-4e8a-411b-ba7d-e38576300a0c.png";
export const IMG_JESUS =
  "https://image.qwenlm.ai/public_source/41848ce9-4248-4497-a737-761782afd87c/126f7208b-a5f5-4fd0-bd90-e8a7c3476552.png";
export const IMG_MARIA_CARD =
  "https://image.qwenlm.ai/public_source/41848ce9-4248-4497-a737-761782afd87c/14bdb0f21-9852-4850-adec-d743a95a4baf.png";
export const IMG_TRINIDAD =
  "https://image.qwenlm.ai/public_source/41848ce9-4248-4497-a737-761782afd87c/13c0474fc-201f-462d-b6f2-954a51ffb717.png";
export const IMG_FIN =
  "https://image.qwenlm.ai/public_source/41848ce9-4248-4497-a737-761782afd87c/1c15c80b2-ff52-4b7f-a6bc-e50cced8c49d.png";

/* Identificador único para pasos (solo para estructura de datos) */
export function uid() {
  return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* =====================================================================
   Configuración por defecto — las URLs /sounds/ vienen incrustadas.
   ===================================================================== */
export function buildDefaults() {
  return {
    bienvenida: {
      titulo: "Cementerio Católico de Colonia Nueva",
      subtitulo: "Reza por tus difuntos",
      introTexto: [
        "Bienvenido al cementerio católico de Colonia Nueva.",
        "Soy tu Ángel de la Guarda y deseo acompañarte en esta visita al camposanto,",
        "donde descansan tus seres queridos en espera de la resurrección.",
        "Las lágrimas de tu rostro se secarán",
        "y las flores que adornan las tumbas se marchitarán;",
        "lo único que tu corazón y las almas de tus seres queridos necesitan",
        "es una oración.",
        "Si quieres, podemos rezar juntos. Te ofrezco tres caminos:",
        "orar con Dios Padre, que tanto te ama;",
        "con Jesús, quien muriendo en la cruz te redimió;",
        "o con tu Madre, la Virgen María.",
        "Elige uno de ellos para comenzar.",
      ].join("\n"),
      // Audio estático del Ángel, servido desde /sounds/
      introAudio: true,
      introAudioUrl: "/sounds/intro_angel.mp3",
      introAudioName: "intro_angel.mp3",
      introDur: 0,
      fondo: IMG_FONDO,
    },
    voces: {
      angel: { nombre: "Ángel de la Guarda", img: IMG_ANGEL },
      maria: { nombre: "Virgen María", img: IMG_MARIA_AV },
    },
    opciones: [
      { id: "padre", titulo: "Orar con Dios Padre", desc: "El Padre que tanto te ama", img: IMG_PADRE, habilitado: false },
      { id: "jesus", titulo: "Orar con Jesús", desc: "Quien muriendo en la cruz te redimió", img: IMG_JESUS, habilitado: false },
      { id: "maria", titulo: "Orar con la Virgen María", desc: "Tu Madre te escucha", img: IMG_MARIA_CARD, habilitado: true },
    ],
    camino: [
      {
        uid: uid(), voz: "angel", tipo: "subtitulo",
        audio: true, audioUrl: "/sounds/paso_1.wav", audioName: "paso_1.wav", dur: 0,
        texto: "Busca un lugar tranquilo, siéntate,\ny empecemos a orar juntos.\nSerán pocos minutos:\nverás cómo tu corazón experimenta una paz muy grande,\ny tus queridos difuntos te lo agradecerán.",
        imagen: null, caption: "",
      },
      {
        uid: uid(), voz: "angel", tipo: "subtitulo",
        audio: true, audioUrl: "/sounds/paso_2.mp3", audioName: "paso_2.mp3", dur: 0,
        texto: "Pongámonos en presencia de la Santísima Trinidad,\npara que nos acompañe en este momento de oración.\nHagamos juntos la señal de la cruz:\nEn el nombre del Padre, y del Hijo, y del Espíritu Santo.\nAmén.",
        imagen: null, caption: "",
      },
      {
        uid: uid(), voz: "maria", tipo: "subtitulo",
        audio: true, audioUrl: "/sounds/paso_3.mp3", audioName: "paso_3.mp3", dur: 0,
        texto: "Si supieras cuánto tiempo hace que te esperaba en este lugar santo,\npara abrazar tu corazón y consolar tus tristezas.\nYo soy Madre, y también pasé por un dolor semejante al tuyo.\nCuéntame con palabras simples lo que siente tu corazón:\na quién viniste a visitar hoy, qué extrañas, qué necesitas.\nYo me quedo un momento en silencio para escucharte.",
        imagen: null, caption: "",
      },
      {
        uid: uid(), voz: "", tipo: "imagen",
        audio: true, audioUrl: "/sounds/paso_4.mp3", audioName: "paso_4.mp3", dur: 0,
        texto: "",
        imagen: IMG_TRINIDAD,
        caption: "Canto: «A Ti alabanza y gloria, oh Santa Trinidad»",
      },
      {
        uid: uid(), voz: "angel", tipo: "subtitulo",
        audio: true, audioUrl: "/sounds/paso_5.mp3", audioName: "paso_5.mp3", dur: 0,
        texto: "Quédate en paz luego de este momento de oración.\nY ya lo sabes: aquí te estamos esperando,\npara que vengas a encontrarte con Dios\ny con el alma de tus seres queridos.",
        imagen: null, caption: "",
      },
    ],
    countdown: 20,
  };
}
