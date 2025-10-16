import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";

// CORRECT PATH: App.jsx is inside the components folder
import App from "./components/App.jsx";
import { UXEnhancementProvider } from "./components/UXEnhancementProvider.jsx";



// Find the root element defined in index.html
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <UXEnhancementProvider>
      <App />
    </UXEnhancementProvider>
  </React.StrictMode>
);
