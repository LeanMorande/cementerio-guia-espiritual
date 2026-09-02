/* =====================================================================
   APP / App.jsx — orquestador principal.
   =====================================================================
   Refactorizado: sin IndexedDB, rutas /sounds/, defaults incrustados.
   ===================================================================== */
import { useState, useEffect, useRef, useCallback } from "react";
import { buildDefaults } from "./config/defaults.js";
import { unlockAudio } from "./lib/audio.js";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import SelectScreen from "./components/SelectScreen.jsx";
import PathScreen from "./components/PathScreen.jsx";
import FinScreen from "./components/FinScreen.jsx";
import ConfigScreen from "./components/ConfigScreen.jsx";
import Watermark from "./components/Watermark.jsx";
import { Ic } from "./components/icons.jsx";
import { CSS } from "./styles/css.js";

const LS_KEY = "ccn-v6";

export default function App() {
  const [route, setRoute] = useState("welcome"); // welcome | config | select | path | fin
  const [cfg, setCfg] = useState(buildDefaults);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
    const [introDone, setIntroDone] = useState(false);
  const [pathIdx, setPathIdx] = useState(0);
  const [transition, setTransition] = useState(null); // {tipo:"select", id, titulo}
  const toastTimer = useRef(null);

    const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
    // Ref con la última duración real conocida del elemento de audio, para que
  // el seek sea fiable incluso si el estado `dur` aún no se propagó.
  const durRef = useRef(0);
  // Ref para el Screen Wake Lock (evita que la pantalla se apague durante la
  // visita). Se libera al navegar a pantallas distintas del recorrido.
  const wakeRef = useRef(null);

  const routeRef = useRef(route);
  routeRef.current = route;
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;
    const pathIdxRef = useRef(pathIdx);
  pathIdxRef.current = pathIdx;
  /* El camino activo (array de pasos) según la opción elegida. */
    const activePathRef = useRef("maria");

  /* Timer del gap silencioso entre pasos (para limpiarlo al navegar). */
  const gapTimerRef = useRef(null);

  /* Devuelve el array de pasos del camino según el id de la opción.
     Por defecto (y retrocompatibilidad) usa el camino de María. */
    const getPath = useCallback((id) => {
    const c = cfgRef.current;
    if (id === "padre") return c.caminoPadre || [];
    if (id === "jesus") return c.caminoJesus || [];
    return c.camino || [];
  }, []);

  /* Marca cuando el paso 1 fue iniciado por un gesto de usuario (clic),
     para no reproducirlo dos veces (gesto + efecto). */
  const playIsFromGestureRef = useRef(false);

    const toast = useCallback((msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  /* Modo administrador: se activa con la tecla 'A' estando en la
     bienvenida (o con el clic en el botón disimulado 'A'). */
  const toggleAdmin = useCallback(() => setAdmin((a) => !a), []);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "a" || e.key === "A") && routeRef.current === "welcome") {
        toggleAdmin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleAdmin]);

  /* Fuentes por CDN */
  useEffect(() => {
    [
      "@fontsource/cormorant-garamond/500.css",
      "@fontsource/cormorant-garamond/600.css",
      "@fontsource/inter/400.css",
      "@fontsource/inter/500.css",
      "@fontsource/inter/600.css",
    ].forEach((h) => {
      const url = "https://cdn.jsdelivr.net/npm/" + h;
      if (document.querySelector('link[href="' + url + '"]')) return;
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = url;
      document.head.appendChild(l);
    });
  }, []);

  /* Carga inicial: defaults incrustados + opcional localStorage (sin blobs) */
  useEffect(() => {
    let alive = true;
        (async () => {
      let merged = buildDefaults();
      // Versión de contenido del desarrollador (en defaults.js). Si cambia,
      // se descarta la copia guardada en localStorage y se muestran los
      // defaults frescos (resuelve que los cambios solo se vean en incógnito).
      const currentVersion = merged.version;
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved) {
                        const savedValid = saved.version === currentVersion;
            if (savedValid) {
              merged.bienvenida = { ...merged.bienvenida, ...saved.bienvenida };
              merged.voces = {
                ...merged.voces,
                angel: { ...merged.voces.angel, ...saved.voces?.angel },
                maria: { ...merged.voces.maria, ...saved.voces?.maria },
              };
              if (saved.opciones)
                merged.opciones = merged.opciones.map((o, i) => (saved.opciones[i] ? { ...o, ...saved.opciones[i] } : o));
              if (saved.camino && saved.camino.length) {
                // El contenido de "camino" se regenera con nuevos `uid` cada vez
                // que el desarrollador modifica los pasos en defaults.js. Solo
                // restauramos los guardados si TODOS sus uid coinciden con los
                // defaults actuales (es decir, si el recorrido no cambió).
                const defaultUids = new Set(buildDefaults().camino.map((d) => d.uid));
                const caminoVálido = saved.camino.every((s) => defaultUids.has(s.uid));
                if (caminoVálido) merged.camino = saved.camino;
                // Si no: se mantienen los 10 pasos nuevos de defaults.js.
              }
              if (saved.countdown) merged.countdown = saved.countdown;
            }
          }
        }
      } catch (e) {
        /* sin storage */
      }
      if (alive) {
        setCfg(merged);
        setReady(true);
      }
    })();
    return () => { alive = false; };
  }, []);

        /* Enrutado por hash:
       - sin hash o con #visita → la bienvenida del recorrido (el QR)
       - con #config            → pantalla de configuración (solo desarrollador)
     Detecta el hash al cargar y también en vivo, si el usuario lo cambia. */
  useEffect(() => {
    if (!ready) return;
    const applyRoute = () =>
      setRoute(window.location.hash === "#config" ? "config" : "welcome");
    applyRoute();
    window.addEventListener("hashchange", applyRoute);
    return () => window.removeEventListener("hashchange", applyRoute);
  }, [ready]);

  const setHash = (on) => {
    try {
      history.replaceState(null, "", on ? "#visita" : window.location.pathname + window.location.search);
    } catch (e) {
      /* file:// */
    }
  };

  /* Persistencia opcional (datos, no blobs) */
  const persistNow = useCallback(() => {
    try {
      const c = cfgRef.current;
      localStorage.setItem(LS_KEY, JSON.stringify(c));
    } catch (e) {
      /* sin storage */
    }
  }, []);
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(persistNow, 400);
    return () => clearTimeout(t);
  }, [cfg, ready, persistNow]);

    /* ---------- motor de audio ---------- */
        const loadAudio = useCallback((src, autoplay = false) => {
          const a = audioRef.current;
          if (!a) return;
          if (typeof a.__seekCleanup === "function") { a.__seekCleanup(); a.__seekCleanup = null; }
          setCur(0);
      setPlaying(false);
      if (!src) {
        a.removeAttribute("src");
        a.load();
        setDur(0);
        durRef.current = 0;
        return;
      }
      if (a.getAttribute("src") !== src) {
        a.dataset.retry = "0";
        durRef.current = 0;
        a.src = src;
        a.load();
      }
      if (autoplay) {
        unlockAudio();
        const p = a.play();
        if (p && p.catch) p.catch(() => toast("Toca ▶ para reproducir"));
      }
    }, [toast]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !a.getAttribute("src")) {
      toast("Agrega una ruta /sounds/ en Configuración (⚙)");
      return;
    }
    if (a.paused) {
      unlockAudio();
      const p = a.play();
      if (p && p.catch) p.catch(() => toast("Toca de nuevo para reproducir"));
    } else a.pause();
  }, [toast]);

    const rewind = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    const target = a.currentTime > 10 ? a.currentTime - 10 : 0;
    if (Math.abs(a.currentTime - target) < 0.05) return;
    applySeek(a, target);
    setCur(target);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

        const seekTo = useCallback((ratio) => {
    const a = audioRef.current;
    if (!a) return;
    // Clamp estricto del ratio a [0, 1] para evitar valores fuera de rango.
    const safeRatio = Math.max(0, Math.min(1, ratio));
    // Usa la duración real del elemento siempre que sea finita y positiva;
    // si el navegador aún no la expone (p. ej. iOS al inicio, donde duration
    // puede ser NaN/Infinity), cae a durRef/estado. Así el target es fiable.
    const realDur =
      a.duration && isFinite(a.duration) && a.duration > 0
        ? a.duration
        : durRef.current > 0
        ? durRef.current
        : dur;
    if (!isFinite(realDur) || realDur <= 0) return;
        const targetTime = safeRatio * realDur;
    // Permite retroceder/adelantar también desde 0 (tap inicial en el inicio).
    if (!isFinite(targetTime) || targetTime < 0) return;
    // Evita asignar si no hubo movimiento real (si el usuario tocó exactamente
    // la posición actual no se fuerza currentTime, previniendo micro-jumps).
    if (Math.abs(a.currentTime - targetTime) < 0.05) {
      setCur(targetTime);
      return;
    }
    applySeek(a, targetTime);
    setCur(targetTime);
  }, [dur]);

        // =====================================================================
        // applySeek — salto de posición.
        //
        // PROBLEMA (repro en Chrome/Android, p. ej. p4/p6/p10_canto): al avanzar
        // con la barra hacia una zona aún SIN DESCARGAR de un MP3 largo que se
        // está transmitiendo (streaming), secuencias que PAUSAN y fuerzan play()
        // hacen que Chrome/Android RECOMIENCE el audio desde 0 y suene desde el
        // principio (el `a.pause()` corta el avance del buffer del stream y luego
        // un `a.play()` imperativo sobre una zona no lista provoca el reset).
        // En desktop no aparece porque el buffer suele estar completo/adelantado.
        //
        // SOLUCIÓN: repetir lo que ya funciona en desktop — SI el audio está
        // sonando, NO pausar: solo se asigna `currentTime` (en vivo, dentro del
        // gesto) y se deja que Chrome/Android haga su propio seek/range; él mismo
        // descarga desde la nueva posición y continúa, sin resetear a 0.
        //     - Si estaba sonando   → setPos(), sin pausar ni forzar play().
        //     - Si estaba en pausa  → setPos() (queda pausado; el usuario toca ▶).
        // Un watchdog suave sólo vuelve a pedir la posición si el navegador se
        // quedó muy por detrás del objetivo (p. ej. porque tardó en descargar la
        // zona); nunca fuerza play() desde ~0, que es lo que lo hacía reproducir
        // de nuevo desde el principio.
        // =====================================================================
  const applySeek = (a, targetTime) => {
        const wasPlaying = !a.paused;
        const setPos = () => {
          try { a.currentTime = targetTime; } catch (_) {}
        };
        // 1) Sólo asigna la nueva posición. NO pausamos si estaba sonando: pausar
        //    un stream largo en Chrome/Android corta la descarga y fuerza play()
        //    desde un punto aún no cargado termina reiniciando a 0. Dejamos que
        //    Chrome haga su propio seek/buffer (igual que en desktop).
        setPos();
        // 2) Watchdog (suave): si unos instantes después el audio quedó muy por
        //    detrás del objetivo (Chrome tardó en traer la zona), volvemos a pedir
        //    la posición. Evitamos forzar play() desde ~0 porque eso es lo que lo
        //    hacía arrancar de nuevo desde el principio.
        const tries = [150, 400, 800, 1400]; // ms entre comprobaciones
        const timerIds = [];
        const maybeFix = () => {
          const now = a.currentTime || 0;
          // Sólo re-pedimos si seguimos muy por detrás del objetivo.
          if (now < targetTime - 2) {
            setPos();
            // Si quedó pausado por el buffer pero la idea era reproducir y YA no
            // está en ~0 (no se reseteó al inicio), reanudamos de forma suave.
            if (wasPlaying && a.paused && now >= 0.5) {
              try { a.play(); } catch (_) {}
            }
          }
        };
        tries.forEach((ms) => timerIds.push(window.setTimeout(maybeFix, ms)));
        // Expone una limpieza por si se sale del paso antes de que terminen los
        // checks (evita tocar audio de otro paso) o si se hace otro seek encima.
        a.__seekCleanup = () => timerIds.forEach((id) => clearTimeout(id));
  };

  /* Delay (ms) entre la concatenación de voces para que no parezca tan rápido. */
  const GAP_MS = 4000;

  /* Reproduce un URL en el elemento de audio. La clave para el autoplay es
     llamar a play() de forma SÍNCRONA, dentro del gesto de usuario (clic).
     Si la fuente es nueva, se asigna y carga, y play() se lanza justo
     después: el navegador permite que la promesa de play() se resuelva
     cuando el archivo termine de cargar. */
        const playUrl = useCallback((url) => {
    const a = audioRef.current;
    if (!a || !url) return;
    // Cancela la auto-corrección del seek (si había checks pendientes) para
    // que no toque el nuevo audio al cambiar de paso.
    if (typeof a.__seekCleanup === "function") { a.__seekCleanup(); a.__seekCleanup = null; }
    unlockAudio();
    if (a.getAttribute("src") !== url) {
      a.dataset.retry = "0";
      a.src = url;
      a.load();
    }
    const p = a.play();
    if (p && p.catch) p.catch((err) => console.error("Error Audio:", err, url));
  }, []);

  /* Detiene el audio y resetea posiciones. */
    const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (typeof a.__seekCleanup === "function") { a.__seekCleanup(); a.__seekCleanup = null; }
        a.pause();
    setCur(0);
    setPlaying(false);
    a.removeAttribute("src");
    a.load();
    setDur(0);
    durRef.current = 0;
  }, []);

    /* DEBUG TEMPORAL — instrumentación de audio (ver logs con eruda en el
     celular). No altera la lógica de reproducción/seek; solo registra los
     eventos de red/buffer/seek del <audio> para diagnosticar el reinicio a 0
     en Chrome/Android. Quitar junto con la consola eruda de index.html. */
  const __lastEv = { t: 0 };
  const logAudio = (evt, e) => {
    const a = e && (e.currentTarget || e.target);
    if (!a) return;
    const now = performance.now();
    const dt = (now - __lastEv.t).toFixed(0);
    __lastEv.t = now;
    const sk =
      a.seekable && a.seekable.length
        ? "seek=[" + a.seekable.start(0).toFixed(1) + "-" + a.seekable.end(0).toFixed(1) + "]"
        : "seek=[]";
    console.log(
      "[audio] ct=" + a.currentTime.toFixed(2),
      "dur=" + (isFinite(a.duration) ? a.duration.toFixed(1) : "NaN"),
      evt,
      "rdy=" + a.readyState,
      "net=" + a.networkState,
      sk,
      "+" + dt + "ms"
    );
  };

  const handleEnded = () => {
    setPlaying(false);
    const r = routeRef.current;
    if (r === "select") {
      setIntroDone(true);
      return;
    }
        if (r === "path") {
      const segs = getPath(activePathRef.current);
      const i = pathIdxRef.current;
      const next = segs[i + 1];
      if (next) {
        // Espera el gap silencioso y luego avanza de paso (el efecto
        // de route/pathIdx reproducirá el audio del siguiente paso).
        const tid = window.setTimeout(() => {
          const curRoute = routeRef.current;
          const curIdx = pathIdxRef.current;
          // Solo avanza si seguimos en el mismo punto del camino.
          if (curRoute === "path" && curIdx === i) {
            setPathIdx(i + 1);
          }
        }, GAP_MS);
        // Guardamos el timeout para poder limpiarlo si el usuario navega.
        gapTimerRef.current = tid;
      } else {
        window.setTimeout(() => {
          if (routeRef.current === "path") {
            stopAudio();
            setRoute("fin");
          }
        }, GAP_MS);
      }
    }
  };

  /* Limpia el timer del gap si el componente se desmonta. */
  useEffect(() => () => { if (gapTimerRef.current) clearTimeout(gapTimerRef.current); }, []);

    /* Auto en select (la bienvenida solo se reproduce al entrar al selector,
     nunca antes, para que no suene en la pantalla de inicio). */
  useEffect(() => {
    if (!ready) return;
    if (route === "welcome") {
      setIntroDone(false);
    }
    if (route === "select") {
      if (cfg.bienvenida.introAudioUrl && !introDone) loadAudio(cfg.bienvenida.introAudioUrl, true);
      else setIntroDone(true);
    }
  }, [route, ready]); // eslint-disable-line

  /* Screen Wake Lock: mantiene la pantalla encendida mientras se ve el
     recorrido (selector y pasos) para que no se apague a mitad de la visita.
     Se activa al entrar en "select"/"path" y se libera al volver a la
     bienvenida/config/fin. Si el API no está disponible, se ignora. */
  useEffect(() => {
    if (!ready) return;
    const activo = route === "select" || route === "path";
    (async () => {
      try {
        const nav = navigator;
        if (!activo || !nav.wakeLock || !nav.wakeLock.request) return;
        // Si ya tenemos un wake lock activo en este paso, no lo duplicamos.
        if (wakeRef.current) return;
        const sentinel = await nav.wakeLock.request("screen");
        wakeRef.current = sentinel;
        // Si el navegador revoca automáticamente (p. ej. por visibilidad),
        // lo liberamos del ref para poder reintentarlo al volver.
        sentinel.addEventListener("release", () => { wakeRef.current = null; });
      } catch (e) {
        wakeRef.current = null;
      }
    })();
    return () => {
      // Al cambiar de ruta o desmontar, liberamos el wake lock activo.
      if (wakeRef.current) {
        try { wakeRef.current.release(); } catch (_) {}
        wakeRef.current = null;
      }
    };
  }, [route, ready]);

  const eng = { audioRef, playing, dur, cur, togglePlay, rewind, seekTo, loadAudio };

  /* En reproducciones automáticas (paso 2+ tras el gap) reproducimos desde
     el efecto porque ya hay una cadena de audio activa que el navegador
     permite continuar. El paso 1 se dispara desde el gesto en onSelect. */
  useEffect(() => {
    if (route !== "path") return;
    if (pathIdx === 0 && playIsFromGestureRef.current) {
      playIsFromGestureRef.current = false;
      return;
    }
        const seg = getPath(activePathRef.current)[pathIdx];
    if (seg && seg.audioUrl) playUrl(seg.audioUrl);
    else stopAudio();
  }, [route, pathIdx, getPath]);

  /* ---------- navegación ---------- */
  const iniciarVisita = () => {
    unlockAudio();
    cancelGap();
    setIntroDone(false);
    setPathIdx(0);
    setRoute("select");
  };
  const skipIntro = () => {
    const a = audioRef.current;
    if (a) a.pause();
    setIntroDone(true);
  };
    const cancelGap = () => {
    if (gapTimerRef.current) {
      clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }
    setTransition(null);
  };

        const onSelect = (id, auto) => {
    const o = cfg.opciones.find((x) => x.id === id);
    if (!o) return;
    if (!o.habilitado) {
      toast("«" + o.titulo + "» estará disponible muy pronto");
      return;
    }
        if (auto) toast("Elegimos por ti: " + o.titulo);
    // Programación defensiva: valida que el camino tenga al menos 1 paso
    // antes de intentar entrar; si no, no cambia de pantalla.
    const caminoElegido = getPath(id) || [];
    if (!caminoElegido.length) {
      toast("Este recorrido aún no tiene pasos definidos");
      return;
    }
    cancelGap();
    // Detiene el audio en curso (p. ej. la bienvenida del selector) para que
    // la transición de entrada al camino transcurra en silencio y el paso 1
    // no llegue "encima" del audio anterior (cambio menos brusco).
    stopAudio();
    // Preparamos el paso 1. Hay un silencio de 2 s (transición) antes de
    // que comience el audio: la reproducción se retrasa con un timer. Como
    // el audio ya quedó desbloqueado por el gesto del usuario (la bienvenida
    // y el clic), el navegador permite reproducir unos segundos después.
        playIsFromGestureRef.current = true;
    // Establece el camino activo según la opción elegida.
    activePathRef.current = id;
    const first = caminoElegido[0];
    setPathIdx(0);
    setRoute("path");
    // Transición visual al elegir: fundido con el nombre de la opción.
    setTransition({ tipo: "select", id: o.id, titulo: o.titulo });
    if (first && first.audioUrl) {
      // El audio del paso 1 arranca a los 2 s (silencio de transición).
      const tid = window.setTimeout(() => {
        setTransition(null);
        gapTimerRef.current = null;
        if (routeRef.current === "path" && pathIdxRef.current === 0) {
          playUrl(first.audioUrl);
        }
      }, 2000);
      gapTimerRef.current = tid;
    } else {
      window.setTimeout(() => setTransition(null), 1000);
      stopAudio();
    }
  };
  const exitPath = () => {
    cancelGap();
    stopAudio();
    setRoute("select");
  };
    const nextStep = () => {
    cancelGap();
    if (pathIdx < getPath(activePathRef.current).length - 1) {
      // El efecto de route/pathIdx reproduce el audio del siguiente paso.
      setPathIdx(pathIdx + 1);
    } else {
            stopAudio();
      setRoute("fin");
    }
  };

  /* Retrocede un paso en el camino (lógica inversa de nextStep).
     Cancela el gap/audio en curso y resta 1 a pathIdx mientras sea > 0. */
  const prevStep = () => {
    cancelGap();
    if (pathIdx > 0) setPathIdx(pathIdx - 1);
  };

  /* ---------- setters de config ---------- */
  const setB = (patch) => setCfg((c) => ({ ...c, bienvenida: { ...c.bienvenida, ...patch } }));
  const setOpc = (i, patch) => setCfg((c) => ({ ...c, opciones: c.opciones.map((o, j) => (j === i ? { ...o, ...patch } : o)) }));
  const setSeg = (i, patch) => setCfg((c) => ({ ...c, camino: c.camino.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  const setCountdown = (v) => setCfg((c) => ({ ...c, countdown: v }));
    const addSeg = () =>
    setCfg((c) => ({
      ...c,
      camino: [
        ...c.camino,
        { uid: "s" + Date.now().toString(36), voz: "angel", tipo: "subtitulo", audio: false, audioUrl: null, audioName: "", dur: 0, texto: "", imagen: "", caption: "", accion: "" },
      ],
    }));
  const delSeg = (i) => setCfg((c) => ({ ...c, camino: c.camino.filter((_, j) => j !== i) }));
  const moveSeg = (i, d) =>
    setCfg((c) => {
      const arr = [...c.camino];
      const t = arr[i + d];
      arr[i + d] = arr[i];
      arr[i] = t;
      return { ...c, camino: arr };
    });

  const goConfig = () => {
    setHash(false);
    cancelGap();
    stopAudio();
    setRoute("config");
  };
  const goHome = () => {
    cancelGap();
    stopAudio();
    setIntroDone(false);
    setRoute("welcome");
  };
  const simulateQR = () => {
    cancelGap();
    stopAudio();
    setIntroDone(false);
    setHash(true);
    setRoute("welcome");
  };

  return (
    <div className="shell">
      <style>{CSS}</style>

                        <audio
              ref={audioRef}
              preload="metadata"
              onLoadedMetadata={(e) => {
                logAudio("loadedmetadata", e);
                const d = e.target.duration || 0;
                durRef.current = isFinite(d) && d > 0 ? d : durRef.current;
                setDur(d);
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={handleEnded}
              onTimeUpdate={(e) => setCur(e.target.currentTime)}
              /* ---- DEBUG TEMPORAL de audio (ver por eruda). Quitar después ---- */
                            onSeeking={(e) => logAudio("seeking", e)}
              onSeeked={(e) => logAudio("seeked", e)}
              onWaiting={(e) => logAudio("waiting", e)}
              onStalled={(e) => logAudio("stalled", e)}
              onEmptied={(e) => logAudio("emptied", e)}
              onAbort={(e) => logAudio("abort", e)}
              onPlaying={(e) => logAudio("playing", e)}
              onLoadedData={(e) => logAudio("loadeddata", e)}
              onCanPlay={(e) => logAudio("canplay", e)}
              /* ---- fin DEBUG TEMPORAL ---- */
              /* Nota: ya NO se reintenta .mp3 → .MP3 dentro del manejo de
                 error. Todos los audios se sirven como .mp3 (minúsculas);
                 ese reintento ciego provocaba 404 falsos y reinicios (emptied)
                 en Chrome/Android. Solo se registra el error de forma
                 diagnóstica. */
              onError={(e) => {
                const a = e.currentTarget;
                logAudio("error code=" + (a.error && a.error.code), e);
              }}
            />

      {route === "config" && ready && (
        <ConfigScreen
          cfg={cfg}
          setB={setB}
          setOpc={setOpc}
          setSeg={setSeg}
          setCountdown={setCountdown}
          addSeg={addSeg}
          delSeg={delSeg}
          moveSeg={moveSeg}
          onSave={persistNow}
          onSimulateQR={simulateQR}
          toast={toast}
        />
      )}

      {route === "welcome" && ready && (
        <WelcomeScreen cfg={cfg} onStart={iniciarVisita} admin={admin} onToggleAdmin={toggleAdmin} />
      )}

      {route === "select" && ready && (
        <SelectScreen cfg={cfg} eng={eng} introDone={introDone} onSkip={skipIntro} onSelect={onSelect} />
      )}

                        {route === "path" && ready && (getPath(activePathRef.current) || []).length > 0 && (
        <PathScreen
          camino={getPath(activePathRef.current)}
          voces={cfg.voces}
          idx={pathIdx}
          onExit={exitPath}
          onNext={nextStep}
          onPrev={prevStep}
          eng={eng}
          admin={admin}
        />
      )}

      {route === "fin" && ready && <FinScreen onHome={goHome} />}

      {(route === "welcome" || route === "fin") && <Watermark dark />}
            {transition && (
        <div className={"veil2 " + transition.tipo}>
          <div className="veil2-cross">
            <Ic.Cross s={34} />
          </div>
          <div className="veil2-inner">
                        {transition.titulo && (
                          <p className="veil2-txt">
                            <span className="veil2-l1">Comenzando:</span>
                            <span className="veil2-l2">El camino de la</span>
                            <span className="veil2-l3">{transition.id === "padre" ? "Piedad del Padre" : transition.id === "jesus" ? "Redención de Jesús" : "Virgen María"}</span>
                          </p>
                        )}
          </div>
        </div>
      )}
      {toastMsg && <div className="toast" key={toastMsg}>{toastMsg}</div>}
      {!ready && (
        <div className="boot">
          <div className="boot-cross">
            <Ic.Cross s={34} />
          </div>
          <p>Preparando el recorrido…</p>
        </div>
      )}
    </div>
  );
}
