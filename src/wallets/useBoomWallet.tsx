import { useExternalWallet } from "./useExternalWallet";
import { usePrivyEmbeddedWallet } from "./usePrivyEmbeddedWallet";

type BoomWallet = {
    type: "EMAIL" | "WALLET" | "NONE";
    email?: string;
    isConnected: boolean;
    walletAddress?: string;
    transactions: {
        buy: () => void;
    };
    exportWallet?: () => void;
    disconnect?: () => void;
};

export const useBoomWallet: () => BoomWallet = () => {
    const privyEmbeddedWallet = usePrivyEmbeddedWallet();
    const externalWallet = useExternalWallet();
    if (privyEmbeddedWallet.user.wallet) {
        const { buy, logout, exportWallet, user, authenticated } = privyEmbeddedWallet;
        return {
            type: "EMAIL",
            email: user.email?.address,
            isConnected: authenticated,
            walletAddress: user.wallet?.address,
            exportWallet: exportWallet,
            disconnect: logout,
            transactions: {
                buy: () => buy(),
            },
        };
    }
    if (externalWallet?.wallet) {
        const { buy, disconnect, publicKey } = externalWallet;
        return {
            type: "WALLET",
            email: undefined,
            isConnected: externalWallet.connected,
            walletAddress: publicKey?.toString(),
            exportWallet: undefined,
            disconnect: disconnect,
            transactions: {
                buy: () => externalWallet.buy(),
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
            buy: () => Promise.resolve(""),
        },
    };
};
