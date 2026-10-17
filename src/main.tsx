import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import appConfig from "./app.config";

document.title = appConfig.name;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
