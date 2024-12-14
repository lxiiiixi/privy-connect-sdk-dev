import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BoomWalletProvider } from "privy-connect-test-sdk";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BoomWalletProvider appId={"cm485ehd706mjjqspwtpqlo74"}>
            <App />
        </BoomWalletProvider>
    </StrictMode>
);
