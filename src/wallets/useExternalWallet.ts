import {
    useWallet,
    Wallet as AdapterWallet,
    WalletContextState,
} from "@solana/wallet-adapter-react";
import { connection } from "../solana";
import API_REQUEST from "../request";
import { VersionedTransaction } from "@solana/web3.js";
import { TradePayload } from "./useBoomWallet";
import { logger } from "../utils";
import bs58 from "bs58";
import { encodeBase64 } from "tweetnacl-util";

// https://docs.privy.io/guide/react/wallets/usage/solana/
type ButtonState = "connecting" | "connected" | "disconnecting" | "has-wallet" | "no-wallet";
type ExternalWalletType = {
    trade: any;
} & WalletContextState & {
        signWalletMessage: (message: string) => Promise<string | null>; // 签名
    };
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
        signMessage: walletSignMessage,
    } = walletState;

    // connect 和 select 的区别？

    logger.log(
        "🚀 ~ CustomWalletButton ~ connect:",
        connected,
        publicKey,
        publicKey?.toString(),
        wallet,
        wallets
    );

    if (!wallet) return null;

    // https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md

    const trade = async (payload: TradePayload) => {
        const { inputTokenAddress, outputTokenAddress, amountIn, slippage } = payload;

        if (!publicKey?.toString() || !sendTransaction || !connection) return;
        const res = await API_REQUEST.getTransaction({
            userPublicKey: publicKey?.toString(),
            inputToken: inputTokenAddress,
            outputToken: outputTokenAddress,
            amount: amountIn,
            slippage: slippage || 50,
        });
        const swapTransactionBuf = Buffer.from(res.data, "base64");
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        const signature = await sendTransaction(transaction, connection);
        return signature;
    };

    const signWalletMessage = async (message: string) => {
        if (!walletSignMessage) return null;
        const messageBuffer = new TextEncoder().encode(message);
        const signature = await walletSignMessage(messageBuffer);
        const base64Signature = encodeBase64(signature);
        return base64Signature;
    };

    return {
        ...walletState,
        wallets,
        select,
        wallet,
        disconnect,
        publicKey,
        trade,
        signWalletMessage,
    };
};
