import { useExternalWallet } from "./useExternalWallet";
import { usePrivyEmbeddedWallet } from "./usePrivyEmbeddedWallet";

export type TradePayload = {
    inputTokenAddress: string; // 买
    outputTokenAddress: string; // 卖
    amountIn: string; // 需要精度处理之后的数据
    slippage?: number;
};

type BoomWallet = {
    privyUserId?: string;
    type: "EMAIL" | "WALLET" | "NONE"; // 登录类型,NONE时表示未登录
    email?: string; // 邮箱（邮箱登录时才有）
    isConnected: boolean;
    walletAddress?: string;
    transactions: {
        trade: (payload: TradePayload) => Promise<string>;
    };
    exportWallet?: () => void;
    disconnect?: () => void;
    getAccessToken?: () => Promise<string | null>;
};

export const useBoomWallet: () => BoomWallet = () => {
    const privyEmbeddedWallet = usePrivyEmbeddedWallet();
    const externalWallet = useExternalWallet();
    if (privyEmbeddedWallet.user.wallet) {
        const { trade, logout, exportWallet, user, authenticated, getAccessToken } =
            privyEmbeddedWallet;
        return {
            privyUserId: user.id,
            type: "EMAIL",
            email: user.email?.address,
            isConnected: authenticated,
            walletAddress: user.wallet?.address,
            exportWallet: exportWallet,
            disconnect: logout,
            getAccessToken,
            transactions: {
                trade: (payload: TradePayload) => trade(payload),
            },
        };
    }
    if (externalWallet?.wallet) {
        const { trade, disconnect, publicKey } = externalWallet;
        return {
            privyUserId: undefined,
            type: "WALLET",
            email: undefined,
            isConnected: externalWallet.connected,
            walletAddress: publicKey?.toString(),
            exportWallet: undefined,
            disconnect: disconnect,
            getAccessToken: undefined,
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
