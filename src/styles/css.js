



/* =====================================================================
   STYLES / css.js — estilos globales (plantilla string inyectada).
   ===================================================================== */
export const CSS = `
:root{
  --bg:#e7e5df; --ink:#201f1c; --ink-soft:#54524a;
  --gold:#96691f; --gold2:#b8913f; --gold-ink:#6b4e1a; --gold-faint:#e9dfc8;
  --silver:#8c8a80; --line:#d4d0c6; --white:#fffefb;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
button{font-family:inherit;color:inherit}
img{display:block}
.shell{position:relative;max-width:560px;height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden;background:linear-gradient(180deg,#f2f1ec,#e9e7e1);box-shadow:0 0 0 1px #d8d5cc,0 20px 60px -30px rgba(50,40,20,.35)}
.num{font-variant-numeric:tabular-nums}
:focus-visible{outline:2px solid var(--gold);outline-offset:2px;border-radius:6px}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeAppear{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.07)}}
@keyframes ring{0%{box-shadow:0 0 0 0 rgba(169,127,47,.35)}70%{box-shadow:0 0 0 16px rgba(169,127,47,0)}100%{box-shadow:0 0 0 0 rgba(169,127,47,0)}}
@keyframes emb{0%,100%{filter:drop-shadow(0 0 6px rgba(201,169,97,.3))}50%{filter:drop-shadow(0 0 20px rgba(201,169,97,.6))}}
@keyframes toastIn{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes bootp{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
@keyframes avatarDrift{0%{transform:scale(1.08) translate(-1.6%,.8%)}100%{transform:scale(1.16) translate(1.6%,-1%)}}
@keyframes avatarGlow{0%,100%{box-shadow:0 0 0 0 rgba(201,169,97,.28)}50%{box-shadow:0 0 0 9px rgba(201,169,97,.1)}}
@keyframes capIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.btn{min-height:48px;padding:0 16px;border-radius:12px;border:1px solid var(--line);background:var(--white);display:inline-flex;align-items:center;justify-content:center;gap:8px;font-size:15px;font-weight:500;cursor:pointer;transition:transform .15s,box-shadow .2s,background .2s}
.btn:active{transform:scale(.97)}
.btn:disabled{opacity:.4;cursor:default}
.btn.ghost{background:transparent}
.btn.ghost:hover:not(:disabled){background:rgba(255,255,255,.7)}
.btn.outline{border-color:var(--gold2);color:var(--gold-ink);background:rgba(255,253,249,.7)}
.btn.outline:hover{background:var(--gold-faint)}
.btn.gold{background:linear-gradient(135deg,#c9a254,#a97f2f);border:none;color:#fff;box-shadow:0 6px 16px -8px rgba(140,100,30,.6)}
.btn.big{min-height:56px;padding:0 28px;font-size:17px;border-radius:14px}
.btn.sm{min-height:40px;padding:0 12px;font-size:13.5px;border-radius:10px}
.iconbtn{width:44px;height:44px;border-radius:12px;border:1px solid transparent;background:transparent;display:flex;align-items:center;justify-content:center;color:var(--ink-soft);cursor:pointer;transition:background .2s;flex-shrink:0}
.iconbtn:hover{background:rgba(255,255,255,.7)}
.iconbtn.sm3{width:38px;height:38px}
.linkbtn{border:none;background:none;color:var(--gold-ink);font-size:13px;text-decoration:underline;cursor:pointer;padding:8px}

.wm{position:absolute;right:10px;bottom:6px;display:flex;align-items:center;gap:5px;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(90,86,76,.55);pointer-events:none;z-index:70;white-space:nowrap}
.wm-dark{color:rgba(240,236,226,.55)}
.toast{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#2a2926;color:#f4efe3;font-size:13.5px;padding:9px 18px;border-radius:99px;z-index:80;animation:toastIn .3s ease;box-shadow:0 8px 24px -10px rgba(0,0,0,.5);max-width:86%;text-align:center}
.veil2{position:absolute;inset:0;background:#141416;display:flex;align-items:center;justify-content:center;z-index:75;animation:fadeIn .35s ease}
.veil2-inner{display:flex;flex-direction:column;align-items:center;text-align:center;color:#f0ece2;gap:10px;padding:0 24px;max-width:360px;animation:fadeUp .6s ease}
/* Cruz: posición superior (~25 %) y centrada en el eje horizontal */
.veil2-cross{position:absolute;top:24%;left:50%;transform:translateX(-50%);width:96px;height:96px;border-radius:50%;border:1px solid rgba(201,169,97,.5);display:flex;align-items:center;justify-content:center;color:var(--gold2);animation:emb 3.4s ease-in-out infinite}
.veil2-cross svg{width:44px;height:44px}
/* Texto centrado de forma absoluta (lo centra el flex de .veil2) */
.veil2-txt{font-family:'Cormorant Garamond',serif;font-size:33px;font-weight:600;line-height:1.25;display:flex;flex-direction:column;align-items:center;gap:4px;text-shadow:0 2px 10px rgba(0,0,0,.55)}
.veil2-txt span{display:block}
.veil2-l1{color:#eee7d6}
.veil2-l2{color:#d6ccb4}
/* Línea 3: efecto metálico dorado (gradiente sutil sobre el texto) */
.veil2-l3{
  background:linear-gradient(180deg,#8a6a25 0%,#c9a254 100%);
  -webkit-background-clip:text;
  background-clip:text;
  -webkit-text-fill-color:transparent;
  color:transparent;
}
.boot{position:absolute;inset:0;background:#f7f6f2;z-index:90;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:var(--ink-soft);font-size:14px}
.boot-cross{color:var(--gold);animation:bootp 1.6s ease-in-out infinite}

/* ---------- pantallas oscuras ---------- */
.splash{position:absolute;inset:0;background:#141416;color:#f0ece2;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:fadeIn .5s ease}
.sbg{position:absolute;inset:-8%;background-size:cover;background-position:center;filter:blur(16px) brightness(.4) saturate(.75);animation:kb 26s ease-in-out infinite alternate}
/* Fondo de la pantalla FINAL (despedida): nítido, fijo y sin ken-burns.
   A diferencia de .sbg, cubre todo el contenedor sin el inset negativo del
   ken-burns, y NO lleva blur ni animación. */
.sbg-fin{position:absolute;inset:0;background-size:cover;background-position:center}
.sveil{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,rgba(20,20,22,.15),rgba(12,12,14,.82) 78%)}
/* Velo de la BIENVENIDA: un poco más oscuro (~75-80%) para resaltar el texto
   y los elementos dorados por encima del fondo. */
.sveil.welcome-veil{background:radial-gradient(ellipse at 50% 42%,rgba(12,12,14,.55),rgba(8,8,10,.85) 80%)}
/* Velo de la pantalla final: un poco más oscuro para asegurar legibilidad
   del texto blanco sobre la foto nítida. */
.sveil-fin{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(14,14,16,.62),rgba(8,8,10,.9) 82%)}
/* ===== Pantalla FINAL en 2 fases (FinScreen) =====
   Fase 1 (meditación, 0→6 s): fondo oscuro difuminado + velo; solo texto + cuenta.
   Fase 2 (tras 6 s): el fondo pasa a nítido (.sbg-fin imagen), velo se aclara un
   poco, aparece la cruz/texto con un fade suave y el footer con feedback + botón.
   La transición suave la dan las propiedades transition de .fin-bg / .fin-veil. */

/* Fondo: arranca como .sbg (blur + ken-burns) y, con .listo, queda nítido y fijo
   (equivalente visual a .sbg-fin): sin blur ni animación. */
.sbg.fin-bg{transition:filter 1.1s ease,transform 1.1s ease,inset 1.1s ease}
.sbg.fin-bg.listo{inset:0;filter:none;animation:none;transform:none}

/* Velo: un poco más oscuro en Fase 1 (foto difuminada) y más legible en Fase 2. */
.sveil.fin-veil{transition:background 1.1s ease}
.sveil.fin-veil.listo{background:radial-gradient(ellipse at 50% 42%,rgba(20,20,22,.28),rgba(10,10,12,.86) 78%)}

/* ===== Fase 1 (despedida): ÚNICO contenedor vertical centrado =====
   Cruz + título + texto + conteo agrupados y cohesionados, con un gap
   equilibrado (1.2rem–1.5rem) para evitar vacíos gigantescos. */
.fin-paz{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.35rem;width:100%;height:100%;min-height:0;text-align:center;animation:fadeUp .7s ease}
/* El divisor dorado no necesita tanto aire dentro del grupo cohesionado. */
.fin-paz .sdiv{margin:.2rem 0}
/* Conteo: +15% de tamaño y Semi-Bold, dentro del grupo centrado. */
.fin-count{margin:0;font-size:17.5px;font-weight:600;letter-spacing:.04em;color:rgba(245,241,232,.9);text-align:center;text-shadow:0px 2px 8px rgba(0,0,0,.95),0px 0px 4px rgba(0,0,0,.8)}
/* Texto descriptivo: +10% de tamaño. */
.fin-paz .stext{font-size:17.6px}

/* ===== Fase 2: evaluación integrada (sin tarjeta flotante) =====
   Todo el contenido se coloca directamente sobre el fondo oscuro del splash,
   con la misma estética de la portada (cruz dorada + jerarquía serif/sans).
   Columna a pantalla completa: header (cruz + pregunta) arriba y, distribuidos
   con un gap amplio, las estrellas al centro y el botón de salida en el tercio
   inferior (alejado de las estrellas, con aire visual en el centro). */
.fin-eval{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:clamp(20px,5vh,40px);width:100%;max-width:440px;height:100%;min-height:0;animation:fadeUp .6s ease both}
/* Header superior (cruz + pregunta alineadas con la portada). */
.fin-eval-head{display:flex;flex-direction:column;align-items:center;flex:0 1 auto;padding-top:max(6px,4vh)}
/* Cruz dorada en el tercio superior, alineada con la portada. */
.fin-semb{margin-bottom:10px}
/* Título: serif, blanco, tamaño destacado (+15%) con sombra oscura permanente. */
.fin-eval-title{font-family:'Cormorant Garamond',serif;font-weight:600;color:#fffefb;font-size:clamp(31px,8.5vw,41.4px);line-height:1.15;text-align:center;text-shadow:0px 2px 8px rgba(0,0,0,.95),0px 0px 4px rgba(0,0,0,.8);margin:0}
/* Subtítulo: dorado suave/crema, sans-serif, legible (+15%) y con sombra oscura. */
.fin-eval-sub{font-family:'Inter',system-ui,sans-serif;font-size:clamp(16.1px,4.14vw,17.8px);font-weight:500;line-height:1.4;letter-spacing:.01em;color:#e6d3a3;text-align:center;text-shadow:0px 2px 8px rgba(0,0,0,.95),0px 0px 4px rgba(0,0,0,.8);margin:6px 0 0}

.feedback-form{display:flex;flex-direction:column;width:100%;gap:14px;margin-top:4px}
/* Pregunta del formulario: +10% y sombra oscura permanente. */
.feedback-label{font-size:15.4px;font-weight:600;letter-spacing:.02em;color:rgba(245,241,232,.96);text-align:center;line-height:1.4;text-shadow:0px 2px 8px rgba(0,0,0,.95),0px 0px 4px rgba(0,0,0,.8)}
.feedback-ta{width:100%;min-height:78px;resize:vertical;border-radius:10px;border:1px solid rgba(201,169,97,.45);background:rgba(20,19,17,.5);color:#f5f1e8;font-family:inherit;font-size:14px;line-height:1.45;padding:10px 12px;outline:none;transition:border-color .2s,box-shadow .2s;box-sizing:border-box}
.feedback-ta::placeholder{color:rgba(245,241,232,.42)}
.feedback-ta:focus{border-color:#d4af37;box-shadow:0 0 0 3px rgba(212,175,55,.18)}

/* ---- Estrellas de calificación (UX para adultos mayores) ----
   Cada estrella ocupa un área táctil mínima de 44px. Las inactivas llevan
   contorno dorado fino con centro semitransparente (no parecen deshabilitadas)
   y al pasar/enfocar se encienden con un resplandor dorado (glow). */
.fin-stars{display:flex;gap:clamp(4px,1.5vw,8px);justify-content:center;align-items:center;flex-wrap:nowrap;margin:2px 0}
/* Pulso secuencial 1→5 mientras no hay selección (simula interactividad en
   móviles sin hover). Cada estrella arranca su ciclo con un retardo --i. */
@keyframes starPulse{
  0%,100%{color:rgba(230,194,90,.18);filter:drop-shadow(0 0 0 rgba(230,194,90,0))}
  35%{color:#e6c25a;filter:drop-shadow(0 0 12px rgba(230,194,90,.95))}
  50%{color:rgba(230,194,90,.35);filter:drop-shadow(0 0 3px rgba(230,194,90,.4))}
}
.fin-stars.idle .fin-star-btn{animation:starPulse 2.5s ease-in-out infinite;animation-delay:calc(var(--i,0) * .18s)}
/* Al tocar/hover en estado idle, el resplandor manual manda sobre el pulso. */
.fin-stars.idle .fin-star-btn:hover,.fin-stars.idle .fin-star-btn:focus-visible{animation:none}
.fin-star-btn{appearance:none;background:transparent;border:0;padding:0;line-height:0;cursor:pointer;border-radius:12px;width:clamp(44px,12vw,56px);height:clamp(44px,12vw,56px);min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;
  /* Estrella inactiva: contorno dorado fino + relleno semitransparente. */
  color:rgba(230,194,90,.18);
  filter:drop-shadow(0 0 0 rgba(230,194,90,0));
  transition:color .2s ease,transform .18s ease,filter .25s ease}
.fin-star-btn svg{display:block;overflow:visible}
/* Estrella inactiva: dibuja el contorno dorado (stroke) sobre el relleno suave. */
.fin-star-btn svg path{fill:currentColor;stroke:#e0c070;stroke-width:1.5;stroke-linejoin:round}
/* Hover / focus: invita al toque con resplandor dorado. */
.fin-star-btn:hover,.fin-star-btn:focus-visible{transform:scale(1.12);color:rgba(230,194,90,.5);filter:drop-shadow(0 0 10px rgba(230,194,90,.85))}
/* Estrella activa: dorado sólido + glow. */
.fin-star-btn.on{color:#e6c25a;filter:drop-shadow(0 0 8px rgba(230,194,90,.75))}
.fin-star-btn.on svg path{fill:currentColor;stroke:#f2d78a;stroke-width:1.2}
.fin-star-btn:active{transform:scale(1.02)}

/* Confirmación dinámica de la selección (+10% y sombra oscura). */
.fin-confirm{display:flex;flex-direction:column;align-items:center;gap:4px;margin-top:4px;animation:fadeIn .35s ease;text-align:center}
.fin-confirm-main{font-family:'Inter',system-ui,sans-serif;font-weight:700;font-size:clamp(16.5px,4.4vw,18.7px);color:#e6c25a;text-shadow:0px 2px 8px rgba(0,0,0,.95),0px 0px 4px rgba(0,0,0,.8);margin:0}
.fin-confirm-sub{font-family:'Inter',system-ui,sans-serif;font-weight:400;font-size:clamp(13.75px,3.74vw,14.85px);color:rgba(245,241,232,.85);text-shadow:0px 2px 8px rgba(0,0,0,.95),0px 0px 4px rgba(0,0,0,.8);margin:0}

/* Botón principal del formulario "Enviar opinión": dorado RELLENO de alto
   contraste (#D4AF37) con texto carbón (#1A1A1A) en Bold, para que se
   identifique como la acción principal del formulario (distinto del botón
   de salida, que es un dorado brillante con texto claro). */
.btn.gold-send{min-height:52px;padding:0 22px;border-radius:12px;border:1px solid #b8912c;background:#D4AF37;color:#1A1A1A;font-weight:700;font-size:16px;letter-spacing:.01em;cursor:pointer;box-shadow:0 8px 18px -10px rgba(0,0,0,.6);transition:background .2s,transform .15s,box-shadow .2s}
.btn.gold-send:hover{background:#e0bd4a;box-shadow:0 10px 22px -10px rgba(0,0,0,.65)}
.btn.gold-send:active{transform:scale(.97)}

/* Botón "Volver al inicio": mismo estilo que el botón de la portada,
   separado notablemente del formulario y empujado al pie de la interfaz
   (evita clics accidentales entre ambos botones). El color del texto
   (#1A1A1A, gris carbón oscuro) es exclusivo de este botón final. */
.btn.start.fin-home{color:#1A1A1A;text-shadow:none;font-weight:700;margin-top:auto;align-self:stretch}
.btn.start.fin-home:hover{transform:scale(1.02)}

.fin-thanks{margin:0;font-size:15.4px;letter-spacing:.3px;color:rgba(245,241,232,.9);text-align:center;text-shadow:0px 2px 8px rgba(0,0,0,.95),0px 0px 4px rgba(0,0,0,.8);animation:fadeIn .4s ease}

/* Desplegable de sugerencia (1–4 estrellas). */

/* Base (compartida por Welcome y Fin). */
.scontent{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:28px;max-width:380px;animation:fadeUp .7s ease;width:100%}
/* Columna a pantalla completa SOLO en la bienvenida: header arriba, botón al
   centro cómodo y ficha de confianza abajo. Reparte el alto con pesos suaves
   para evitar el hueco negro excesivo entre el subtítulo y el botón. */
.scontent.welcome{justify-content:space-between;padding:0;height:100%}
/* Columna a pantalla completa en la pantalla FINAL (despedida y calificación):
   permite distribuir header / centro / pie de cada fase sobre todo el alto. */
.scontent.fin-content{height:100%;max-width:440px;padding:max(20px,5vh) 24px}
/* El header de la bienvenida conserva su padding; en fin usamos clases propias. */
/* ---------- HEADER (cruz + título + subtítulo) ---------- */
.shead{display:flex;flex-direction:column;align-items:center;padding:max(26px,6vh) 28px 0;flex:0 1 auto}
/* Cruz: fondo circular oscuro semitransparente y sombra oscura sutil (sin halo
   brillante), uniforme en portada y pantallas finales. */
.semb{position:relative;width:clamp(90px,24vw,96px);height:clamp(90px,24vw,96px);border-radius:50%;border:1px solid rgba(201,169,97,.5);background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:var(--gold2);margin-bottom:18px}
/* Sombra oscura sutil para despegar la cruz del fondo (sin resplandor). */
.semb svg{filter:drop-shadow(0px 3px 6px rgba(0,0,0,.85))}
/* Título en 3 líneas centradas. nowrap en las líneas para que cada renglón
   quede íntegro ("Cementerio Católico" y "Colonia Crespo" no se parten). */
.stitle{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:clamp(28px,7.8vw,39px);line-height:1.12;display:flex;flex-direction:column;align-items:center;text-wrap:nowrap;text-shadow:0px 2px 5px rgba(0,0,0,.9)}
.stitle-l1,.stitle-l3{display:block;white-space:nowrap;text-shadow:0px 2px 5px rgba(0,0,0,.9)}
/* Línea 2 "de": más pequeña y elegantemente espaciada. */
.stitle-l2{display:block;font-size:.62em;font-style:italic;font-weight:500;letter-spacing:.14em;color:var(--gold2);margin:.06em 0;white-space:nowrap;text-shadow:0px 2px 5px rgba(0,0,0,.9)}
.sdiv{width:56px;height:1px;background:linear-gradient(90deg,transparent,var(--gold2),transparent);margin:16px 0}
.stext{font-size:16px;line-height:1.55;color:rgba(245,241,232,.94);text-shadow:0px 2px 5px rgba(0,0,0,.9)}
/* ---------- CENTRO (botón principal en el centro cómodo de la pantalla) ---------- */
.smid{flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;padding:0 28px;min-height:0}
.scontent .btn.gold{width:100%;margin-top:0}
/* Botón principal: +5% de tamaño (padding/altura ≥52px), fondo dorado bronce
   más oscuro para alto contraste y texto claro Bold, manteniendo sombras suaves. */
.btn.start{font-weight:700;font-size:18px;letter-spacing:.01em;gap:12px;min-height:58px;padding:0 30px;background:linear-gradient(135deg,#9a6f24,#7a5416);color:#fff8ea;text-shadow:0 1px 2px rgba(0,0,0,.45);box-shadow:0 12px 24px -6px rgba(0,0,0,.55),0 6px 12px -4px rgba(90,60,15,.75);animation:goldPulse 2.2s ease-in-out infinite}
.btn.start svg{flex-shrink:0}
@keyframes goldPulse{
  0%,100%{box-shadow:0 12px 24px -6px rgba(0,0,0,.55),0 6px 12px -4px rgba(90,60,15,.75),0 0 0 0 rgba(201,169,97,.6)}
  50%{box-shadow:0 14px 28px -6px rgba(0,0,0,.55),0 8px 16px -4px rgba(90,60,15,.85),0 0 0 18px rgba(201,169,97,0)}
}
/* Aclaración bajo el botón: contraste/brillo subido para legibilidad. */
.stap{font-size:13px;font-weight:500;color:rgba(248,244,236,.86);margin-top:16px;text-shadow:0px 2px 5px rgba(0,0,0,.9)}
/* ---------- FICHA DE CONFIANZA (pie, 2 niveles) ---------- */
/* Nivel A — Badge superior: cápsula sutil con SOLO el escudo + "Aplicación 100%
   Gratuita". Fondo semitransparente, bordes redondeados; no interactivo. */
.trust-badge{display:flex;align-items:center;gap:10px;margin:0 auto;padding:10px 18px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.05);pointer-events:none;box-shadow:0 2px 10px -4px rgba(0,0,0,.4);width:fit-content;max-width:340px}
.trust-icon{flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--gold2)}
.trust-title{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.02em;color:#fff;text-shadow:0px 2px 5px rgba(0,0,0,.9)}
/* Envoltura del pie: badge + nota, en columna centrada. */
.trust-foot{display:flex;flex-direction:column;align-items:center;gap:8px;margin:0 24px max(26px,6vh)}
/* Nivel B — Nota inferior: texto plano secundario, sin cajas ni bordes. */
.trust-note{font-family:'Inter',sans-serif;font-size:13px;font-weight:400;letter-spacing:.01em;line-height:1.4;color:rgba(232,228,219,.72);text-align:center;max-width:340px;text-shadow:0px 2px 5px rgba(0,0,0,.9)}

/* ---------- pantalla clara base ---------- */
.screen{flex:1;display:flex;flex-direction:column;min-height:0;animation:fadeUp .45s ease}
/* El .screen que viene del efecto de selección no hace fade: lo revela el
   overlay blanco, así el avatar y el texto del paso 1 aparecen de inmediato. */
.screen.no-fade{animation:none}

/* ---------- avatar parlante ---------- */
.selhead{display:flex;align-items:center;gap:12px;padding:12px 16px 4px;flex-shrink:0}
.avatar{width:76px;height:76px;border-radius:50%;overflow:hidden;border:2px solid rgba(169,127,47,.45);flex-shrink:0;position:relative;background:#23221d;transition:border-color .4s}
.avatar img{width:100%;height:100%;object-fit:cover;animation:avatarDrift 16s ease-in-out infinite alternate;filter:grayscale(.35) brightness(.88);transition:filter .6s}
.avatar.speaking{border-color:var(--gold2);animation:avatarGlow 2.6s ease-in-out infinite}
.avatar.speaking img{filter:none}
.avatar.speaking::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 20px rgba(201,169,97,.35)}
.avatar.canto{display:flex;align-items:center;justify-content:center}
.cantoic{font-size:30px;color:var(--gold2)}
.avatar-meta{min-width:0}
.avatar-meta b{display:block;font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:var(--ink)}
.avatar-meta i{font-style:normal;font-size:12px;color:#6b4e1a;font-weight:600}

/* ---------- subtítulo en vivo ---------- */
.capwrap{padding:4px 18px 8px;min-height:64px;display:flex;flex-direction:column;align-items:center;gap:2px;flex-shrink:0}
.livecap{font-family:'Cormorant Garamond',serif;font-size:17.5px;line-height:1.45;text-align:center;color:#4a3713;font-weight:600;animation:capIn .5s ease;min-height:48px;display:flex;align-items:center}

/* ---------- selección ---------- */
.sel-top{flex:0 0 30%;min-height:0;display:flex;flex-direction:column;justify-content:center;padding:8px 14px 6px;gap:8px}
.sel-bottom{flex:0 0 70%;min-height:0;display:flex;flex-direction:column;justify-content:center;padding:4px 16px 20px;gap:10px}
.sel-skip{align-self:center;padding:2px 0}
.sel-count{display:flex;align-items:center;justify-content:center;gap:10px}
.choosewrap{flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:0 16px 30px;gap:6px;min-height:0}
.chooserow{display:flex;align-items:center;justify-content:space-between;gap:10px}
.chooserow h2{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600}
.cdnote{font-size:12px;color:#7c7a70;font-weight:500}
.cdring{position:relative;width:34px;height:34px;flex-shrink:0;opacity:.85}
.cdring svg{transform:rotate(-90deg)}
.cdtrack{fill:none;stroke:#dcD9cf;stroke-width:3}
.cdprog{fill:none;stroke:var(--gold2);stroke-width:3;stroke-linecap:round;transition:stroke-dashoffset 1s linear}
.cdring span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--gold-ink);font-weight:600}
.options{display:flex;flex-direction:column;justify-content:space-between;gap:12px;flex:1;min-height:0}
.opt{position:relative;display:block;width:100%;flex:1 1 0;min-height:0;border-radius:18px;overflow:hidden;background:var(--white);cursor:pointer;text-align:left;border:1px solid var(--line);transition:transform .15s,box-shadow .2s}
.opt.enabled{border-color:var(--gold2);box-shadow:0 8px 20px -14px rgba(140,100,30,.5)}
.opt.disabled{opacity:.72}
.opt.picking,.opt.enabled.picking{transform:scale(.985);border-color:var(--gold2);animation:optPulse .55s ease-in-out 2}
.opt.picking .thumb,.opt.enabled.picking .thumb{filter:brightness(1.08)}
@keyframes optPulse{0%,100%{box-shadow:0 0 0 3px var(--gold2),0 12px 22px -12px rgba(20,15,5,.5)}50%{box-shadow:0 0 0 6px rgba(196,150,46,.5),0 12px 22px -12px rgba(20,15,5,.5)}}
.opt:active{transform:scale(.98)}

/* ===== Intro cinematográfico (click en "Iniciar la visita") =====
   Fases sobre el propio welcome (.splash.wfx-<fase>):
     wfx-pick   (2s) botón presionado; el fondo sigue difuminado
     wfx-reveal (2s) el fondo pasa de difuminado a nítido (100%) y el velo desaparece
     wfx-zoom   (2s) la imagen se agranda 40% centrada (sensación de entrar)
     wfx-flash  (1s) implosión de luz blanca que da paso al selector
   Nomenclatura para depurar: F1-PICK, F2-REVEAL, F3-ZOOM, F4-FLASH. */
.splash.wfx-pick .btn.start{animation:none;transform:scale(.96);box-shadow:0 0 0 6px rgba(196,150,46,.5),0 10px 18px -10px rgba(20,15,5,.6);transition:transform .35s ease,box-shadow .35s ease}
/* Imagen de fondo: transiciones base para el efecto (anulan el ken-burns) */
/* Punto de ampliación: centrado en horizontal, más abajo del centro
   (donde está el halo de luz de fondo.avif). Bajá/súbé el "78%" para mover el
   foco del zoom (valores más altos = más abajo). */
.splash.wfx-pick .sbg,.splash.wfx-reveal .sbg,.splash.wfx-zoom .sbg,.splash.wfx-flash .sbg{animation:none;transform-origin:center 78%;will-change:transform,filter}
/* F1-PICK: fondo difuminado, velo visible */
.splash.wfx-pick .sbg{filter:blur(16px) brightness(.5) saturate(.75);transform:scale(1);transition:filter 2s ease,transform 2s ease}
.splash.wfx-pick .sveil{opacity:1;transition:opacity 2s ease}
/* F2-REVEAL: fondo nítido al 100% y velo desaparece */
.splash.wfx-reveal .sbg{filter:blur(0) brightness(1) saturate(1);transform:scale(1);transition:filter 2s ease,transform 2s ease}
.splash.wfx-reveal .sveil{opacity:0;transition:opacity 2s ease}
.splash.wfx-reveal .scontent{opacity:0;transition:opacity .6s ease}
/* F3-ZOOM: la imagen crece 40% centrada */
.splash.wfx-zoom .sbg{filter:blur(0) brightness(1) saturate(1);transform:scale(1.4);transition:transform 2s ease-in-out}
.splash.wfx-zoom .sveil{opacity:0}
.splash.wfx-zoom .scontent{opacity:0}
/* F4-FLASH: la imagen termina de acercar y entra la luz blanca */
.splash.wfx-flash .sbg{filter:blur(0) brightness(1) saturate(1);transform:scale(1.42);transition:transform 1s ease-out}
.splash.wfx-flash .sveil{opacity:0}
.splash.wfx-flash .scontent{opacity:0}
/* Capa de luz blanca (F4-FLASH) montada por IntroFlash */
.introfx-flashover{position:fixed;inset:0;z-index:70;background:#fff;pointer-events:none;animation:implodeFlash 1s ease-in forwards}
@keyframes implodeFlash{0%{opacity:0;transform:scale(1.25)}60%{opacity:.92}100%{opacity:1;transform:scale(1)}}

/* ===== Efecto de inicio de CAMINO (al elegir una tarjeta del selector) =====
   Fases nombradas para depurar: S1-PICK, S2-TEXT, S3-IMAGE, S4-FLASH. */
.selectfx{position:fixed;inset:0;z-index:76;display:flex;align-items:center;justify-content:center;overflow:hidden}
/* S2-TEXT: fondo negro con el texto (reusa .veil2-* ) */
.selectfx.s-text{background:#141416;animation:fadeIn .18s ease}
/* S3-IMAGE: sin fondo negro — lo cubre el fondo sacro (.selectfx-bg) */
.selectfx.s-image{background:transparent;animation:fadeIn .18s ease}
/* Fondo sacro (SobreFondo.webp): cubre toda la fase y sirve de marco dorado.
   z-index 1 queda por debajo de la imagen del camino (.selectfx-img, z-index 2). */
.selectfx-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:1;display:block}
/* S3-IMAGE: el fondo aparece junto con la imagen (mismo fade-in de 1s). */
.selectfx.s-image .selectfx-bg{animation:selectfxImgIn 1s ease both}
/* Imagen del camino/santo: enmarcada dentro del rectángulo dorado del fondo.
   Dimensiones reducidas para que quede contenida en el marco y centrada. */
.selectfx-img{position:relative;z-index:2;max-width:76%;max-height:70%;width:auto;height:auto;object-fit:contain;object-position:center;display:block;border-radius:12px}
/* Entrada de la imagen (solo S3-IMAGE): fade sutil. No incluye escala para que
   al pasar a FLASH no se reinicie ni "salte" de tamaño. */
.selectfx.s-image .selectfx-img{animation:selectfxImgIn 1s ease both}
@keyframes selectfxImgIn{from{opacity:0}to{opacity:1}}
/* S4-FLASH: la luz SALE de la imagen y del fondo. Ambos siguen visibles y se
   aclaran (brillo creciente hacia blanco); encima, una capa blanca sube de
   opacidad. Sin fondo oscuro: el marco sacro se aclara junto a la imagen. */
.selectfx.s-flash{background:transparent;animation:fadeIn .18s ease}
.selectfx-img-flash{animation:selectfxImgWash 1s ease-in both}
/* El fondo también se aclara durante el flash para que no quede estático. */
.selectfx.s-flash .selectfx-bg{animation:selectfxImgWash 1s ease-in both}
@keyframes selectfxImgWash{0%{filter:brightness(1)}100%{filter:brightness(2.4)}}
.selectfx-flash{position:absolute;inset:0;background:#fff;z-index:3;animation:selectfxFlashIn 1s ease-in forwards}
@keyframes selectfxFlashIn{0%{opacity:0}100%{opacity:1}}
/* Fase de salida: el blanco ya llenó la pantalla y se DESVANECE suavemente sobre
   el paso 1 (que ya está montado debajo). Así la luz no "corta" en seco. */
.selectfx.s-out{background:#fff;animation:selectfxOut .45s ease forwards}
@keyframes selectfxOut{0%{opacity:1}100%{opacity:0}}
.opt .thumb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 22%;pointer-events:none}
.optmeta{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:22px 12px 12px;color:#fff;background:none;display:block;text-align:left}
/* .optmeta b / i son BLOQUES: cada uno ocupa su propia línea (título arriba,
   descripción debajo). El fondo oscuro va en el <span class="hl"> interno, que
   es inline + box-decoration-break:clone: sigue a la tinta y NO rellena el hueco
   al final de cada línea (así no tapa la cara de María). */
.optmeta b{display:block;white-space:pre-line;font-family:'Cormorant Garamond',serif;font-size:clamp(18px,4.5vh,26px);font-weight:800;line-height:1.3;color:#fff;margin:0}
.optmeta i{display:block;white-space:pre-line;font-style:normal;font-size:clamp(11px,2.4vh,13.5px);color:#fdfdf8;line-height:1.5;margin-top:2px}
.optmeta .hl{background:rgba(10,9,7,.85);color:inherit;padding:1px 7px;border-radius:5px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.pronto{position:absolute;top:10px;right:10px;z-index:3;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#3a362c;border:1px solid rgba(255,255,255,.6);background:rgba(255,252,245,.85);border-radius:99px;padding:4px 9px;font-weight:600}
.opt > svg{position:absolute;top:12px;left:12px;z-index:3;color:var(--gold);filter:drop-shadow(0 0 2px rgba(0,0,0,.4));background:rgba(255,252,245,.85);border-radius:50%;padding:4px;box-sizing:content-box}

/* ---------- camino ---------- */
.phead{display:flex;align-items:center;justify-content:space-between;padding:8px 10px 0;gap:6px;flex-shrink:0}
.phead-c{flex:1;text-align:center;min-width:0}
.mnum{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#8a6a25;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
/* Título del camino: bold + dorado más oscuro + 5% más grande que el paso */
.mnum-title{color:#6b4e1a;font-weight:700;font-size:11px}
.mnum-step{color:#8a6a25;font-weight:600}
.phead-c h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:22px;line-height:1.15}
.phead-sp{width:44px}
.tp{position:relative;flex:1;min-height:120px;margin:8px 14px 10px;border:1px solid #e2dfd5;border-radius:16px;background:linear-gradient(180deg,#fbfaf6,#f5f4ee);overflow:hidden;box-shadow:inset 0 1px 6px rgba(80,65,30,.05)}
.tp::before,.tp::after{content:"";position:absolute;left:0;right:0;height:22%;z-index:2;pointer-events:none}
.tp::before{top:0;background:linear-gradient(180deg,#fbfaf6,rgba(251,250,246,0))}
.tp::after{bottom:0;background:linear-gradient(0deg,#f5f4ee,rgba(245,244,238,0))}
.tp-track{position:relative;padding:14px 18px;will-change:transform}
.tp-line{font-family:'Cormorant Garamond',serif;text-align:center;font-size:clamp(27px,7.5vw,34px);line-height:1.7;color:#8a877c;letter-spacing:.01em;transition:color .5s,opacity .5s;opacity:.62}
.tp-line.past{opacity:.3}
.tp-line.active{color:#3c2a0c;font-weight:600;opacity:1;text-shadow:0 1px 0 rgba(255,255,255,.4)}
/* Teleprompter incrustado dentro del globo de diálogo (30% superior) */
.sballoon .tp{position:relative;flex:none;width:100%;height:100%;min-height:0;margin:0;border:none;box-shadow:none;background:transparent;overflow:hidden}
.sballoon .tp::before,.sballoon .tp::after{display:none}
.sballoon .tp .tp-track{position:absolute;left:0;right:0;top:0;padding:10px 12px;display:flex;flex-direction:column;align-items:center;will-change:transform}
.sballoon .tp .tp-line{font-size:clamp(28px,7.28vw,32.2px);line-height:1.6;color:#8a877c;margin:3px 0;white-space:normal;width:100%}
/* Bienvenida del selector (presentación del Ángel): globo + texto un 15% menor */
.sel-top .sballoon{max-width:100%}
/* Nombre del Ángel en el selector: se permite 2 líneas centradas al avatar
   (por espacio), quedando "Ángel de la" / "Guarda" centradas. */
.sel-top .savatar b{font-size:13px;line-height:1.2;max-width:100%}
.sel-top .tp .tp-line{font-size:clamp(18.7px,4.84vw,22px);line-height:1.5;margin:2px 0}
.sel-top .sdialtext{font-size:clamp(18.7px,4.84vw,23.1px)}
.tp-hint{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);background:rgba(42,41,38,.82);color:#f2ecdd;font-size:12px;padding:6px 14px;border-radius:99px;z-index:3;animation:fadeIn .6s ease;white-space:nowrap}
.cimg{flex:1;margin:8px 14px 10px;border-radius:16px;overflow:hidden;position:relative;min-height:140px;border:1px solid #e3e0d7;box-shadow:0 14px 28px -18px rgba(60,48,24,.45)}
.cimg img{width:100%;height:100%;object-fit:cover;animation:kb 22s ease-in-out infinite alternate}
.ccap{position:absolute;left:0;right:0;bottom:0;padding:26px 14px 12px;background:linear-gradient(transparent,rgba(20,19,17,.78));color:#f2ecdd;font-size:13.5px;text-align:center;font-style:italic}

/* ---------- deck ---------- */
.deck{border-top:1px solid var(--line);background:linear-gradient(180deg,#f6f5f0,#eeede6);padding:8px 14px 24px;display:flex;flex-direction:column;gap:8px;flex-shrink:0}
.prow{display:flex;align-items:center;gap:10px}
.ptime{font-size:12px;color:var(--gold-ink);min-width:34px;text-align:center}
.ptime.dim{color:var(--silver)}
.pbar{flex:1;height:30px;display:flex;align-items:center;cursor:pointer;touch-action:none}
.ptrack{width:100%;height:5px;border-radius:99px;background:#dcD9cf;overflow:hidden}
.pfill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gold2),var(--gold));transition:width .25s linear}
.trow{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}
.trow .btn.ghost{justify-self:start}
.nextbtn{justify-self:end}
.play{width:64px;height:64px;border-radius:50%;border:none;background:linear-gradient(135deg,#c9a254,#a97f2f);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 18px -8px rgba(140,100,30,.65);transition:transform .15s}
.play:active{transform:scale(.95)}
.play.idle{animation:ring 2.4s ease-out infinite}
/* ---------- botonera única en fila (Atrás · 10s · Play · Siguiente) ---------- */
.controles-reproductor{display:flex;justify-content:center;align-items:center;gap:10px;width:100%;flex-wrap:nowrap}
.controles-reproductor .btn{min-height:46px;padding:0 14px;white-space:nowrap}
/* Atrás empujado al borde izquierdo; Siguiente empujado al borde derecho.
   Los botones del centro (10 s · Play) quedan centrados entre ambos. */
.controles-reproductor .prevbtn{margin-right:auto}
.controles-reproductor .nextbtn{margin-left:auto}
.controles-reproductor .play{flex-shrink:0;width:67px;height:67px} /* 64px ×1.05 = ~5% más grande */
.controles-reproductor .rwdbtn{min-height:37px;padding:0 10px;font-size:13px} /* 46px ×0.8 = 20% más chico */
.controles-reproductor .rwdbtn svg{width:18px;height:18px}
@media (max-width:480px){
  .controles-reproductor{gap:6px}
  .controles-reproductor .btn{padding:0 10px;font-size:13px}
  .controles-reproductor .play{width:57px;height:57px} /* 54px ×1.05 ≈ 5% más grande en móvil */
  .controles-reproductor .rwdbtn{min-height:34px;padding:0 8px}
}

/* ---------- maquetación reutilizable del paso (30/50/20) ---------- */
.steplayout{flex:1;position:relative;display:flex;flex-direction:column;min-height:0;gap:8px;padding:4px 14px 12px;overflow-y:auto;overflow-x:hidden;animation:fadeAppear .5s ease both}
/* El paso 1 que viene del efecto de selección NO hace su propio fade: lo revela
   el overlay blanco (.selectfx.s-out). Evita dos fades en paralelo. */
.steplayout.no-fade{animation:none}
.sstep{min-height:0}
.sstep-top{flex:0 0 auto;flex-basis:30%;flex-shrink:0;display:flex;align-items:center}
.sstep-mid{flex:1 1 0%;position:relative;min-height:0}
.sstep-bottom{flex:0 0 auto;flex-basis:20%;flex-shrink:0;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;padding-top:2px}
/* ---------- modo-voz: el diálogo ocupa todo el espacio libre (sin imagen) ---------- */
.layout-voz-top{flex:1 1 0% !important;min-height:0;display:flex;flex-direction:column;justify-content:flex-start;padding-bottom:20px;box-sizing:border-box}
/* modo-canto: la caja superior (avatar + título de canción) se reduce a la mitad
   (15% ~= 50% del 30% original) y ese espacio pasa a la imagen central. */
.steplayout.canto .sstep-top{flex:0 0 15%}
/* Con subtítulo (título + comentario en mayúscula pequeña) el globo necesita
   más alto para que el texto quepa sin cortarse en escritorio. */
.steplayout.canto .sstep-top.has-sub{flex:0 0 25%}
.steplayout.canto .sstep-top .sdial{gap:8px}
.steplayout.canto .sstep-top .savatar img,.steplayout.canto .sstep-top .savatar .cantoic{width:56px;height:56px}
.layout-voz-top .sdial{flex:1 1 0%;height:100%;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:12px;min-height:0}
.layout-voz-top .savatar{flex:0 0 auto;align-self:center}
.layout-voz-top .sballoon{flex:1 1 0%;height:auto;min-height:0;overflow-y:auto}
.layout-voz-top .sdialtext{font-size:clamp(32.2px,9.1vw,43.4px);line-height:1.45}
.sdial{display:flex;align-items:center;gap:12px;width:100%;height:100%;min-height:0}
.savatar{width:15%;max-width:96px;display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0}
.savatar img{width:78px;height:78px;border-radius:50%;object-fit:cover;border:2px solid rgba(169,127,47,.45)}
.savatar .cantoic{width:70px;height:70px;border-radius:50%;object-fit:cover;border:2px solid rgba(169,127,47,.45)}
.savatar.canto .cantoic{display:flex;align-items:center;justify-content:center;border:none}
.savatar .cantoic{font-size:28px;color:var(--gold2)}
.savatar.speaking img,.savatar.speaking .cantoic{animation:avatarGlow 2.6s ease-in-out infinite}
.savatar b{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:13px;text-align:center;line-height:1.2;max-width:100%}
.sballoon{flex:1;min-width:0;height:100%;display:flex;align-items:center;justify-content:center;border:1px solid #e2dfd5;border-radius:16px;background:linear-gradient(180deg,#fbfaf6,#f5f4ee);padding:14px 16px;overflow:hidden;box-shadow:inset 0 1px 6px rgba(80,65,30,.05)}
.sdialtext{font-family:'Cormorant Garamond',serif;font-size:clamp(20px,5.2vw,25px);line-height:1.5;color:#3c2a0c;text-align:center;font-weight:600;white-space:pre-wrap}
/* Título del globo: crece al máximo posible de su/s línea/s (fluido con vw) y
   en negrita. Balances de palabras para llenar cada línea aprovechando el ancho. */
.sdialtext-title{display:block;width:100%;max-width:100%}
.sdialtext-title-line{display:block;white-space:pre-wrap;overflow-wrap:break-word;width:100%;max-width:100%;font-size:clamp(18px,4.8vw,30px);line-height:1.2;font-weight:700}
/* Subtítulo del globo (bloque entre paréntesis): más pequeño que el título,
   fluye respetando el contenedor según el dispositivo. */
.sdialtext-sub{display:flex;flex-direction:column;align-items:center;gap:3px;margin-top:8px;width:100%;max-width:100%}
.sdialtext-sub-line{display:block;white-space:pre-wrap;overflow-wrap:break-word;width:100%;max-width:100%;font-size:clamp(14px,2.8vw,20px);font-weight:500;color:#7a6f5c;line-height:1.35}
/* ---------- tarjeta de título/oración en móvil (aislado del escritorio) ----------
   En pantallas ≤768px, y SOLO en el modo-canto (título de la tarjeta), el globo
   mantiene una altura fija y uniforme, con el contenido centrado verticalmente
   y un padding compacto. El título va en bold con contraste y el subtítulo queda
   más compacto para caber holgado sin desbordar. Esto NO toca el modo-voz ni el
   selector (allí el globo contiene teleprompters con altura propia). */
@media (max-width:768px){
  /* Tarjeta de título/oración en modo-canto (móvil): altura fija, compacta y
     EQUITATIVA entre todos los pasos de Canto (2, 5, 7, 9). Así el Paso 7
     (que lleva subtítulo) ya no crece más que los demás, no se roba espacio de
     la imagen, y las letras pueden aprovechar mejor el alto de la caja. */
  .steplayout.canto .sstep-top{
    flex:0 0 auto;
    height:100px;
    max-height:100px;
    min-height:100px;
    box-sizing:border-box;
    padding:4px 8px;
    margin:0;
    overflow:hidden;
    align-items:center;
  }
  .steplayout.canto .sstep-top.has-sub{height:100px;max-height:100px;min-height:100px}
  /* Contenedor del globo: ocupa todo el alto de la tarjeta y centra el texto. */
  .steplayout.canto .sstep-top .sballoon{
    min-height:0;
    height:100%;
    padding:2px 8px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;
  }
  .steplayout.canto .sstep-top .sdialtext{
    align-items:center;
    display:flex;
    flex-direction:column;
    justify-content:center;
    text-align:center;
    margin:0;
    gap:2px;
  }
  .steplayout.canto .sstep-top .sdialtext-title-line{
    font-weight:700;
    font-size:1.32rem;
    color:#2D231A;
    line-height:1.18;
    margin:0;
  }
  .steplayout.canto .sstep-top .sdialtext-sub{
    max-width:94%;
    margin:4px auto 0;
    text-wrap:balance;
  }
  .steplayout.canto .sstep-top .sdialtext-sub-line{
    white-space:normal;
    text-wrap:balance;
    overflow-wrap:break-word;
    max-width:94%;
    margin:0 auto;
    font-size:clamp(15px,4.6vw,18px);
    font-weight:500;
    color:#4A3E31;
    line-height:1.22;
  }
}
/* ---------- optimización del teleprompter / globo de texto en móvil ----------
   Para pantallas ≤600px buscamos: más ancho de lectura (menos padding),
   interlineado compacto (1.35–1.4), balanceo automático de palabras y letra
   fluida que evita palabras huérfanas y el desperdicio de línea. */
@media (max-width:600px){
  .sballoon{padding:10px 12px}
  .sballoon .tp .tp-track{padding:8px 4px}
  /* Teleprompter principal de pasos: +40 % (clamp base ×1.4) */
  .sballoon .tp .tp-line{
    font-size:clamp(1.61rem,5.88vw,1.89rem);
    line-height:1.38;
    text-wrap:balance; /* balancea palabras por línea (quita huérfanas) */
  }
  .sdialtext{
    font-size:clamp(1.61rem,5.88vw,1.89rem);
    line-height:1.38;
    text-wrap:balance;
  }
  /* Modo voz (diálogo a pantalla): +40 % sobre el clamp móvil */
  .layout-voz-top .sdialtext{
    font-size:clamp(1.61rem,5.88vw,1.89rem);
    line-height:1.38;
  }
  /* Teleprompter de Bienvenida/Ángel: +10 % sobre su base ⇒ se mantiene
     algo menor que el de pasos, pero más grande que antes. */
  .sel-top .tp .tp-line{
    font-size:clamp(1.27rem,4.62vw,1.49rem);
    line-height:1.38;
    text-wrap:balance;
  }
  .sel-top .sdialtext{
    font-size:clamp(1.27rem,4.62vw,1.49rem);
    line-height:1.38;
    text-wrap:balance;
  }
}
.sadmtext{width:100%;height:100%;min-height:120px;border:none;background:transparent;resize:none;font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.5;color:#3c2a0c;font-weight:600;outline:none;overflow:auto}
.sscene{width:100%;height:100%;min-height:0;border-radius:16px;overflow:hidden;position:relative;border:1px solid #e3e0d7;box-shadow:0 14px 28px -18px rgba(60,48,24,.45);background:#eee}
.sscene img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center}
/* Transición de imágenes (slides): apila las imágenes y hace crossfade.
   La clase .on marca la visible; el resto permanece con opacidad 0. */
.sscene.slides img{opacity:0;transition:opacity 1.2s ease}
.sscene.slides img.on{opacity:1}
.slide-dots{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);display:flex;gap:6px;z-index:4}
.slide-dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.45);transition:background .3s,transform .3s}
.slide-dots i.on{background:#fff;transform:scale(1.25)}
/*
  Imágenes de slides en modo "gala" (m5_canto, m7_canto): la imagen OCCUPA
  todo el espacio de la caja con object-fit:cover (como manos_orantes.jpg y
  gloria_cielo.jpg). Si la imagen es más vertical que el área, se recortan
  bordes; el usuario acepta perder un poco de los exteriores para que llene.
*/
.sstep-mid.slides-contain{display:block}
.sscene.slides.contain-box{width:100%;height:100%;background:#eee;border-radius:12px;overflow:hidden}
.sscene.slides.contain-box .sizer{display:none}
.sscene.slides.contain-box > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
.ccap{position:absolute;left:0;right:0;bottom:0;margin:0;padding:6px 10px;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:600;color:#fff;text-align:center;background:linear-gradient(180deg,transparent,rgba(0,0,0,.62));border-bottom-left-radius:16px;border-bottom-right-radius:16px}
.splaceholder{width:100%;height:100%;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--silver);background:repeating-linear-gradient(45deg,#f0eee8,#f0eee8 12px,#e9e6de 12px,#e9e6de 24px);border-radius:16px}
.splaceholder span{font-size:13px;font-weight:600;letter-spacing:.02em;text-align:center;padding:0 10px}
.sfirma{display:block;width:100%;text-align:center;margin:2px 0 0;padding:0 10px;font-size:9px;letter-spacing:.18em;line-height:1.4;color:rgba(90,86,76,.6);text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sadmbars{display:flex;flex-direction:column;gap:3px;flex-shrink:0;font-size:11.5px;color:#4e3a10;background:var(--gold-faint);border:1px dashed var(--gold2);border-radius:10px;padding:5px 8px;line-height:1.35}
.sadmitem{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.sadmitem code{font-family:ui-monospace,monospace;font-size:11px;font-weight:600;background:rgba(255,255,255,.7);padding:0 5px;border-radius:5px;word-break:break-all}
.sadmitem.miss code{background:#f7e0d0;color:#7a3d12}

/* ---------- admin toggle en bienvenida ---------- */
.admin-a{position:absolute;top:12px;right:16px;z-index:20;width:34px;height:34px;border-radius:50%;border:1px solid rgba(201,169,97,.5);background:rgba(255,253,248,.08);color:rgba(245,241,232,.5);font-family:'Inter',sans-serif;font-size:15px;font-weight:600;cursor:pointer;opacity:.55;transition:opacity .2s}
.admin-a:hover{opacity:1}
.admin-chip{position:absolute;top:12px;left:16px;z-index:20;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:rgba(150,105,31,.9);padding:4px 10px;border-radius:99px;font-weight:600}

/* ---------- config ---------- */
.config{flex:1;display:flex;flex-direction:column;min-height:0;animation:fadeUp .4s ease}
.chead{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 10px;gap:10px}
.cover{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--silver)}
.chead h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:26px;line-height:1.1}
.chipdoc{display:inline-block;margin-top:6px;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-ink);background:var(--gold-faint);border-radius:99px;padding:4px 10px}
.tabs{display:flex;gap:6px;padding:0 14px 12px;overflow-x:auto;flex-shrink:0}
.tabs button{flex:1;min-width:82px;min-height:42px;border-radius:11px;border:1px solid var(--line);background:transparent;color:var(--ink-soft);font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .2s}
.tabs button.on{background:var(--white);color:var(--gold-ink);border-color:var(--gold2);box-shadow:0 2px 8px -3px rgba(140,100,30,.3)}
.cbody{flex:1;overflow-y:auto;padding:6px 16px 48px;-webkit-overflow-scrolling:touch}
.field{margin-bottom:18px}
.field2{margin-top:8px}
.lbl{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b887c;margin-bottom:7px;font-weight:600}
.inp{width:100%;min-height:48px;border:1px solid var(--line);border-radius:12px;padding:10px 13px;font-size:16px;background:var(--white);color:var(--ink)}
.inp.ta{font-family:'Cormorant Garamond',serif;font-size:18px;line-height:1.6;min-height:140px;resize:vertical}
.inp.sel{min-height:46px}
.note{font-size:12.5px;color:var(--silver);line-height:1.5;margin-top:7px}
.note.center{text-align:center}
.imgprev{border-radius:14px;overflow:hidden;border:1px solid var(--line);margin-bottom:8px;height:120px}
.imgprev img{width:100%;height:100%;object-fit:cover}
.row2{display:flex;gap:8px;align-items:center}
.row2.end{justify-content:space-between;margin-top:26px}
.row2 .btn{flex:1}
.savearea{margin-top:26px}
.qrbtn{width:100%;margin-top:12px;min-height:54px;font-size:15.5px;font-weight:600;animation:fadeUp .4s ease}
.seg{display:flex;background:#e3e1d9;border-radius:12px;padding:3px;gap:3px}
.seg button{flex:1;min-height:42px;border:none;border-radius:9px;background:transparent;color:var(--ink-soft);font-size:14px;font-weight:500;cursor:pointer}
.seg button.on{background:var(--white);color:var(--gold-ink);box-shadow:0 1px 5px rgba(40,30,10,.12)}
.seg.mini{margin:8px 0}
.segcard{border:1px solid var(--line);border-radius:16px;background:var(--white);padding:12px;margin-bottom:14px}
.seghead2{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.segnum{width:28px;height:28px;border-radius:50%;background:var(--gold-faint);color:var(--gold-ink);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.segtools2{display:flex;gap:2px}
.switch{min-width:52px;height:30px;border-radius:99px;border:1px solid var(--line);background:#e3e1d9;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
.switch::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.switch.on{background:var(--gold2);border-color:var(--gold)}
.switch.on::after{left:25px}

@media (max-width:380px){
  .btn{font-size:14px;padding:0 12px}
  .play{width:58px;height:58px}
  .avatar{width:64px;height:64px}
}
@media (min-width:640px){
  body{background:radial-gradient(circle at 50% 20%,#efece4,#dcd9d0)}
}
@media (prefers-reduced-motion:reduce){
  *,#root::before{animation:none !important;transition:none !important}
}
`;
