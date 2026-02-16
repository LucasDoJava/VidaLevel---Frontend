import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // mantenha seu css global
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
