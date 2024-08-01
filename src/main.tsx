import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Import bootstrap-icons CSS
import "bootstrap-icons/font/bootstrap-icons.css";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.replace("/")}
        >
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);
