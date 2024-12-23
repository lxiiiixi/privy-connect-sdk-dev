import { useExternalWallet } from "./useExternalWallet";
import { usePrivyEmbeddedWallet } from "./usePrivyEmbeddedWallet";

export type TradePayload = {
    inputToken: string;
    outputToken: string;
    amountIn: number;
    slippage?: number;
};

type BoomWallet = {
    type: "EMAIL" | "WALLET" | "NONE"; // 登录类型,NONE时表示未登录
    email?: string; // 邮箱（邮箱登录时才有）
    isConnected: boolean;
    walletAddress?: string;
    transactions: {
        trade: (payload: TradePayload) => Promise<string>;
    };
    exportWallet?: () => void;
    disconnect?: () => void;
};

export const useBoomWallet: () => BoomWallet = () => {
    const privyEmbeddedWallet = usePrivyEmbeddedWallet();
    const externalWallet = useExternalWallet();
    if (privyEmbeddedWallet.user.wallet) {
        const { trade, logout, exportWallet, user, authenticated } = privyEmbeddedWallet;
        return {
            type: "EMAIL",
            email: user.email?.address,
            isConnected: authenticated,
            walletAddress: user.wallet?.address,
            exportWallet: exportWallet,
            disconnect: logout,
            transactions: {
                trade: (payload: TradePayload) => trade(payload),
            },
        };
    }
    if (externalWallet?.wallet) {
        const { trade, disconnect, publicKey } = externalWallet;
        return {
            type: "WALLET",
            email: undefined,
            isConnected: externalWallet.connected,
            walletAddress: publicKey?.toString(),
            exportWallet: undefined,
            disconnect: disconnect,
            transactions: {
                trade: (payload: TradePayload) => trade(payload),
            },
        };
    }
    return {
        type: "NONE",
        isConnected: false,
        walletAddress: "",
        exportWallet: undefined,
        disconnect: undefined,
        transactions: {
            trade: () => Promise.resolve(""),
        },
    };
};
