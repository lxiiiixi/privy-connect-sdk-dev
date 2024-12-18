import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BoomWalletProvider } from "boom-wallet-sdk";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BoomWalletProvider appId={import.meta.env.VITE_BOOM_APP_ID || "cm485ehd706mjjqspwtpqlo74"}>
            <App />
        </BoomWalletProvider>
    </StrictMode>
);
