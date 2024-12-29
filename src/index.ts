import { Buffer } from "buffer";

export { default as BoomWalletProvider } from "./BoomWalletProvider";
export { useBoomWallet } from "./wallets/useBoomWallet";
export { default as WalletConnectButton } from "./WalletConnectButton";
export { default as ConnectWalletModal } from "./ConnectWalletModal";
export { useSolanaBalance, getTokenBalance } from "./solana";
import "./index.css";

// export * from "./index.css";
// import "./index.css";

if (typeof window !== "undefined") {
    window.Buffer = Buffer; // buffer Polyfill
}

if (typeof window !== "undefined") {
    const isDev = process.env.NODE_ENV === "development";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = isDev
        ? "node_modules/boom-wallet-sdk/dist/index.css"
        : "https://cdn.jsdelivr.net/npm/boom-wallet-sdk@latest/dist/index.css";
    document.head.appendChild(link);
}
