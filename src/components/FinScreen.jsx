/* =====================================================================
   COMPONENTS / FinScreen.jsx — cierre del recorrido en 2 fases.
   =====================================================================
   FASE 1 (0 → 15 s): cruz + título + texto de paz + cuenta regresiva,
                       sobre fondo oscuro difuminado (.sbg).
                           FASE 2: evaluación integrada directamente sobre el fondo oscuro
           (sin tarjeta flotante): cruz dorada + título/subtítulo + estrellas
           + confirmación dinámica + botón "Volver al inicio" unificado con
           el estilo de la portada.
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

                        <div className="scontent fin-content">
        {/* FASE 1: todo (cruz + título + texto + conteo) en un ÚNICO contenedor
            vertical centrado y cohesionado, sin vacíos gigantescos.
            En Fase 2 todos estos elementos se ocultan por completo. */}
        {fase === 1 && (
          <div className="fin-paz">
            <div className="semb fin-semb">
              <Ic.Cross s={40} />
            </div>
            <h1 className="stitle">{d.titulo}</h1>
            <div className="sdiv" />
            <p className="stext">{d.texto}</p>
            <p className="fin-count">Faltan {timeLeft} segundos…</p>
          </div>
        )}

        {/* FASE 2: evaluación integrada directamente sobre el fondo oscuro
            (sin tarjeta flotante), con la misma estética de la portada. */}
        {fase === 2 && (
          <div className="fin-eval">
            {/* Cruz dorada + pregunta en el tercio superior, alineadas con la portada. */}
            <header className="fin-eval-head">
              <div className="semb fin-semb">
                <Ic.Cross s={44} />
              </div>
              <h2 className="fin-eval-title">¿Qué te pareció el recorrido?</h2>
              {/* Subtítulo: solo mientras NO hay selección (estado inicial). */}
              {rating === 0 && !submitted && (
                <p className="fin-eval-sub">Toca una estrella para calificar.</p>
              )}
            </header>

            {/* Estrellas interactuables: área táctil amplia + resplandor dorado.
                En estado inicial (sin selección) se aplica el pulso secuencial. */}
            <div
              className={"fin-stars" + (rating === 0 ? " idle" : "")}
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
                    style={{ "--i": n - 1 }}
                    onMouseEnter={() => setHover(n)}
                    onFocus={() => setHover(n)}
                    onBlur={() => setHover(0)}
                    onClick={() => setRating(n)}
                  >
                    <Ic.Star s={54} />
                  </button>
                );
              })}
            </div>

            {/* Confirmación dinámica de la selección. */}
            {rating > 0 && !submitted && (
              <div className="fin-confirm" role="status" aria-live="polite">
                <p className="fin-confirm-main">
                  Has seleccionado {rating} {rating === 1 ? "estrella" : "estrellas"}
                </p>
                <p className="fin-confirm-sub">
                  (Si deseas cambiar tu nota, solo toca otra estrella)
                </p>
              </div>
            )}

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
                                {/* Acción principal del formulario: dorado relleno de alto
                    contraste con texto carbón, distinto del botón de salida. */}
                <button
                  type="button"
                  className="btn gold-send"
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

            {/* Botón de salida unificado con el estilo de la portada,
                empujado al pie con margen superior amplio. */}
            <button onClick={onHome} className="btn gold big start fin-home">
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
