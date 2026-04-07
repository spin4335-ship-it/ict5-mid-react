import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext";

import { AlertProvider } from "./context/AlertContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AlertProvider>
                    <App />
                </AlertProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
