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

/* Imágenes del CAMINO DE DIOS PADRE (public/)        */
/* ------------------------------------------------ */
export const IMG_ANGEL_GUARDA_1 = "angel_guarda_1.jpg";
export const IMG_PANTEONES_CEMENTERIO = "panteones_cementerio.jpg";
export const IMG_PRODIGO_1 = "prodigo_1.jpg";
export const IMG_PRODIGO_2 = "prodigo_2.jpg";
export const IMG_PRODIGO_3 = "prodigo_3.jpg";
export const IMG_PRODIGO_4 = "prodigo_4.jpg";
export const IMG_ABRAZO_PADRE = "abrazo_padre.jpg";
export const IMG_DAVID_SALMO = "david_salmo.jpg";
export const IMG_ANGEL_GUARDA_2 = "angel_guarda_2.jpg";
export const IMG_CRUZ_CIELO = "cruz_cielo.jpg";
export const IMG_REZO_FINAL = "rezo_final.jpg";
export const IMG_LUZ_MUNDO = "luz_mundo.jpg";

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
export const IMG_CALVARIO = "calvario.jpeg";
export const IMG_GLORIA_CIELO = "gloria_cielo.jpg";

/* Imágenes del bloque Padre Nuestro → 3 Ave María → Gloria (audio nuevo).
   Fases del audio padre_nuestro_ave_gloria.mp3 (4:21 total):
     0:00–1:04  Padre Nuestro  (IMG_PADRE_NUESTRO)
     1:04–3:48  3 Ave María     (IMG_AVE_MARIA, se repite en las 3)
     3:48–4:21  Gloria          (IMG_GLORIA)
   Coloca estos archivos en /public/ (o reemplaza por las que quieras). */
export const IMG_PADRE_NUESTRO = "padre_nuestro.jpg";
export const IMG_AVE_MARIA = "ave_maria.jpg";
export const IMG_GLORIA = "gloria.jpg";
/*
  TRANSICIÓN DE MÚLTIPLES IMÁGENES (slides) en un paso:
  Para que un paso muestre varias imágenes que cambian en el tiempo,
  guarda los archivos en /public/ y nómbralos en la propiedad `imagenes`
  (array) del paso. La duración del audio se reparte en partes iguales
  entre las imágenes. Ejemplo (paso m5_canto):
    imagenes: [
      IMG_CALVARIO_1,  // calvario.jpeg
      IMG_CALVARIO_2,  // calvario_2.jpeg
      IMG_CALVARIO_3,  // calvario_3.jpeg
      IMG_CALVARIO_4,  // calvario_4.jpeg
      IMG_CALVARIO_5,  // calvario_5.jpeg
    ],
  En el panel admin verás la ruta exacta (public/...) de cada archivo.
  Debes colocar el archivo físico en la carpeta /public/ del proyecto.
*/
export const IMG_CALVARIO_1 = "calvario.jpeg";
export const IMG_CALVARIO_2 = "calvario_2.jpeg";
export const IMG_CALVARIO_3 = "calvario_3.jpeg";
export const IMG_CALVARIO_4 = "calvario_4.jpeg";
export const IMG_CALVARIO_5 = "calvario_5.jpeg";

/*
  TRANSICIÓN DE MÚLTIPLES IMÁGENES (slides) del paso m7_canto (Miserere):
  El audio miserere.mp3 dura 3 min (180 s) y muestra 4 imágenes que cambian
  cada 45 s (180/4). Debes colocar estos archivos en /public/:
    miserere_1.jpeg, miserere_2.jpeg, miserere_3.jpeg, miserere_4.jpeg
*/
export const IMG_MISERERE_1 = "miserere_1.jpg";
export const IMG_MISERERE_2 = "miserere_2.jpg";
export const IMG_MISERERE_3 = "miserere_3.jpg";
export const IMG_MISERERE_4 = "miserere_4.jpg";

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
        "Bienvenido al Cementerio Católico de Colonia Crespo, soy tu Ángel de la Guarda y deseo acompañarte en esta visita al camposanto,",
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
      { id: "padre", titulo: "Orar con el Padre", desc: "Dios, tu Padre que tanto te ama", img: IMG_PADRE_CARD, habilitado: true },
      { id: "jesus", titulo: "Orar con Jesús", desc: "Quien muriendo en la cruz te redimió", img: IMG_JESUS_CARD, habilitado: false },
      { id: "maria", titulo: "Orar con la Virgen María", desc: "Tu madre siempre está a tu lado", img: IMG_MARIA_CARD, habilitado: true },
    ],
    camino: [
      // Paso 1 — Ángel (apertura del camino)
      {
        uid: uid(), id: "m1_voz", voz: "angel", tipo: "modo-voz",
        speaker: "Ángel de la Guarda",
        audio: true, audioUrl: "/sounds/paso_1_angel.mp3", audioName: "paso_1_angel.mp3", dur: 0,
        texto: "Busca un lugar tranquilo, en silencio, si deseas siéntate y empecemos a orar juntos, serán pocos minutos, veras como tu corazón experimentara una paz muy grande y tus queridos difuntos te lo agradecerán. Pongámonos en presencia de la Santísima Trinidad para que nos acompañen en este momento de oración, hagamos juntos la señal de la cruz: en el nombre del Padre y del Hijo y del Espíritu Santo. Amen.",
        imagen: IMG_ESCENA_1, caption: "",
      },
      // Paso 2 — Canto Trinidad (nuevo)
      {
        uid: uid(), id: "m2_canto", voz: "canto", tipo: "modo-canto",
        speaker: "Canto",
        audio: true, audioUrl: "/sounds/canto_trinidad.mp3", audioName: "canto_trinidad.mp3", dur: 0,
        accion: "¡A Ti la Alabanza y la Gloria,\nOh Santa Trinidad!",
        texto: "¡A Ti la Alabanza y la Gloria,\nOh Santa Trinidad!",
        imagen: IMG_MANOS_ORANTES, caption: "",
      },
      // Paso 3 — Ángel (continuación)
      {
        uid: uid(), id: "m3_voz", voz: "angel", tipo: "modo-voz",
        speaker: "Ángel de la Guarda",
        audio: true, audioUrl: "/sounds/paso_2_angel.mp3", audioName: "paso_2_angel.mp3", dur: 0,
        texto: "Tú elegiste compartir este momento de oración con tu Madre, la Virgen María. Te propongo que le cuentes a ella lo que siente tu corazón, es muy sencillo, consiste en decirle con palabras simples: cuáles son tus alegrías, y qué es lo que te da tristeza, cuéntale lo que estás viviendo con tu familia, en el trabajo, o con tu salud, sabiendo que tu Madre te ama y te está escuchando en este momento.",
        imagen: IMG_ESCENA_2, caption: "",
      },
      // Paso 4 — María
      {
        uid: uid(), id: "m4_voz", voz: "maria", tipo: "modo-voz",
        speaker: "Virgen María",
        audio: true, audioUrl: "/sounds/paso_3_virgen.mp3", audioName: "paso_3_virgen.mp3", dur: 0,
        texto: "Yo soy tu Madre, la Virgen María, y te confieso que ahora me estás dando una alegría inmensa con esta visita. Tú sabes cómo somos las mamás, no vemos la hora de poder estar a solas un rato con nuestros hijos para hablar de nuestras cosas. Si supieras cuánto tiempo llevo esperándote en este lugar santo para poder abrazarte, para poder consolar la tristeza que te ha dejado la muerte de tus seres queridos, para llenar la soledad de su partida, para cubrir tu alma con la paz que sólo mi hijo Jesús puede darte. Yo sé cuánto extrañas a quienes aquí están sepultados. Comprendo que darías todo lo que tienes para sentarte junto a ellos unos pocos minutos y por última vez abrazarlos y decirles ¡gracias, los quiero mucho! o tal vez decirles que los perdonas porque en vida te han hecho sufrir. Como yo estoy día y noche junto a ti, sé muy bien que, desde el instante de su partida de este mundo, tu casa ya no es la misma sin ellos, veo que a la ramada del patio le falta algo sin el eco de sus risas, siento que la cocina te parece vacía sin el olor a la comida que te preparaban y que hay momentos en tu vida que todo se te hace cuesta arriba porque no los tienes cerca para pedirles un consejo. Todo esto lo comprendo muy bien porque yo soy mamá y también pasé por un dolor semejante al tuyo. Te voy a contar un secreto que guardo en mi alma desde hace muchos años y estaba esperando el momento justo para decírtelo. El viernes santo, la muerte llamó a la puerta de mi corazón y me arrancó de un tirón lo que yo más amaba, a mi Hijo Jesús. Aquella tarde, sentí la tristeza que tú sientes, esa misma soledad que ahoga tu alma, yo también añoré un abrazo, un último beso, pero la muerte me lo arrebató. En ese momento, desde lo profundo de mi corazón dolido, me brotó esta oración como si fuera un lamento, que deposité en las manos de Dios Padre, y eso me trajo una profunda paz, que me dio fuerzas para seguir adelante con la vida.",
        imagen: IMG_ESCENA_3, caption: "",
      },
      // Paso 5 — Canto Calvario (nuevo)
      {
        uid: uid(), id: "m5_canto", voz: "canto", tipo: "modo-canto",
        speaker: "Canto",
        audio: true, audioUrl: "/sounds/diario_de_maria.mp3", audioName: "diario_de_maria.mp3", dur: 0,
        accion: "El diario de María",
        texto: "El diario de María",
        imagen: IMG_CALVARIO, caption: "",
        /* Transición de 5 imágenes. El audio diario_de_maria.mp3 dura 5:11
           (311 s), así que cada imágen permanece ~62 s (311/5). Coloca estos
           archivos en /public/: calvario.jpeg, calvario_2.jpeg, calvario_3.jpeg,
           calvario_4.jpeg y calvario_5.jpeg. */
        imagenes: [
          IMG_CALVARIO_1,
          IMG_CALVARIO_2,
          IMG_CALVARIO_3,
          IMG_CALVARIO_4,
          IMG_CALVARIO_5,
        ],
        /* Imágenes verticales 444x640: se muestran completas (object-fit:
           contain) centradas, con los costados en el color de la caja. */
        contain: true,
      },
      // Paso 6 — María (meditación personal)
      {
        uid: uid(), id: "m6_voz", voz: "maria", tipo: "modo-voz",
        speaker: "Virgen María",
        audio: true, audioUrl: "/sounds/paso_4_virgen.mp3", audioName: "paso_4_virgen.mp3", dur: 0,
        texto: "En el momento más difícil de mi vida, cuando tuve que enfrentar la muerte de mi Hijo, me dio mucho alivio el poder contarle a Dios con mis palabras, mi dolor, mi soledad y mi tristeza. Te propongo que hagas lo mismo que hice yo en aquel terrible momento: cuéntale a Dios y a tu ser querido difunto, en una charla mano a mano, ¿qué es lo que más extrañas de su ausencia? Si te quedó una cuenta pendiente, habla de ello con su alma, ofrécele tu perdón, no guardes rencor, aprovecha este momento para que Dios Padre te sane esas heridas viejas, y aquellos problemas que no pudiste arreglar en vida. Si necesitas un consejo, cuéntale tu dificultad y pide ayuda. Es muy bueno que hables con el alma de tus seres queridos en la presencia de Dios Padre, él te traerá paz y salud al corazón. Ahora yo me voy a quedar un momento en silencio para escucharte a ti. ¡Vamos, sin miedo! Saca todo lo que tengas en el corazón a través de una charla simple con Dios y con el alma de tu ser querido, yo estaré junto a ti porque sé que no es fácil.",
        imagen: IMG_ESCENA_4, caption: "",
      },
      // Paso 7 — Meditación / Miserere (nuevo)
      {
        uid: uid(), id: "m7_canto", voz: "canto", tipo: "modo-canto",
        speaker: "Meditación",
        audio: true, audioUrl: "/sounds/miserere.mp3", audioName: "miserere.mp3", dur: 180,
        pauseDuration: 180,
        accion: "Momento de Oración Personal\n(Habla con Dios y con el\nalma de tus seres queridos)",
        texto: "Momento de Oración Personal\n(Habla con Dios y con el\nalma de tus seres queridos)",
        imagen: IMG_MISERERE_1, caption: "",
        /* Transición de 4 imágenes: el audio miserere.mp3 dura 3 min (180 s),
           así que cada imágen permanece ~45 s (180/4). Coloca los archivos en
           /public/: miserere_1.jpg, miserere_2.jpg, miserere_3.jpg y
           miserere_4.jpg. La caja se ajusta a la proporción de cada imagen. */
        imagenes: [
          IMG_MISERERE_1,
          IMG_MISERERE_2,
          IMG_MISERERE_3,
          IMG_MISERERE_4,
        ],
        contain: true,
      },
      // Paso 8 — María
      {
        uid: uid(), id: "m8_voz", voz: "maria", tipo: "modo-voz",
        speaker: "Virgen María",
        audio: true, audioUrl: "/sounds/paso_5_virgen.mp3", audioName: "paso_5_virgen.mp3", dur: 0,
        texto: "Todo esto que me has dicho, lo depositamos ahora en las manos de Dios Padre, para que sea El quien te traiga paz y consuelo. Con la esperanza cierta que las almas de tus difuntos un día resucitaran, y nos volveremos a encontrar. Por eso pedimos el eterno descanso para ellas.",
        imagen: IMG_ESCENA_5, caption: "",
      },
            // Paso 9 — Canto Padre Nuestro + 3 Ave María + Gloria (nuevo)
      {
        uid: uid(), id: "m9_canto", voz: "canto", tipo: "modo-canto",
        speaker: "Canto",
        audio: true, audioUrl: "/sounds/padre_nuestro_ave_gloria.mp3", audioName: "padre_nuestro_ave_gloria.mp3", dur: 261,
        texto: "Padre Nuestro\nAve María (3)\nGloria",
        imagen: IMG_PADRE_NUESTRO, caption: "",
        /* Transición de 3 imágenes. El audio padre_nuestro_ave_gloria.mp3
           dura 4:21 (261 s). Las imágenes cambian en los instantes exactos en
           que cambia cada oración (se usa `slideTimes`):
             0:00–1:04  Padre Nuestro → IMG_PADRE_NUESTRO  (inicio 0s)
             1:04–3:48  3 Ave María    → IMG_AVE_MARIA     (64s, se mantiene)
             3:48–4:21  Gloria         → IMG_GLORIA        (228s)
           Coloca estos archivos en /public/. */
        imagenes: [
          IMG_PADRE_NUESTRO,
          IMG_AVE_MARIA,
          IMG_GLORIA,
        ],
        /* Segundos en que inicia cada imagen (debe coincidir con `imagenes`). */
        slideTimes: [0, 64, 228],
        /* Teleprompter de secciones: cada línea se ilumina mientras se canta
           esa parte del audio (efecto "pasado / activo / futuro"). */
        teleprompter: {
          keyframes: [
            { t: 0, sub: "Padre Nuestro" },
            { t: 64, sub: "Ave María" },
            { t: 228, sub: "Gloria" },
          ],
        },
        contain: true,
    },
            // Paso 10 — Ángel (cierre)
      {
        uid: uid(), id: "m10_voz", voz: "angel", tipo: "modo-voz",
        speaker: "Ángel de la Guarda",
        audio: true, audioUrl: "/sounds/paso_6_cierre.mp3", audioName: "paso_6_cierre.mp3", dur: 0,
        texto: "Quédate en paz luego de este momento de oración, y ya sabes aquí te estamos esperando para que vengas a encontrarte con Dios y con el alma de tus seres queridos.",
        imagen: IMG_ESCENA_6, caption: "",
      },
    ],
    /* Camino con Dios Padre (reutiliza los modelos del camino de María).
       Se completa por separado para poder activarlo en Configuración. */
    caminoPadre: buildCaminoPadre(),
        countdown: 20,
    /* Versión de contenido del desarrollador. Incluyelo/incrémentalo cada vez
       que cambies textos, imágenes o estructura en defaults.js para que el
       navegador NO restaure una copia vieja guardada en localStorage y muestre
          siempre la última versión. */
         version: 15,
  };
}

/* =====================================================================
   CAMINO CON DIOS PADRE
   =====================================================================
   Reutiliza los 8 modelos del "Camino de María":
     1. Apertura voz       (modo-voz, voz + imagen estática)
     2. Canto con imagen   (modo-canto, audio de canto + imagen)
     3. Voz larga          (modo-voz, texto extenso)
     4. Canto con slide    (modo-canto, múltiples imágenes temporizadas)
     5. Meditación         (modo-canto, pauseDuration + slides)
     6. Voz de transición  (modo-voz, introduce el siguiente paso)
     7. Canto de cierre    (modo-canto)
     8. Voz de despedida   (modo-voz, cierre final)
   ===================================================================== */
export function buildCaminoPadre() {
  return [
    /* PASO 1 — Apertura (Modelo 1: Apertura voz)
       Voz del Ángel de la Guarda, imagen estática. */
    {
      uid: uid(), id: "p1_voz", voz: "angel", tipo: "modo-voz",
      speaker: "Ángel de la Guarda",
      audio: true, audioUrl: "/sounds/angel_paso_1.mp3", audioName: "angel_paso_1.mp3", dur: 0,
            texto: "Bienvenido a este momento de oración, en el cual Dios Padre estará junto a ti, acompañándote. Soy tu Ángel de la Guarda, y te conozco de toda la vida, yo podría describir perfectamente la rutina que tienes cada vez que vienes a visitar a tus difuntos en este camposanto. ¿No me crees? Déjame que te lo demuestre. Tú entras al cementerio, caminas hacia las tumbas de tus seres queridos, miras sus fotos, apoyas los helechos y las flores, vas hasta la canilla de agua, llenas un recipiente, regresas a la tumba para limpiarla, recuerdas algún acontecimiento de tu vida vivido junto a la persona fallecida, te haces la señal de la cruz y luego regresas a tu casa. Eres muy predecible, toda la vida hiciste lo mismo. Y ahora, te hago una pregunta. ¿No crees que a esta rutina le falta algo? ¿No percibes en tu interior la necesidad de una oración más profunda? ¡Claro que falta algo! Falta entregarle tu corazón a Dios Padre, que te ha creado y te ama con locura. ¡Déjame ayudarte! Te propongo que nos pongamos en la presencia de Dios Padre, bajo su mirada protectora y digamos juntos:",
            /* Sincronización manual del teleprompter (compensación por pausas/reflexiones).
               Formato de cada keyframe: { t: segundos del audio, sub: fragmento de texto }.
               La línea que contiene "sub" se mostrará a partir del segundo t (el
               teleprompter llega tarde a esta palabra; hay que adelantarla). */
            teleprompter: {
              keyframes: [
                { t: 42, sub: "de tu vida vivido junto a la persona fallecida" },
              ],
            },
            imagen: IMG_ANGEL_GUARDA_1, caption: "",
    },
        /* PASO 2 — Invocación Inicial (Modelo 2: Canto con imagen + teleprompter)
       Canto de Harpa Dei, imagen estática. El texto se muestra en el
       teleprompter (varias líneas) y cada una se ilumina al cantarse.
       Audio: canto_invocacion.mp3 — duración total 40 s; la voz inicia en el
       segundo 2 y cierra con "Amén" en el segundo ~32.
       Los keyframes sincronizan el inicio de cada línea con su momento en el
       audio (ajusta los segundos si el audio final difiere). Sin `accion`, el
       teleprompter se activa automáticamente (useTeleprompter). */
    {
      uid: uid(), id: "p2_canto", voz: "canto", tipo: "modo-canto",
      speaker: "Canto",
      audio: true, audioUrl: "/sounds/canto_invocacion.mp3", audioName: "canto_invocacion.mp3", dur: 40,
      texto: "Dios mío, ven en mí auxilio.\nSeñor, date prisa en socorrerme.\nGloria al Padre, y al Hijo, y al Espíritu Santo,\ncomo era en el principio, ahora y siempre,\npor los siglos de los siglos.\nAmén.",
      /* Teleprompter de secciones: cada línea se ilumina cuando se canta.
         `t` es el segundo del audio donde arranca la frase (entre 2 y 32). */
      teleprompter: {
        keyframes: [
          { t: 2, sub: "Dios mío" },
          { t: 6, sub: "Señor, date prisa" },
          { t: 14, sub: "Gloria al Padre" },
          { t: 21, sub: "como era" },
          { t: 26, sub: "por los siglos" },
          { t: 29.5, sub: "Amén." },
        ],
      },
      imagen: IMG_MANOS_ORANTES, caption: "",
    },
    /* PASO 3 — Reflexión en el cementerio (Modelo 3: Voz larga)
       Voz del Ángel de la Guarda, texto extenso. */
    {
      uid: uid(), id: "p3_voz", voz: "angel", tipo: "modo-voz",
      speaker: "Ángel de la Guarda",
      audio: true, audioUrl: "/sounds/angel_paso_3.mp3", audioName: "angel_paso_3.mp3", dur: 0,
            texto: "Ahora que empiezas a sentir cómo tu Padre Dios te está mirando y percibes que una profunda paz llega a tu alma, te invito a que cambies la rutina que siempre tienes cuando vienes al cementerio. Te propongo que te vayas a caminar entre las tumbas, las galerías y los panteones. No te llevará mucho tiempo. En el camino, observa con detenimiento las lápidas y las fotos allí expuestas, te encontrarás con tantos parientes, vecinos, amigos y gente conocida. Personas de todas las edades, ancianos, jóvenes y niños. Todos ellos, entre alegrías y tristezas, llegaron al momento final de sus vidas en la tierra y tuvieron que dar el paso hacia la verdadera Patria, que está en la eternidad. A través de la muerte llegaron al encuentro con Dios Padre. La muerte nos iguala a todos. Mira a tu alrededor, ricos con grandes panteones y pobres sepultados en los lugares comunes, estancieros en ataúdes de roble y peones en la tierra desnuda, jóvenes y viejos, todos sin distinción alguna, un día tuvieron que dejar estas Colonias, sus familias y sus cosas para encontrarse con Dios Padre. Todos regresaron a la tierra de donde habían salido. Así te sucederá también a ti, y recuerda lo que decía el Papa Francisco, las mortajas no tienen bolsillo, no hay nada que puedas llevarte de este mundo, salvo las obras de caridad y un corazón humilde. Morir es lo único seguro que tenemos en esta vida. Por eso a la muerte no debes tenerle miedo, porque sabes que en ese día te podrás abrazar con tu Padre Dios, que te ha creado y tanto te ama. Yo pienso que sí deberías sentir miedo, y ¡mucho miedo!, a tener el corazón lleno de rencor, a no perdonar por una calumnia que te han hecho o una herencia mal dividida; a criticar a tus parientes y compañeros de trabajo con los que no te llevas bien; deberías tener miedo de la envidia que sientes por tus vecinos que compraron un camión de novillos y cambiaron la chata por otra más nueva, tendrías que temer a seguir estafando a la gente en tus negocios. A esto es a lo que hay que tener miedo, a que llegue el día de la muerte y me encuentre con el corazón usurpado por el mal. Lo bueno en todo esto es que tu Padre Dios conoce todo lo que hay en tu alma, y no se avergüenza de los males que has cometido, porque te ama, pero desea que cambies, para vivir en paz, porque el pecado, lo único que te ha dejado como resultado es dolor, división, peleas, rencor, intranquilidad, y así no vale la pena vivir los pocos días de existencia que te quedan. Estás frente a la gran posibilidad de renacer como una persona nueva, como sucedió en la parábola del hijo pródigo. Con la ayuda de tu Padre Dios podrás perdonar a los que te hicieron el mal, podrás ser honesto, podrás abandonar la crítica, podrás dejar de envidiar, y todo esto te dará una gran paz. No perdamos más tiempo, te propongo que hagas como el hijo pródigo que, en medio de la soledad y el dolor de sus pecados, decidió regresar a la casa de su Padre. Aprovecha este momento de gracia y pídele que te ayude a dar un cambio a tu vida. Podrías hacerlo con este canto.",
            /* Sincronización manual del teleprompter (compensación por pausas/reflexiones):
         Formato de cada keyframe: { t: segundos del audio, sub: fragmento de texto }.
         La línea que contiene "sub" se mostrará a partir del segundo t. */
      teleprompter: {
        keyframes: [
          { t: 77, sub: "dejar estas Colonias" },
          { t: 123, sub: "corazón lleno de rencor" },
        ],
      },
      imagen: IMG_PANTEONES_CEMENTERIO, caption: "",
    },
    /* PASO 4 — El Hijo Pródigo (Modelo 4: Canto con slide)
       Canto de contemplación con imágenes rotativas. */
    {
      uid: uid(), id: "p4_canto", voz: "canto", tipo: "modo-canto",
      speaker: "Canto",
      audio: true, audioUrl: "/sounds/canto_hijo_prodigo.mp3", audioName: "canto_hijo_prodigo.mp3", dur: 0,
      accion: "El Hijo Pródigo",
      texto: "(Canto del Hijo Pródigo - momento de contemplación con imágenes rotativas)",
      imagen: IMG_PRODIGO_1, caption: "",
      /* Transición de 4 imágenes rotativas. Coloca los archivos en /public/:
         prodigo_1.jpg, prodigo_2.jpg, prodigo_3.jpg y prodigo_4.jpg. */
      imagenes: [
        IMG_PRODIGO_1,
        IMG_PRODIGO_2,
        IMG_PRODIGO_3,
        IMG_PRODIGO_4,
      ],
      contain: true,
    },
    /* PASO 5 — El perdón de Dios (Modelo 6: Voz de transición)
       Voz del Ángel de la Guarda, imagen estática. */
    {
      uid: uid(), id: "p5_voz", voz: "angel", tipo: "modo-voz",
      speaker: "Ángel de la Guarda",
      audio: true, audioUrl: "/sounds/angel_paso_5.mp3", audioName: "angel_paso_5.mp3", dur: 0,
      texto: "Tu Padre Dios te ama tanto que a Él no le importa cuánto te alejaste de su amor, Él no mira lo graves que son tus pecados, Dios abre sus brazos para recibirte, siempre que con humildad le pidas perdón. Tu Padre Dios está dispuesto a abrazarte para ofrecerte la posibilidad de cambiar de rumbo y regresar a sus brazos, de donde no tendrías que haberte alejado. Probablemente te estás preguntando: ¿cómo puedo cambiar a esta altura de mi vida? Tú solo no puedes, es tu Padre Dios quien trabaja junto a ti, en tu interior, mientras rezas. Por ejemplo, ahora, en este tiempo de oración, tu Padre comienza a ocupar dentro de tu corazón el lugar que le corresponde, ese espacio que hasta hoy estaba usurpado por el enemigo. Mientras tú rezas, Dios conquista toda tu mente, tu corazón y tu voluntad, desplazando el mal que había echado raíces dentro tuyo. Pídele con todo el corazón que te perdone y que te ayude a cambiar de rumbo para que el día de la muerte puedas gozar del cielo eternamente. Lo puedes hacer con las palabras del salmo que compuso el Rey David para suplicar la misericordia de Dios.",
            /* Sincronización manual del teleprompter (compensación por pausas/reflexiones):
         Formato de cada keyframe: { t: segundos del audio, sub: fragmento de texto }.
         La línea que contiene "sub" se mostrará a partir del segundo t. */
      teleprompter: {
        keyframes: [
          { t: 24, sub: "que haberte alejado" },
          { t: 42, sub: "ahora en este tiempo de oración" },
          { t: 75, sub: "puedes hacer con las palabras del salmo" },
          { t: 93, sub: "decidió regresar a la casa" },
        ],
      },
      imagen: IMG_ABRAZO_PADRE, caption: "",
    },
    /* PASO 6 — Salmo 51 (Modelo 2: Canto con imagen)
       Canto, imagen estática. */
    {
      uid: uid(), id: "p6_canto", voz: "canto", tipo: "modo-canto",
      speaker: "Canto",
      audio: true, audioUrl: "/sounds/salmo_51.mp3", audioName: "salmo_51.mp3", dur: 0,
      accion: "Salmo 51",
      texto: "Misericordia, Dios mío, por tu bondad, por tu inmensa compasión borra mi culpa; lava del todo mi delito, limpia mi pecado. (Meditación del Salmo 51)",
            imagen: IMG_DAVID_SALMO, caption: "",
    },
    /* PASO 7 — Preparación Padre Nuestro (Modelo 6: Voz de transición)
       Voz del Ángel de la Guarda, imagen estática. */
    {
      uid: uid(), id: "p7_voz", voz: "angel", tipo: "modo-voz",
      speaker: "Ángel de la Guarda",
      audio: true, audioUrl: "/sounds/angel_paso_7.mp3", audioName: "angel_paso_7.mp3", dur: 0,
      texto: "Te propongo que mientras rezas el Padrenuestro, vayas haciendo memoria de todas las palabras o actos que han hecho sufrir a Dios o al prójimo, y pidas perdón por ello. Esto te dejará bien preparado para que en breve te puedas confesar con un sacerdote, y recibir la absolución sacramental.",
      imagen: IMG_ANGEL_GUARDA_2, caption: "",
    },
        /* PASO 8 — Padre Nuestro · 3 Ave María · Gloria (Modelo 2: Canto con slide)
       Canto de Harpa Dei, imagen con transición por sección. */
    {
      uid: uid(), id: "p8_canto", voz: "canto", tipo: "modo-canto",
      speaker: "Canto",
            audio: true, audioUrl: "/sounds/padre_nuestro_ave_gloria.mp3", audioName: "padre_nuestro_ave_gloria.mp3", dur: 261,
      texto: "Padre Nuestro\nAve María (3)\nGloria",
      imagen: IMG_PADRE_NUESTRO, caption: "",
      /* Transición de 3 imágenes. El audio padre_nuestro_ave_gloria.mp3
         dura 4:21 (261 s). Las imágenes cambian en los instantes exactos en
         que cambia cada oración (se usa `slideTimes`):
           0:00–1:04  Padre Nuestro → IMG_PADRE_NUESTRO  (inicio 0s)
           1:04–3:48  3 Ave María    → IMG_AVE_MARIA     (64s, se mantiene)
           3:48–4:21  Gloria         → IMG_GLORIA        (228s)
         Coloca estos archivos en /public/. */
      imagenes: [
        IMG_PADRE_NUESTRO,
        IMG_AVE_MARIA,
        IMG_GLORIA,
      ],
      /* Segundos en que inicia cada imagen (debe coincidir con `imagenes`). */
      slideTimes: [0, 64, 228],
      /* Teleprompter de secciones: cada línea se ilumina mientras se canta
         esa parte del audio (efecto "pasado / activo / futuro"). */
      teleprompter: {
        keyframes: [
          { t: 0, sub: "Padre Nuestro" },
          { t: 64, sub: "Ave María" },
          { t: 228, sub: "Gloria" },
        ],
      },
      contain: true,
    },
    /* PASO 9 — Pésame y Oración Final (Modelo 8: Voz de despedida)
       Voz del Ángel de la Guarda, imagen estática. */
    {
      uid: uid(), id: "p9_voz", voz: "angel", tipo: "modo-voz",
      speaker: "Ángel de la Guarda",
      audio: true, audioUrl: "/sounds/angel_paso_9.mp3", audioName: "angel_paso_9.mp3", dur: 0,
            texto: "Recemos juntos el Pésame: Pésame, Dios mío, y me arrepiento de todo corazón de haberte ofendido. Pésame por el infierno que merecí y por el Cielo que perdí, pero mucho más me pesa porque pecando ofendí a un Dios tan bueno y tan grande como Vos. Antes querría haber muerto que haberos ofendido, y propongo firmemente no pecar más y evitar todas las ocasiones próximas de pecado. Amén.\n\n(Oración Final)\n\nPadre amado de todos los hombres, acoge benigno esta oración que te ofrecemos llenos de gozo. Cumple tus promesas, que los hombres al conocer tu verdadera imagen se convertirán a ti y retornarán a casa. Haznos instrumentos de tu amor y tu misericordia. Te lo pedimos por Jesucristo, nuestro Señor y nuestro Dios, que contigo y el Espíritu Santo vive y reina por los siglos de los siglos. Amén.",
            /* Sincronización manual del teleprompter (compensación por pausas/reflexiones).
         Formato de cada keyframe: { t: segundos del audio, sub: fragmento de texto }.
         La línea que contiene "sub" se mostrará a partir del segundo t.
         Nota: se insertó una pausa obligatoria en el audio tras "Amén.\n\n(Oración Final)\n\n". */
      teleprompter: {
        keyframes: [
          { t: 28, sub: "Amén" },
          { t: 31.5, sub: "Padre amado" },
        ],
      },
      imagen: IMG_REZO_FINAL, caption: "",
    },
        /* PASO 10 — Oración por los Pueblos (Modelo 2: Canto con imagen + teleprompter)
       Canto de Harpa Dei, imagen estática. El texto se muestra en el
       teleprompter y cada línea se ilumina al cantarse.
       Audio: oracion_pueblos.mp3. Los tiempos de los keyframes marcan el
       momento exacto (en segundos) en que inicia cada frase del audio.
       Formato de tiempos del desarrollador: "1,02" = 1 minuto 2 seg = 62 s. */
    {
      uid: uid(), id: "p10_canto", voz: "canto", tipo: "modo-canto",
      speaker: "Canto",
      audio: true, audioUrl: "/sounds/oracion_pueblos.mp3", audioName: "oracion_pueblos.mp3", dur: 0,
      texto: "Amado Padre Celestial,\nllenos de confianza acudimos a Ti,\ncreyendo firmemente que vendrás al\nauxilio de los pueblos.\nMira el sufrimiento causado por tantas\nformas de violencia injusta,\ny manifiesta tu poder para debilitar al Maligno.\nMira la confusión anticristiana que\nse difunde cada vez más en\neste mundo, queriendo influenciar\naún a la Iglesia. Ilumínanos y fortalécenos\ncon tu Espíritu Santo para que\npodamos resistir al espíritu del mal\ncon tu poder.\nPreserva a los tuyos en la fidelidad\na Ti, y haznos apóstoles\nde tu amor paternal, para que todos\nlos hombres reconozcan y sigan a tu\nHijo Jesucristo, nuestro Señor.\nAmén.",
      /* Teleprompter: cada línea ilumina al cantarse. El segundo indica el
         instante del audio en que arranca esa frase (mín=seg por si difiere
         del real). Ajusta si el audio cambia. */
      teleprompter: {
        keyframes: [
          { t: 0, sub: "Amado Padre Celestial" },
          { t: 6, sub: "llenos de confianza acudimos" },
          { t: 14, sub: "creyendo firmemente que vendrás" },
          { t: 19, sub: "auxilio de los pueblos" },
          { t: 23, sub: "Mira el sufrimiento causado" },
          { t: 29, sub: "formas de violencia injusta" },
          { t: 37, sub: "manifiesta tu poder" },
          { t: 45, sub: "Mira la confusión anticristiana" },
          { t: 53, sub: "se difunde cada vez más" },
          { t: 57, sub: "este mundo, queriendo" },
          { t: 62, sub: "aún a la Iglesia" },
          { t: 73, sub: "con tu Espíritu Santo" },
          { t: 77, sub: "podamos resistir al espíritu" },
          { t: 84, sub: "con tu poder" },
          { t: 88, sub: "Preserva a los tuyos" },
          { t: 93, sub: "haznos apóstoles" },
          { t: 98, sub: "amor paternal" },
          { t: 105, sub: "los hombres reconozcan" },
          { t: 111, sub: "Hijo Jesucristo" },
          { t: 118, sub: "Amén." },
        ],
      },
      imagen: IMG_LUZ_MUNDO, caption: "",
    },
  ];
}
