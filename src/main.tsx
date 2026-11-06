import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
root.innerHTML = "";
root.classList.add("hydrated");
createRoot(root).render(<App />);
