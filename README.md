# Cementerio Católico de Colonia Crespo · Reza por tus difuntos

App React (Vite) que modula la experiencia espiritual. Modularizado desde un
archivo único `app.jsx` a una arquitectura de componentes escalable.

## Requisitos

- Node.js 18+ (npm incluido)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura de carpetas

```
cementerio-guia-espiritual/
├── index.html                 # Entrada HTML (montaje de React)
├── package.json
├── vite.config.js
├── public/
│   └── sounds/                # ► COLOCA AQUÍ LOS MP3 (se sirven en /sounds/)
│       ├── intro_angel.mp3
│       ├── paso_1.mp3
│       ├── paso_2.mp3
│       ├── paso_3.mp3
│       ├── paso_4.mp3
│       └── paso_5.mp3
└── src/
    ├── main.jsx               # Entry de React
    ├── App.jsx                # Orquestador + motor de audio + estado
    ├── config/
    │   └── defaults.js        # Constantes, imágenes, buildDefaults() con rutas /sounds/
    ├── lib/
    │   ├── audio.js           # unlockAudio(), probeDuration()
    │   └── utils.js           # fmtTime(), makeSilence()
    ├── components/
    │   ├── icons.jsx
    │   ├── Watermark.jsx
    │   ├── SpeakerPanel.jsx
    │   ├── Teleprompter.jsx
    │   ├── LiveCaption.jsx
    │   ├── WelcomeScreen.jsx
    │   ├── SelectScreen.jsx
    │   ├── PathScreen.jsx
    │   ├── FinScreen.jsx
    │   └── ConfigScreen.jsx
    └── styles/
        └── css.js             # Estilos globales
```

## Audios

Todos los audios se cargan por ruta estática desde `/sounds/` (carpeta `public/sounds/`).
Los nombres por defecto en `src/config/defaults.js` son:

- `/sounds/intro_angel.mp3` — presentación del Ángel
- `/sounds/paso_1.mp3` … `/sounds/paso_5.mp3` — pasos del camino

Puedes editar las rutas en la pantalla de Configuración o directamente en `defaults.js`.

## Configuración

La pantalla **Config · pruebas** (ruta por defecto, será eliminada en producción)
permite editar textos y rutas `/sounds/`, y simular el QR (`#visita`).

El estado inicial está **incrustado en el código** (`buildDefaults()`). Se persiste
opcionalmente en `localStorage` (sin blobs).
