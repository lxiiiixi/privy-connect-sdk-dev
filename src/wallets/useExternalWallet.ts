import {
    useWallet,
    Wallet as AdapterWallet,
    WalletContextState,
} from "@solana/wallet-adapter-react";
import { connection } from "../solana";
import API_REQUEST from "../request";
import { VersionedTransaction } from "@solana/web3.js";
import { TradePayload } from "./useBoomWallet";
import { getTokenByAddress, TOKENS } from "../tokens";

// https://docs.privy.io/guide/react/wallets/usage/solana/
type ButtonState = "connecting" | "connected" | "disconnecting" | "has-wallet" | "no-wallet";
type ExternalWalletType = {
    trade: any;
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

    const trade = async (payload: TradePayload) => {
        const { tokenAddress, amountIn, op, slippage } = payload;

        const SolToken = TOKENS.SOL;
        const OpToken = getTokenByAddress(tokenAddress);
        if (!OpToken) {
            throw new Error("Token not found");
        }

        const [tokenIn, tokenOut] =
            op === "BUY"
                ? [SolToken.address, OpToken.address]
                : [OpToken.address, SolToken.address];

        if (!publicKey?.toString() || !sendTransaction || !connection) return;
        const res = await API_REQUEST.getTransaction({
            userPublicKey: publicKey?.toString(),
            inputToken: tokenIn,
            outputToken: tokenOut,
            amount: (amountIn * 10 ** OpToken.decimals).toString(),
            slippage: slippage || 50,
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
        trade,
    };
};
