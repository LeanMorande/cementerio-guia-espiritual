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
.boot{position:absolute;inset:0;background:#f7f6f2;z-index:90;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:var(--ink-soft);font-size:14px}
.boot-cross{color:var(--gold);animation:bootp 1.6s ease-in-out infinite}

/* ---------- pantallas oscuras ---------- */
.splash{position:absolute;inset:0;background:#141416;color:#f0ece2;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:fadeIn .5s ease}
.sbg{position:absolute;inset:-8%;background-size:cover;background-position:center;filter:blur(16px) brightness(.4) saturate(.75);animation:kb 26s ease-in-out infinite alternate}
.sveil{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,rgba(20,20,22,.15),rgba(12,12,14,.82) 78%)}
.scontent{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:28px;max-width:380px;animation:fadeUp .7s ease;width:100%}
.semb{width:86px;height:86px;border-radius:50%;border:1px solid rgba(201,169,97,.5);display:flex;align-items:center;justify-content:center;color:var(--gold2);animation:emb 3.4s ease-in-out infinite;margin-bottom:18px}
.stitle{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:clamp(30px,8vw,42px);line-height:1.08}
.sdiv{width:56px;height:1px;background:linear-gradient(90deg,transparent,var(--gold2),transparent);margin:16px 0}
.stext{font-size:16px;line-height:1.55;color:rgba(245,241,232,.94)}
.scontent .btn.gold{width:100%;margin-top:26px}
.btn.start{animation:ring 2.6s ease-out infinite}
.stap{font-size:12px;color:rgba(240,236,226,.5);margin-top:12px}

/* ---------- pantalla clara base ---------- */
.screen{flex:1;display:flex;flex-direction:column;min-height:0;animation:fadeUp .45s ease}

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
.choosewrap{flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:0 16px 30px;gap:6px;min-height:0}
.chooserow{display:flex;align-items:center;justify-content:space-between;gap:10px}
.chooserow h2{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600}
.cdnote{font-size:11.5px;color:#7c7a70;font-weight:500;margin-top:-2px}
.cdring{position:relative;width:34px;height:34px;flex-shrink:0;opacity:.75}
.cdring svg{transform:rotate(-90deg)}
.cdtrack{fill:none;stroke:#dcD9cf;stroke-width:3}
.cdprog{fill:none;stroke:var(--gold2);stroke-width:3;stroke-linecap:round;transition:stroke-dashoffset 1s linear}
.cdring span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--gold-ink);font-weight:600}
.options{display:flex;flex-direction:column;gap:10px;margin-top:10px}
.opt{display:flex;align-items:center;gap:12px;width:100%;min-height:80px;border-radius:16px;border:1px solid var(--line);background:var(--white);overflow:hidden;cursor:pointer;text-align:left;transition:transform .15s,box-shadow .2s;padding:0 12px 0 8px}
.opt:active{transform:scale(.98)}
.opt.enabled{border-color:var(--gold2);box-shadow:0 8px 20px -14px rgba(140,100,30,.5)}
.opt.disabled{opacity:.62}
.opt .thumb{width:64px;height:64px;border-radius:12px;object-fit:cover;flex-shrink:0}
.optmeta{flex:1;min-width:0}
.optmeta b{display:block;font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;line-height:1.15}
.optmeta i{font-style:normal;font-size:12.5px;color:var(--ink-soft)}
.pronto{font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#8a887e;border:1px solid #cfcbc0;border-radius:99px;padding:4px 9px;font-weight:600}
.opt > svg{color:var(--gold)}

/* ---------- camino ---------- */
.phead{display:flex;align-items:center;justify-content:space-between;padding:8px 10px 0;gap:6px;flex-shrink:0}
.phead-c{flex:1;text-align:center;min-width:0}
.mnum{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#8a6a25;font-weight:600}
.phead-c h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:22px;line-height:1.15}
.phead-sp{width:44px}
.tp{position:relative;flex:1;min-height:120px;margin:8px 14px 10px;border:1px solid #e2dfd5;border-radius:16px;background:linear-gradient(180deg,#fbfaf6,#f5f4ee);overflow:hidden;box-shadow:inset 0 1px 6px rgba(80,65,30,.05)}
.tp::before,.tp::after{content:"";position:absolute;left:0;right:0;height:22%;z-index:2;pointer-events:none}
.tp::before{top:0;background:linear-gradient(180deg,#fbfaf6,rgba(251,250,246,0))}
.tp::after{bottom:0;background:linear-gradient(0deg,#f5f4ee,rgba(245,244,238,0))}
.tp-track{position:relative;padding:14px 18px;will-change:transform}
.tp-line{font-family:'Cormorant Garamond',serif;text-align:center;font-size:clamp(21px,5.8vw,26px);line-height:1.7;color:#8a877c;letter-spacing:.01em;transition:color .5s,opacity .5s;opacity:.62}
.tp-line.past{opacity:.3}
.tp-line.active{color:#3c2a0c;font-weight:600;opacity:1;text-shadow:0 1px 0 rgba(255,255,255,.4)}
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
