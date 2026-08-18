/* =====================================================================
   CONFIG / DEFAULTS — Cementerio Católico de Colonia Crespo
   =====================================================================
   Estado inicial incrustado en código (sin localStorage).
   Audios servidos desde /sounds/ e imágenes con rutas relativas.
   ===================================================================== */

/* ------------------------------------------------ */
/* Imágenes de AVATAR de los personajes (public/)     */
/* ------------------------------------------------ */
export const IMG_ANGEL_AV = "avatar_angel.jpg";
export const IMG_PADRE_AV = "avatar_padre.jpg";
export const IMG_JESUS_AV = "avatar_jesus.jpg";
export const IMG_MARIA_AV = "avatar_virgen.jpg";

/* ------------------------------------------------ */
/* Imágenes de ESCENA por cada paso (nombres únicos)  */
/* ------------------------------------------------ */
export const IMG_ESCENA_1 = "escena_1.jpg";
export const IMG_ESCENA_2 = "escena_2.jpg";
export const IMG_ESCENA_3 = "escena_3.jpg";
export const IMG_ESCENA_4 = "escena_4.jpg";
export const IMG_ESCENA_5 = "escena_5.jpg";
export const IMG_ESCENA_6 = "escena_6.jpg";
export const IMG_TRINIDAD = "escena_trinidad.jpg";
export const IMG_MANOS_ORANTES = "manos_orantes.jpg";
export const IMG_CALVARIO = "calvario.jpg";
export const IMG_VIRGEN_ABRAZANDO = "virgen_abrazando.jpg";
export const IMG_GLORIA_CIELO = "gloria_cielo.jpg";

/* ------------------------------------------------ */
/* Imágenes de las OPIONES del selector de camino     */
/* ------------------------------------------------ */
export const IMG_PADRE_CARD = "opcion_padre.jpg";
export const IMG_JESUS_CARD = "opcion_jesus.jpg";
export const IMG_MARIA_CARD = "opcion_virgen.jpg";

/* ------------------------------------------------ */
/* Fondos                                           */
/* ------------------------------------------------ */
export const IMG_FONDO = "fondo.jpg";
export const IMG_FIN = "fondo.jpg";

/* Identificador único para pasos (solo para estructura de datos) */
export function uid() {
  return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* =====================================================================
   Configuración por defecto — las URLs /sounds/ vienen incrustadas.
   ===================================================================== */
export function buildDefaults() {
  return {
    /* -------- Configuración general -------- */
    title: "Cementerio Católico de Colonia Crespo",
    subtitle: "Reza por tus difuntos",
    bgImage: "fondo.jpg",
    bgMusic: "miserere_allegri.mp3",

    bienvenida: {
      titulo: "Cementerio Católico de Colonia Crespo",
      subtitulo: "Reza por tus difuntos",
      introTexto: [
        "Bienvenido al cementerio católico de colonia crespo, soy tu Angel de la guarda y deseo acompañarte en esta visita al camposanto,",
        "donde descansan tus seres queridos en espera de la resurrección.",
        "Tu sabes que las lágrimas de tu rostro se secaran y las flores que adornan las tumbas se marchitan,",
        "lo único que tu corazón y las almas de tus seres queridos necesitan en este momento es de una oración.",
        "Si quieres, podemos rezar juntos, te ofrezco estas posibilidades:",
        "orar acompañado por Dios, que es tu Padre y tanto te ama; o con Jesús, quien muriendo en la cruz te redimió;",
        "o si lo prefieres, orar con la Virgen María, que es tu madre y siempre está a tu lado, especialmente en los momentos de dolor.",
        "Clica sobre una de estas posibilidades para transformar la visita al cementerio en una experiencia de encuentro con Dios y con tus seres queridos.",
      ].join("\n"),
      // Audio estático del Ángel, servido desde /sounds/
      introAudio: true,
      introAudioUrl: "/sounds/bienvenida_angel.mp3",
      introAudioName: "bienvenida_angel.mp3",
      introDur: 0,
      fondo: IMG_FONDO,
    },
    /* Voces / avatares reutilizables del componente */
    voces: {
      angel: { nombre: "Ángel de la Guarda", img: IMG_ANGEL_AV },
      padre: { nombre: "Dios Padre", img: IMG_PADRE_AV },
      jesus: { nombre: "Jesús", img: IMG_JESUS_AV },
      maria: { nombre: "Virgen María", img: IMG_MARIA_AV },
      canto: { nombre: "Canto", img: null },
    },
    opciones: [
      { id: "padre", titulo: "Orar con el Padre", desc: "Dios, tu Padre que tanto te ama", img: IMG_PADRE_CARD, habilitado: false },
      { id: "jesus", titulo: "Orar con Jesús", desc: "Quien muriendo en la cruz te redimió", img: IMG_JESUS_CARD, habilitado: false },
      { id: "maria", titulo: "Orar con la Virgen María", desc: "Tu madre siempre está a tu lado", img: IMG_MARIA_CARD, habilitado: true },
    ],
    camino: [
      // Paso 1 — Ángel (apertura del camino)
      {
        uid: uid(), voz: "angel", tipo: "subtitulo",
        speaker: "Ángel de la Guarda",
        audio: true, audioUrl: "/sounds/paso_1_angel.mp3", audioName: "paso_1_angel.mp3", dur: 0,
        texto: "Busca un lugar tranquilo, en silencio, si deseas siéntate y empecemos a orar juntos, serán pocos minutos, veras como tu corazón experimentara una paz muy grande y tus queridos difuntos te lo agradecerán. Pongámonos en presencia de la Santísima Trinidad para que nos acompañen en este momento de oración, hagamos juntos la señal de la cruz: en el nombre del Padre y del Hijo y del Espíritu Santo. Amen.",
        imagen: IMG_ESCENA_1, caption: "",
      },
      // Paso 2 — Canto Trinidad (nuevo)
      {
        uid: uid(), voz: "canto", tipo: "meditacion",
        speaker: "Canto",
        audio: true, audioUrl: "/sounds/canto_trinidad.mp3", audioName: "canto_trinidad.mp3", dur: 0,
        accion: "A ti alabanza y gloria (Arpa Dei)",
        texto: "A ti alabanza y gloria (Arpa Dei)",
        imagen: IMG_MANOS_ORANTES, caption: "",
      },
      // Paso 3 — Ángel (continuación)
      {
        uid: uid(), voz: "angel", tipo: "subtitulo",
        speaker: "Ángel de la Guarda",
        audio: true, audioUrl: "/sounds/paso_2_angel.mp3", audioName: "paso_2_angel.mp3", dur: 0,
        texto: "Tu elegiste hacer compartir este momento de oración junto con tu Madre la Virgen Maria. Te propongo que le cuentes a ella lo que siente tu corazón, es muy sencillo, consiste en decirle con palabras simples: cuáles son tus alegrías, y que cosa te da tristeza, cuéntale lo que estás viviendo con tu familia, en el trabajo, sabiendo que tu madre te ama y te esta escuchando en este momento.",
        imagen: IMG_ESCENA_2, caption: "",
      },
      // Paso 4 — María
      {
        uid: uid(), voz: "maria", tipo: "subtitulo",
        speaker: "Virgen María",
        audio: true, audioUrl: "/sounds/paso_3_virgen.mp3", audioName: "paso_3_virgen.mp3", dur: 0,
        texto: "Que alegría me estás dando con esta visita, yo soy tu madre y tú sabes cómo somos las mamas, no vemos la hora de poder estar a solas un rato con nuestros hijos para hablar de nuestras cosas. Si supieras cuanto tiempo llevo esperándote en este lugar santo para poder abrazarte, para poder consolar la tristeza que te ha dejado la muerte de tus seres queridos, para llenar la soledad de su partida, para cubrir tu alma con la paz que solo mi hijo Jesús puede darte. Cuando yo estoy a tu lado, en medio a los trajines de tu vida, entiendo muy bien cuanto extrañas a quienes aquí están sepultados. Comprendo que darías todo lo que tienes para sentarte, aunque sea solo cinco minutos a tomar unos mates con ellos por última vez, y poder despedirte, poder decirles que le perdonas algo que te ha hecho sufrir o simplemente decir ¡gracias, te quiero mucho! Yo estoy siempre junto a ti, por eso sé muy bien que la casa ya no es la misma sin ellos, que a la ramada del patio le falta el eco de sus risas, que la cocina parece distinta sin ese olor característico a la comida que te preparaban y que es difícil la vida sin tenerlos cerca para pedir un consejo en momentos difíciles. Todo esto lo comprendo muy bien porque yo soy mama y también pase por un dolor semejante al tuyo. Te voy a compartir un secreto que guardo en mi alma desde hace muchos años y estaba esperando el momento justo para contártelo. En aquel viernes santo, la muerte golpeo la puerta de mi corazón y me arranco de un tirón todo lo que yo más amaba, a mi Hijo Jesús. Aquella tarde, sentí la tristeza que tu sientes, esa misma soledad que ahoga tu alma, yo también añore un abrazo, un último beso, pero la muerte me lo arrebato. En ese momento desde lo profundo de mi corazón dolido me broto este lamento, que lo deposite en las manos de Dios Padre, y eso me trajo una profunda paz, que me dio fuerzas para seguir adelante con la vida.",
        imagen: IMG_ESCENA_3, caption: "",
      },
      // Paso 5 — Canto Calvario (nuevo)
      {
        uid: uid(), voz: "canto", tipo: "meditacion",
        speaker: "Canto",
        audio: true, audioUrl: "/sounds/diario_de_maria.mp3", audioName: "diario_de_maria.mp3", dur: 0,
        accion: "El diario de María",
        texto: "El diario de María",
        imagen: IMG_CALVARIO, caption: "",
      },
      // Paso 6 — María (meditación personal)
      {
        uid: uid(), voz: "maria", tipo: "subtitulo",
        speaker: "Virgen María",
        audio: true, audioUrl: "/sounds/paso_4_virgen.mp3", audioName: "paso_4_virgen.mp3", dur: 0,
        texto: "En el momento más difícil de mi vida, cuando tuve que enfrentar la muerte de mi Hijo, me trajo mucho alivio, el poder contarle a Dios con mis palabras, mi dolor, mi soledad y mi tristeza. Te propongo que hagas lo mismo que hice yo en aquel terrible momento: cuéntale a Dios y a tu ser querido, en una charla mano a mano, ¿que es lo que más extrañas de su ausencia?. Si les quedo una cuenta pendiente, habla de ello con su alma, ofrécele tu perdón, no guardes rencor, aprovecha este momento para que Dios Padre te sane esas heridas viejas, y aquellos problemas que no pudiste arreglar en vida. Si necesitas un consejo, cuéntale tu dificultad y pide ayuda. Es muy bueno que hables con el Alma de tus seres queridos en la presencia de Dios Padre, él te traerá paz y salud al corazón. Ahora yo me voy a quedar un momento en silencio para escucharte a ti. ¡vamos sin miedo! Saca todo lo que tengas en el corazón a través de una charla simple, yo que soy tu madre estaré junto a ti porque sé que no es fácil. Y luego rezaremos juntos.",
        imagen: IMG_ESCENA_4, caption: "",
      },
      // Paso 7 — Meditación / Miserere (nuevo)
      {
        uid: uid(), voz: "canto", tipo: "meditacion",
        speaker: "Meditación",
        audio: true, audioUrl: "/sounds/miserere.mp3", audioName: "miserere.mp3", dur: 180,
        pauseDuration: 180,
        accion: "Miserere (Allegri) — Momento de oración personal",
        texto: "Miserere (Allegri) — Momento de oración personal",
        imagen: IMG_VIRGEN_ABRAZANDO, caption: "",
      },
      // Paso 8 — María
      {
        uid: uid(), voz: "maria", tipo: "subtitulo",
        speaker: "Virgen María",
        audio: true, audioUrl: "/sounds/paso_5_virgen.mp3", audioName: "paso_5_virgen.mp3", dur: 0,
        texto: "Todo esto que me has dicho, lo depositamos ahora en las manos de Dios Padre, para que sea El quien te traiga paz y consuelo. Con la esperanza cierta que las almas de tus difuntos un día resucitaran, y nos volveremos a encontrar. Por eso pedimos el eterno descanso para ellas.",
        imagen: IMG_ESCENA_5, caption: "",
      },
      // Paso 9 — Canto Gloria (nuevo)
      {
        uid: uid(), voz: "canto", tipo: "meditacion",
        speaker: "Canto",
        audio: true, audioUrl: "/sounds/padre_nuestro.mp3", audioName: "padre_nuestro.mp3", dur: 0,
        accion: "Padre Nuestro (Arpa Dei)",
        texto: "Padre Nuestro (Arpa Dei)",
        imagen: IMG_GLORIA_CIELO, caption: "",
      },
      // Paso 10 — Ángel (cierre)
      {
        uid: uid(), voz: "angel", tipo: "subtitulo",
        speaker: "Ángel de la Guarda",
        audio: true, audioUrl: "/sounds/paso_6_cierre.mp3", audioName: "paso_6_cierre.mp3", dur: 0,
        texto: "Quédate en paz luego de este momento de oración, y ya sabes aquí te estamos esperando para que vengas a encontrarte con Dios y con el alma de tus seres queridos.",
        imagen: IMG_ESCENA_6, caption: "",
      },
    ],
    countdown: 20,
  };
}
