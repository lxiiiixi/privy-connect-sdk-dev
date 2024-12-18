import {
    useWallet,
    Wallet as AdapterWallet,
    WalletContextState,
} from "@solana/wallet-adapter-react";
import { connection } from "../solana";
import API_REQUEST from "../request";
import { VersionedTransaction } from "@solana/web3.js";

// https://docs.privy.io/guide/react/wallets/usage/solana/
type ButtonState = "connecting" | "connected" | "disconnecting" | "has-wallet" | "no-wallet";
type ExternalWalletType = {
    buy: any;
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

    // https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md

    const buy = async () => {
        if (!publicKey?.toString() || !sendTransaction || !connection) return;
        const amount = 0.01 * 1e9; // 0.1 SOL in lamports decimals-9
        const res = await API_REQUEST.getTransaction({
            userPublicKey: publicKey?.toString(),
            inputToken: "So11111111111111111111111111111111111111112", // sol
            outputToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // 购买 usdc
            amount: amount.toString(),
            slippage: 50, // 滑点
        });
        const swapTransactionBuf = Buffer.from(res.data, "base64");
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        const signature = await sendTransaction(transaction, connection);
        return signature;
    };

    return {
        ...walletState,
        wallets,
        select,
        wallet,
        disconnect,
        publicKey,
        buy,
    };
};
