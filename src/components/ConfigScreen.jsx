/* =====================================================================
   COMPONENTS / ConfigScreen.jsx — configuración de pruebas.
   =====================================================================
   Ya NO sube archivos (sin IndexedDB). Edita rutas /sounds/ y textos.
   ===================================================================== */
import { useState } from "react";
import { Ic } from "./icons.jsx";
import { fmtTime } from "../lib/utils.js";

export default function ConfigScreen(props) {
  const { cfg, onSave, onSimulateQR, toast } = props;
  const [tab, setTab] = useState("bienvenida");
  const [saved, setSaved] = useState(false);
  const B = cfg.bienvenida;

  const setB = props.setB;

  return (
    <div className="config">
      <header className="chead">
        <div>
          <p className="cover">Configuración · pruebas</p>
          <h1>Recorrido Espiritual</h1>
          <p className="chipdoc">Editor de rutas /sounds/</p>
        </div>
        <button
          className="iconbtn"
          onClick={() => { onSave(); setSaved(true); }}
          aria-label="Guardar configuración"
        >
          <Ic.Gear />
        </button>
      </header>

      <div className="tabs" role="tablist">
        {[
          ["bienvenida", "Bienvenida"],
          ["opciones", "Opciones"],
          ["camino", "Camino de María"],
        ].map(([k, l]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            className={tab === k ? "on" : ""}
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="cbody">
        {tab === "bienvenida" && (
          <>
            <div className="field">
              <span className="lbl">Título</span>
              <input className="inp" value={B.titulo} onChange={(e) => setB({ titulo: e.target.value })} />
            </div>
            <div className="field">
              <span className="lbl">Subtítulo</span>
              <input className="inp" value={B.subtitulo} onChange={(e) => setB({ subtitulo: e.target.value })} />
            </div>
            <div className="field">
              <span className="lbl">Ruta del audio del Ángel (/sounds/)</span>
              <input
                className="inp"
                value={B.introAudioUrl || ""}
                onChange={(e) => setB({ introAudioUrl: e.target.value, introAudio: !!e.target.value, introAudioName: e.target.value.split("/").pop() })}
              />
              <p className="note">Ej.: /sounds/intro_angel.mp3 — se reproduce solo al entrar.</p>
            </div>
            <div className="field">
              <span className="lbl">Texto de la presentación (subtítulos)</span>
              <textarea className="inp ta" rows={8} value={B.introTexto} onChange={(e) => setB({ introTexto: e.target.value })} />
            </div>
            <div className="field">
              <span className="lbl">Segundos para elegir (contador)</span>
              <input
                className="inp num"
                type="number"
                min="5"
                max="120"
                value={cfg.countdown}
                onChange={(e) => props.setCountdown(Math.max(5, Math.min(120, parseInt(e.target.value || "0", 10) || 20)))}
              />
            </div>
          </>
        )}

        {tab === "opciones" &&
          cfg.opciones.map((o, i) => (
            <div className="field" key={o.id}>
              <span className="lbl">{o.titulo}</span>
              <div className="imgprev sm2prev">
                <img src={o.img} alt="" />
              </div>
              <div className="row2 field2">
                <input className="inp" value={o.titulo} onChange={(e) => props.setOpc(i, { titulo: e.target.value })} aria-label="Título de la opción" />
                <button
                  className={"switch" + (o.habilitado ? " on" : "")}
                  role="switch"
                  aria-checked={o.habilitado}
                  aria-label="Habilitar camino"
                  onClick={() => props.setOpc(i, { habilitado: !o.habilitado })}
                />
              </div>
              <input className="inp field2" value={o.desc} onChange={(e) => props.setOpc(i, { desc: e.target.value })} aria-label="Descripción" />
            </div>
          ))}

        {tab === "camino" && (
          <>
            {cfg.camino.map((sg, i) => (
              <div className="segcard" key={sg.uid}>
                <div className="seghead2">
                  <span className="segnum">{i + 1}</span>
                  <select className="inp sel" value={sg.voz} onChange={(e) => props.setSeg(i, { voz: e.target.value })} aria-label="Voz del paso">
                    <option value="angel">Voz: Ángel de la Guarda</option>
                    <option value="maria">Voz: Virgen María</option>
                    <option value="">Sin voz (canto / silencio)</option>
                  </select>
                  <div className="segtools2">
                    <button className="iconbtn sm3" disabled={i === 0} onClick={() => props.moveSeg(i, -1)} aria-label="Subir">
                      ↑
                    </button>
                    <button className="iconbtn sm3" disabled={i === cfg.camino.length - 1} onClick={() => props.moveSeg(i, 1)} aria-label="Bajar">
                      ↓
                    </button>
                    <button className="iconbtn sm3" onClick={() => props.delSeg(i)} aria-label="Eliminar paso">
                      <Ic.Close s={16} />
                    </button>
                  </div>
                </div>
                <div className="seg mini">
                  <button className={sg.tipo === "subtitulo" ? "on" : ""} onClick={() => props.setSeg(i, { tipo: "subtitulo" })}>
                    Subtítulos
                  </button>
                  <button className={sg.tipo === "imagen" ? "on" : ""} onClick={() => props.setSeg(i, { tipo: "imagen" })}>
                    Imagen
                  </button>
                </div>
                <div className="field2">
                  <span className="lbl">Ruta del audio (/sounds/)</span>
                  <input
                    className="inp"
                    value={sg.audioUrl || ""}
                    onChange={(e) =>
                      props.setSeg(i, { audioUrl: e.target.value, audio: !!e.target.value, audioName: e.target.value.split("/").pop() })
                    }
                  />
                </div>
                {sg.tipo === "subtitulo" ? (
                  <textarea className="inp ta" rows={5} value={sg.texto} onChange={(e) => props.setSeg(i, { texto: e.target.value })} />
                ) : (
                  <>
                    <div className="imgprev sm2prev">
                      <img src={sg.imagen} alt="" />
                    </div>
                    <input
                      className="inp field2"
                      value={sg.caption}
                      placeholder="Epígrafe (ej.: nombre del canto)"
                      onChange={(e) => props.setSeg(i, { caption: e.target.value })}
                      aria-label="Epígrafe de la imagen"
                    />
                  </>
                )}
              </div>
            ))}
            <button className="btn outline" onClick={props.addSeg}>
              <span>+ Agregar paso</span>
            </button>
          </>
        )}

        <div className="row2 end savearea">
          <button
            className="btn gold"
            onClick={() => { onSave(); setSaved(true); toast("Configuración guardada"); }}
          >
            <span>Guardar configuración</span>
          </button>
        </div>
        {saved && (
          <button className="btn outline qrbtn" onClick={onSimulateQR}>
            <Ic.Qr s={22} />
            <span>Probar Demo · Simular QR</span>
            <Ic.ChR />
          </button>
        )}
        <p className="note center">Los audios se cargan desde /sounds/. El QR real abre la página con #visita.</p>
      </div>
    </div>
  );
}
