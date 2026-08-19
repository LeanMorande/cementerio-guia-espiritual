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

  /* Timer del gap silencioso entre pasos (para limpiarlo al navegar). */
  const gapTimerRef = useRef(null);

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
    a.currentTime = Math.max(0, a.currentTime - 10);
    setCur(a.currentTime);
  }, []);

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
    try { a.currentTime = targetTime; } catch (_) {}
    setCur(targetTime);
  }, [dur]);

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
        a.pause();
    setCur(0);
    setPlaying(false);
    a.removeAttribute("src");
    a.load();
    setDur(0);
    durRef.current = 0;
  }, []);

  const handleEnded = () => {
    setPlaying(false);
    const r = routeRef.current;
    if (r === "select") {
      setIntroDone(true);
      return;
    }
    if (r === "path") {
      const segs = cfgRef.current.camino;
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
    const seg = cfg.camino[pathIdx];
    if (seg && seg.audioUrl) playUrl(seg.audioUrl);
    else stopAudio();
  }, [route, pathIdx]); // eslint-disable-line

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
    const first = cfg.camino[0];
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
    if (pathIdx < cfg.camino.length - 1) {
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
        preload="auto"
        onLoadedMetadata={(e) => {
          const d = e.target.duration || 0;
          durRef.current = isFinite(d) && d > 0 ? d : durRef.current;
          setDur(d);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
        onTimeUpdate={(e) => setCur(e.target.currentTime)}
        onError={(e) => {
          const a = e.currentTarget;
          // Si aún no se reintentó y la extensión es .mp3, prueba con .MP3
          // (algunos programas exportan la extensión en mayúsculas).
          if (a.dataset.retry !== "1") {
            const cur = a.getAttribute("src");
            if (cur && cur.toLowerCase().endsWith(".mp3") && /\.mp3$/i.test(cur) && !/\.MP3$/.test(cur)) {
              a.dataset.retry = "1";
              a.src = cur.replace(/\.mp3$/i, ".MP3");
              a.load();
              const p = a.play();
              if (p && p.catch) p.catch(() => {});
            }
          }
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

      {route === "path" && ready && (
        <PathScreen cfg={cfg} idx={pathIdx} onExit={exitPath} onNext={nextStep} onPrev={prevStep} eng={eng} admin={admin} />
      )}

      {route === "fin" && ready && <FinScreen onHome={goHome} />}

      {(route === "welcome" || route === "fin") && <Watermark dark />}
      {transition && (
        <div className={"veil2 " + transition.tipo}>
          <div className="veil2-inner">
            <div className="veil2-cross">
              <Ic.Cross s={34} />
            </div>
            {transition.titulo && <p className="veil2-txt">Comenzando: {transition.titulo}</p>}
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
