/* =====================================================================
   COMPONENTS / IntroFx.jsx — efecto cinematográfico de inicio de visita.
   Se implementa como HOOK (useIntroFx) que corre una secuencia de fases.
   Las fases se aplican como clases al WelcomeScreen (wfx-<fase>) para que
   el efecto ocurra SOBRE el fondo real (no salta a otra imagen).

   Fases nombradas (nomenclatura para depurar cada parte por separado):
     [F1-PICK]   2000 ms  reacción al toque del botón (igual al "picking")
     [F2-REVEAL] 2000 ms  el fondo pasa de difuminado a nítido (100%)
     [F3-ZOOM]   2000 ms  la imagen se agranda 40% centrada (sensación de entrar)
     [F4-FLASH]  1000 ms  "implosión" de luz blanca que da paso al selector
   Total: 7000 ms. Al terminar llama onDone().
   ===================================================================== */
import { useEffect, useRef, useState } from "react";

// Duraciones por fase (ms). Ajustá aquí para afinar los tiempos.
export const INTRO_FX = {
  PICK: 1000, // F1-PICK
  REVEAL: 2000, // F2-REVEAL
  ZOOM: 2000, // F3-ZOOM
  FLASH: 1000, // F4-FLASH
};

// Fases en orden, con su duración.
const SEQUENCE = [
  ["PICK", INTRO_FX.PICK],
  ["REVEAL", INTRO_FX.REVEAL],
  ["ZOOM", INTRO_FX.ZOOM],
  ["FLASH", INTRO_FX.FLASH],
];

/**
 * Hook que ejecuta la secuencia del efecto de inicio.
 * @param {boolean} running  cuando pasa a true, arranca la secuencia
 * @param {Function} onDone  se llama al terminar toda la secuencia
 * @returns {string} phase   fase actual ("PICK" | "REVEAL" | "ZOOM" | "FLASH" | "")
 */
export function useIntroFx(running, onDone) {
  const [phase, setPhase] = useState("");
  const timers = useRef([]);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!running) {
      setPhase("");
      return;
    }
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPhase(SEQUENCE[0][0]);
    let acc = 0;
    SEQUENCE.forEach(([name, dur], i) => {
      acc += dur;
      const isLast = i === SEQUENCE.length - 1;
      void name;
      timers.current.push(
        window.setTimeout(() => {
          if (isLast) {
            doneRef.current && doneRef.current();
          } else {
            setPhase(SEQUENCE[i + 1][0]);
          }
        }, acc)
      );
    });
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [running]);

  return phase;
}

/** Capa de luz blanca de la fase final (F4-FLASH). */
export function IntroFlash({ phase }) {
  if (phase !== "FLASH") return null;
  return <div className="introfx-flashover" aria-hidden="true" />;
}