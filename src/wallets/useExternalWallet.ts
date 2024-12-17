import {
    useWallet,
    Wallet as AdapterWallet,
    WalletContextState,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";

// https://docs.privy.io/guide/react/wallets/usage/solana/
type ButtonState = "connecting" | "connected" | "disconnecting" | "has-wallet" | "no-wallet";
type ExternalWalletType = {
    buttonState: ButtonState;
    label: string;
} & WalletContextState;
export const useExternalWallet: () => ExternalWalletType | null = () => {
    const walletState = useWallet();
    const {
        autoConnect,
        connected,
        connecting,
        disconnect,
        disconnecting,
        publicKey,
        select,
        wallet,
        wallets,
        sendTransaction,
    } = walletState;

    // connect 和 select 的区别？

    console.log(
        "🚀 ~ CustomWalletButton ~ connect:",
        connected,
        publicKey,
        publicKey?.toString(),
        wallet,
        wallets
    );

    const { buttonState, label } = useMemo(() => {
        let buttonState: ButtonState;
        if (connecting) {
            buttonState = "connecting";
        } else if (connected) {
            buttonState = "connected";
        } else if (disconnecting) {
            buttonState = "disconnecting";
        } else if (wallet) {
            buttonState = "has-wallet";
        } else {
            buttonState = "no-wallet";
        }
        let label;
        switch (buttonState) {
            case "connected":
                label = "Disconnect";
                break;
            case "connecting":
                label = "Connecting";
                break;
            case "disconnecting":
                label = "Disconnecting";
                break;
            case "has-wallet":
                label = "Connect";
                break;
            case "no-wallet":
                label = "Select Wallet";
                break;
        }
        return { buttonState, label };
    }, [connecting, connected, disconnecting, wallet]);

    if (!wallet) return null;

    return { ...walletState, buttonState, label, wallets, select, wallet, disconnect, publicKey };
};
