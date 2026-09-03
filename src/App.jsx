

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
    // SOLUCIÓN BLOB (ver informe REPORTE_BUG_AUDIO_SEEK.md): el servidor
    // (Cloudflare assets/Worker) NO responde HTTP Range/206 correctamente; sirve
    // el MP3 completo en 200 ignorando el header `Range`. Eso hace que en
    // Chrome/Android el `<audio>` no pueda armar `seekable` cuando intenta
    // posicionarse a mitad de un stream → vuelve a 0 al hacer seek.
    // Para resolverlo definitivamente REPRODUCIMOS DESDE UN BLOB COMPLETO:
    // se descarga el .mp3 entero y se asigna `URL.createObjectURL(blob)` al
    // src del <audio>; así el archivo queda íntegro en memoria y `seekable`
    // siempre es [0..duración total], con el seek fiable sin depender del server.
    const blobUrlRef = useRef(new Map());   // src -> objectURL (cache)
    const blobFetchRef = useRef(new Map()); // src -> Promise<objectURL> (en curso)
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

        /* ---------- motor de audio (solución BLOB) ---------- */

    // Cabecera del pasaje de la caché: mantiene a lo sumo N objectURLs en
    // memoria (avanza en orden FIFO). Cada objectURL corresponde a un .mp3
    // ya descargado COMPLETO, por lo que el <audio> siempre tendrá un
    // `seekable = [0..duración]` (el seek nunca vuelve a 0 en el camino).
    const BLOB_CACHE_MAX = 8;
    const getBlobSource = useCallback(async (url) => {
      if (!url) return undefined;
      // Devuelve al instante (o el promise en curso) si ya existe.
      const existente = blobUrlRef.current.get(url);
      if (existente) return existente;
      const enCurso = blobFetchRef.current.get(url);
      if (enCurso) return enCurso;
      const prom = (async () => {
        const r = await fetch(url);
        if (!r.ok) throw new Error("HTTP " + r.status + " al descargar " + url);
        const blob = await r.blob();
        const objUrl = URL.createObjectURL(blob);
        blobUrlRef.current.set(url, objUrl);
        // Limita la memoria: si hay más de BLOB_CACHE_MAX audios cacheados,
        // revoca los objectURLs más antiguos (los primeros del Map → FIFO).
        while (blobUrlRef.current.size > BLOB_CACHE_MAX) {
          const it = blobUrlRef.current.keys().next();
          if (it.done) break;
          const old = it.value;
          const oldUrl = blobUrlRef.current.get(old);
          blobUrlRef.current.delete(old);
          try { URL.revokeObjectURL(oldUrl); } catch (_) {}
        }
        return objUrl;
      })();
      blobFetchRef.current.set(url, prom);
      try {
        return await prom;
      } finally {
        blobFetchRef.current.delete(url);
      }
    }, []);

    // Descarga en paralelo (precarga) un audio a la caché de blobs SIN
    // reproducirlo. Lo usa el motor para tener listo el paso actual/siguiente
    // y que el play no espere a la descarga (no se nota el "costo" del blob).
    const prefetchBlob = useCallback((url) => {
      if (!url) return;
      if (blobUrlRef.current.has(url) || blobFetchRef.current.has(url)) return;
      getBlobSource(url).catch((e) => console.error("prefetch blob falló:", e));
    }, [getBlobSource]);

    // Asigna la URL (desde blob si ya está local, si no descarga completa) y
    // dispara play() tan pronto el src está listo. Conserva el autoplay: el
    // primer play del recorrido parte siempre de un gesto ya realizado.
    const playResolvedSrc = useCallback(async (a, url, autoplay, onBlocked) => {
      let src = url; // por defecto streaming (si falla el blob, no romper reproducción)
      try {
        // Obtiene la URL blob: si está en caché devuelve al instante. Si aún no
        // está descargado, espera SIN bloquear la pantalla (se muestra "cargando"
        // según la fuente). Preferimos esperar el blob para garantizar el seek.
        src = await getBlobSource(url);
      } catch (e) {
        src = url; // fallback a streaming directo
        console.error("Blob falló, usando streaming:", e);
      }
      // "src" es la URL efectiva (blob: o url). Asigna y reproduce.
      if (a.getAttribute("src") !== src) {
        a.dataset.retry = "0";
        durRef.current = 0;
        a.src = src;
        a.load();
      }
      if (autoplay) {
        unlockAudio();
        const p = a.play();
        if (p && p.catch) p.catch((err) => { if (onBlocked) onBlocked(err); });
      }
      return src;
    }, [getBlobSource]);

    const loadAudio = useCallback(async (src, autoplay = false) => {
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
      await playResolvedSrc(a, src, autoplay, () => toast("Toca ▶ para reproducir"));
    }, [playResolvedSrc, toast]);

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
                  /* Precargan (al fondo, sin reproducir) los siguientes pasos del camino
     activo después de cada url reproducida, para que al hacer la transición
     el siguiente audio ya esté descargado como Blob y no haya espera
     perceptible (el "costo" de la descarga completa queda absorbido antes). */
  const prefetchNeighbors = useCallback((fromUrl) => {
    const cam = getPath(activePathRef.current) || [];
    // localiza el índice de fromUrl en el camino actual
    const segIdx = cam.findIndex((s) => s.audioUrl === fromUrl);
    if (segIdx < 0) return;
    const N = 3; // cuántos pasos adelante traemos por adelantado
    for (let i = 1; i <= N; i++) {
      const seg = cam[segIdx + i];
      if (!seg) break;
      if (seg.audioUrl) prefetchBlob(seg.audioUrl);
    }
  }, [getPath, prefetchBlob]);

  /* Reproduce un URL en el elemento de audio. La clave para el autoplay es
     llamar a play() de forma SÍNCRONA, dentro del gesto de usuario (clic).
     Si la fuente es nueva, se asigna y carga, y play() se lanza justo
     después: el navegador permite que la promesa de play() se resuelva
     cuando el archivo termine de cargar. */
                const playUrl = useCallback(async (url) => {
    const a = audioRef.current;
    if (!a || !url) return;
    // Cancela la auto-corrección del seek (si había checks pendientes) para
    // que no toque el nuevo audio al cambiar de paso.
    if (typeof a.__seekCleanup === "function") { a.__seekCleanup(); a.__seekCleanup = null; }
    await playResolvedSrc(a, url, true, (err) => console.error("Error Audio (autoplay bloqueado):", err, url));
    // Dado que el paso empieza, precarga el/los siguientes para que la
    // transición no tenga que esperar la descarga completa (busco dos veces
    // BLOB_CACHE_MAX esp. para pasos consecutivos).
    prefetchNeighbors(url);
  }, [playResolvedSrc, prefetchNeighbors]);

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

  /* Pre-carga la bienvenida (Blob) desde la pantalla de inicio, para que al
     pulsar "Iniciar" el audio ya esté descargado y no haya espera perceptible
     (el primer play arranca sin el "costo" de la descarga completa). */
  useEffect(() => {
    if (!ready) return;
    if (route === "welcome" && cfg.bienvenida.introAudioUrl) {
      prefetchBlob(cfg.bienvenida.introAudioUrl);
    }
  }, [ready, route, cfg.bienvenida.introAudioUrl, prefetchBlob]);

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
    // Preacarga inmediata del inicio del camino (aprovechando los 2 s del
    // fundido) para que al sonar el paso la descarga Blob ya esté lista.
    caminoElegido.slice(0, 4).forEach((s) => { if (s.audioUrl) prefetchBlob(s.audioUrl); });
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
                const errCode = a.error && a.error.code;
                // Solo registramos en consola; ya NO hay reintento .mp3 → .MP3.
                // Todos los audios se sirven como .mp3 (minúsculas); ese
                // reintento ciego provocaba 404 falsos y reinicios (emptied).
                // (En una app de producción todavía el error se silencia.)
                if (errCode) console.error("Audio error code", errCode);
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
