import React from "react";
import ReactDOM from "react-dom/client";
import "./theme.css";
import App from "./App.jsx";

// Layout responsivo (mantido aqui pra ficar junto do mount)
const layout = document.createElement("style");
layout.textContent = `
  .axon-main {
    padding: 30px;
    max-width: 1140px;
    margin: 0 auto;
    margin-left: 232px;
  }
  .axon-menu { display: none; margin-bottom: 20px; }
  @media (max-width: 860px) {
    .axon-sidebar { transform: translateX(-100%); }
    .axon-main { margin-left: 0; padding: 20px; }
    .axon-menu { display: inline-flex; }
  }
`;
document.head.appendChild(layout);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
