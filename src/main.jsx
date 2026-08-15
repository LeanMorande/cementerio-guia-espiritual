/* =====================================================================
   MAIN — punto de entrada de React (Vite).
   ===================================================================== */
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
