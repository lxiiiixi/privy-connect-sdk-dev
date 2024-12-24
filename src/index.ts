import { Buffer } from "buffer";

export { default as BoomWalletProvider } from "./BoomWalletProvider";
export { useBoomWallet } from "./wallets/useBoomWallet";
export { default as WalletConnectButton } from "./WalletConnectButton";
export * from "./index.css";

if (typeof window !== "undefined") {
    window.Buffer = Buffer; // buffer Polyfill
}

if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/node_modules/boom-wallet-sdk/dist/index.css";
    document.head.appendChild(link);
}
