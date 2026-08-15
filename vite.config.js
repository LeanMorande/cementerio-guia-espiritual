import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración Vite para el recorrido espiritual.
// Los audios se sirven desde la carpeta pública: /sounds/*.mp3
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
