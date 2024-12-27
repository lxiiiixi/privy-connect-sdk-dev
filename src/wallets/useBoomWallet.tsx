import { useExternalWallet } from "./useExternalWallet";
import { useBoomWalletDelegate, usePrivyEmbeddedWallet } from "./usePrivyEmbeddedWallet";

export type TradePayload = {
    inputTokenAddress: string; // 买
    outputTokenAddress: string; // 卖
    amountIn: string; // 需要精度处理之后的数据
    slippage?: number; // 滑点，比如 30、50
};

type BoomWallet = {
    privyUserId?: string; // 用户id（只有邮箱登陆的时候才有）
    type: "EMAIL" | "WALLET" | "NONE"; // 登录类型,NONE时表示未登录
    email?: string; // 邮箱（邮箱登录时才有）
    isConnected: boolean; // 是否连接
    walletAddress?: string; // 用户的钱包地址
    transactions: {
        trade: (payload: TradePayload) => Promise<string>; // 执行交易方法
    };
    exportWallet?: () => void; // 导出钱包（邮箱登录时才需要导出）
    disconnect?: () => void; // 断开连接
    getAccessToken?: () => Promise<string | null>; // 获取用户的 access token（邮箱登陆的情况下才用，有的地方传给后端做一些接口校验使用）
    // 代理调用的许可操作只有针对登陆 type 为 EMAIL 时才需要
    delegateAllowanceStatus?: "ALLOWED" | "NOT_ALLOWED"; // 用户这个钱包代理调用的状态（）
    onDelegate?: () => Promise<void>; // 执行代理调用操作
    onRevoke?: () => Promise<void>; // 撤销代理调用
    signMessage: (message: string) => Promise<string | null>; // 签名
};

export const useBoomWallet: () => BoomWallet = () => {
    const privyEmbeddedWallet = usePrivyEmbeddedWallet();
    const externalWallet = useExternalWallet();
    const { delegateAllowanceStatus, onDelegate, onRevoke } = useBoomWalletDelegate();

    if (privyEmbeddedWallet.user.wallet) {
        const { trade, logout, exportWallet, user, authenticated, getAccessToken, signMessage } =
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
            delegateAllowanceStatus,
            onDelegate,
            onRevoke,
            transactions: {
                trade: (payload: TradePayload) => trade(payload),
            },
            signMessage,
        };
    }
    if (externalWallet?.wallet) {
        const { trade, disconnect, publicKey, signWalletMessage } = externalWallet;
        return {
            privyUserId: undefined,
            type: "WALLET",
            email: undefined,
            isConnected: externalWallet.connected,
            walletAddress: publicKey?.toString(),
            exportWallet: undefined,
            disconnect: disconnect,
            getAccessToken: undefined,
            delegateAllowanceStatus: undefined,
            onRevoke: undefined,
            onDelegate: undefined,
            transactions: {
                trade: (payload: TradePayload) => trade(payload),
            },
            signMessage: signWalletMessage,
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
        signMessage: message => Promise.resolve(null),
    };
};
