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

const LS_KEY = "ccn-v3";

export default function App() {
  const [route, setRoute] = useState("config"); // config | welcome | select | path | fin
  const [cfg, setCfg] = useState(buildDefaults);
  const [ready, setReady] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const [pathIdx, setPathIdx] = useState(0);
  const toastTimer = useRef(null);

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

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
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved) {
            merged.bienvenida = { ...merged.bienvenida, ...saved.bienvenida };
            merged.voces = {
              ...merged.voces,
              angel: { ...merged.voces.angel, ...saved.voces?.angel },
              maria: { ...merged.voces.maria, ...saved.voces?.maria },
            };
            if (saved.opciones)
              merged.opciones = merged.opciones.map((o, i) => (saved.opciones[i] ? { ...o, ...saved.opciones[i] } : o));
            if (saved.camino && saved.camino.length)
              merged.camino = saved.camino.map((s) => buildDefaults().camino.find((d) => d.uid === s.uid) || s);
            if (saved.countdown) merged.countdown = saved.countdown;
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

  /* QR real: #visita */
  useEffect(() => {
    if (ready && window.location.hash === "#visita") setRoute("welcome");
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
      return;
    }
    if (a.getAttribute("src") !== src) {
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
    if (!a || !dur) return;
    a.currentTime = ratio * dur;
    setCur(a.currentTime);
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

  /* Preload intro en welcome / auto en select */
  useEffect(() => {
    if (!ready) return;
    if (route === "welcome") {
      setIntroDone(false);
      if (cfg.bienvenida.introAudioUrl) loadAudio(cfg.bienvenida.introAudioUrl, false);
    }
    if (route === "select") {
      if (cfg.bienvenida.introAudioUrl && !introDone) loadAudio(cfg.bienvenida.introAudioUrl, true);
      else setIntroDone(true);
    }
  }, [route, ready]); // eslint-disable-line

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
    // El primer paso se reproduce AQUÍ, dentro del gesto de usuario (clic),
    // para garantizar que el navegador no bloquee el autoplay.
    playIsFromGestureRef.current = true;
    const first = cfg.camino[0];
    console.log("Ruta a reproducir:", first?.audioUrl);
    if (first && first.audioUrl) playUrl(first.audioUrl);
    else stopAudio();
    setPathIdx(0);
    setRoute("path");
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
        { uid: "s" + Date.now().toString(36), voz: "angel", tipo: "subtitulo", audio: false, audioUrl: null, audioName: "", dur: 0, texto: "", imagen: null, caption: "" },
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
        onLoadedMetadata={(e) => setDur(e.target.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
        onTimeUpdate={(e) => setCur(e.target.currentTime)}
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

      {route === "welcome" && ready && <WelcomeScreen cfg={cfg} onStart={iniciarVisita} />}

      {route === "select" && ready && (
        <SelectScreen cfg={cfg} eng={eng} introDone={introDone} onSkip={skipIntro} onSelect={onSelect} />
      )}

      {route === "path" && ready && <PathScreen cfg={cfg} idx={pathIdx} onExit={exitPath} onNext={nextStep} eng={eng} />}

      {route === "fin" && ready && <FinScreen onHome={goHome} />}

      <Watermark dark={route === "welcome" || route === "fin"} />
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
