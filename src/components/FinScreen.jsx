/* =====================================================================
   COMPONENTS / FinScreen.jsx — cierre del recorrido en 2 fases.
   =====================================================================
   FASE 1 (0 → 15 s): cruz + título + texto de paz + cuenta regresiva,
                       sobre fondo oscuro difuminado (.sbg).
   FASE 2: SOLO la tarjeta de feedback + el botón "Volver al inicio",
           sobre la foto nítida de fondo (.sbg-fin, /fondo.avif).
   ===================================================================== */
import { useEffect, useState } from "react";
import { Ic } from "./icons.jsx";

const FASE_1_MS = 15;        // segundos de la fase de meditación

export default function FinScreen({ cfg, onHome }) {
  const d = cfg.despedida;

  const [fase, setFase] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Cuenta regresiva de 15 s. Al llegar a 0 pasa a la Fase 2.
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setFase(2);
    }
  }, [timeLeft]);

  // Envía el feedback al Cloudflare Worker. Lee `rating` y `comment` del estado.
  const handleSendFeedback = async () => {
    try {
      await fetch("https://ccc.camposanto.workers.dev/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: rating,
          comment: comment,
          camino: "Dios Padre",
        }),
      });
    } catch (error) {
      console.error("Error enviando feedback:", error);
    } finally {
      setSubmitted(true);
    }
  };

  const handleSendComment = () => {
    handleSendFeedback();
  };

  return (
    <div className="splash">
      {/* Fondo: Fase 1 difuminado (.sbg); Fase 2 nítido (.sbg-fin). */}
      <div
        className={fase === 2 ? "sbg-fin" : "sbg"}
        style={{ backgroundImage: "url('/fondo.avif')" }}
      />
      <div className={fase === 2 ? "sveil sveil-fin" : "sveil"} />

      <div className="scontent">
        {/* FASE 1: cruz + título + texto + cuenta regresiva.
            En Fase 2 todos estos elementos se ocultan por completo. */}
        {fase === 1 && (
          <>
            <div className="semb">
              <Ic.Cross s={40} />
            </div>
            <h1 className="stitle">{d.titulo}</h1>
            <div className="sdiv" />
            <p className="stext">{d.texto}</p>
            <p className="fin-count">Faltan {timeLeft} segundos…</p>
          </>
        )}

        {/* FASE 2: tarjeta de feedback. */}
        {fase === 2 && (
                    <div className="feedback-card">
            {/* Pregunta general: visible SOLO antes de elegir una estrella.
                Al seleccionar una valoración desaparece y deja paso a la
                pregunta correspondiente a esa puntuación. */}
            {rating === 0 && !submitted && (
              <p className="feedback-instruccion">
                ¿Qué te pareció el recorrido? Toca una estrella para calificar.
              </p>
            )}

            {/* Estrellas interactuables. */}
            <div
              className="fin-stars"
              role="radiogroup"
              aria-label="Califica esta experiencia"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= (hover || rating);
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
                    className={"fin-star-btn" + (active ? " on" : "")}
                    onMouseEnter={() => setHover(n)}
                    onFocus={() => setHover(n)}
                    onBlur={() => setHover(0)}
                    onClick={() => setRating(n)}
                  >
                    <Ic.Star s={32} />
                  </button>
                );
              })}
            </div>

            {/* Formulario opcional: solo con puntuación elegida y sin enviar. */}
            {rating > 0 && !submitted && (
              <div className="feedback-form">
                <label className="feedback-label" htmlFor="fin-comment">
                  {rating === 5
                    ? "¿Qué fue lo que más te gustó del recorrido?"
                    : "¿En qué podemos mejorar?"}
                </label>
                <textarea
                  id="fin-comment"
                                    className="feedback-ta"
                  rows={3}
                  maxLength={500}
                  placeholder="Escribe aquí tu opinión… cuéntanos qué te gustó o qué podríamos mejorar."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="button"
                  className="btn gold sm"
                  onClick={handleSendComment}
                >
                  Enviar opinión
                </button>
              </div>
            )}

            {/* Agradecimiento tras enviar. */}
            {submitted && (
              <p className="fin-thanks">¡Muchas gracias por tu valoración!</p>
            )}
          </div>
        )}

        {/* Botón de salida: al final, FUERA de la tarjeta de feedback. */}
        {fase === 2 && (
          <button onClick={onHome} className="btn gold big">
            Volver al inicio
          </button>
        )}
      </div>
    </div>
  );
}
