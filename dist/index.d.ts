import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

interface BoomWalletProviderProps {
    appId: string;
    clientId: string;
    children: React.ReactNode;
}
declare function BoomWalletProvider({ appId, clientId, children }: BoomWalletProviderProps): react_jsx_runtime.JSX.Element;

type TradePayload = {
    inputTokenAddress: string;
    outputTokenAddress: string;
    amountIn: string;
    slippage?: number;
};
type BoomWallet = {
    privyUserId?: string;
    type: "EMAIL" | "WALLET" | "NONE";
    email?: string;
    isConnected: boolean;
    walletAddress?: string;
    transactions: {
        trade: (payload: TradePayload) => Promise<string>;
    };
    exportWallet?: () => void;
    disconnect?: () => void;
    getAccessToken?: () => Promise<string | null>;
};
declare const useBoomWallet: () => BoomWallet;

declare function WalletConnectButton({ buttonClassName, selectedButtonClassName, hideConnectByWallets, }: {
    buttonClassName?: string;
    selectedButtonClassName?: string;
    hideConnectByWallets?: boolean;
}): react_jsx_runtime.JSX.Element;

declare const useSolanaBalance: (address: string) => {
    balance: number;
    updateBalance: () => Promise<number>;
};

export { BoomWalletProvider, WalletConnectButton, useBoomWallet, useSolanaBalance };
