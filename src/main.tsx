import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
root.innerHTML = "";
createRoot(root).render(<App />);
