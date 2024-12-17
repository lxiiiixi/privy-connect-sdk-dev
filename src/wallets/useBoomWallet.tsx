import { useExternalWallet } from "./useExternalWallet";
import { usePrivyEmbeddedWallet } from "./usePrivyEmbeddedWallet";

export const useBoomWallet: () => any = () => {
    const privyEmbeddedWallet = usePrivyEmbeddedWallet();
    const externalWallet = useExternalWallet();
    if (privyEmbeddedWallet.user.wallet) {
        return {
            type: "EMAIL",
            isConnected: privyEmbeddedWallet.authenticated,
            walletAddress: privyEmbeddedWallet.user.wallet?.address,
            exportWallet: privyEmbeddedWallet.exportWallet,
            disconnect: privyEmbeddedWallet.logout,
            sendTransactions: privyEmbeddedWallet.sendTransactions,
        };
    }
    if (externalWallet?.wallet) {
        return {
            type: "WALLET",
            isConnected: externalWallet.connected,
            walletAddress: externalWallet.publicKey?.toString(),
            exportWallet: undefined,
            disconnect: externalWallet.disconnect,
            sendTransactions: externalWallet.sendTransactions,
        };
    }
    return null;
};