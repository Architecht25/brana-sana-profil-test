import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BranaSanaApp from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BranaSanaApp />
  </StrictMode>
);
