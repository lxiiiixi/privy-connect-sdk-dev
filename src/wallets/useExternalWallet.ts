import {
    useWallet,
    Wallet as AdapterWallet,
    WalletContextState,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { buyTokenBySol } from "../lib/buy";
import { connection } from "../solana";

// https://docs.privy.io/guide/react/wallets/usage/solana/
type ButtonState = "connecting" | "connected" | "disconnecting" | "has-wallet" | "no-wallet";
type ExternalWalletType = {
    sendTransactions: {
        buy: (transaction: any) => Promise<void>;
    };
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

    if (!wallet) return null;

    const buy = async () => {
        if (!publicKey?.toString() || !sendTransaction || !connection) return;
        console.log("执行交易");
        const signature = await buyTokenBySol(publicKey?.toString(), sendTransaction, connection);
        return signature;
    };

    return {
        ...walletState,
        wallets,
        select,
        wallet,
        disconnect,
        publicKey,
        sendTransactions: {
            buy,
        },
    };
};
