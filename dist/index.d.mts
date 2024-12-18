import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

interface BoomWalletProviderProps {
    appId: string;
    children: React.ReactNode;
}
declare function BoomWalletProvider({ appId, children }: BoomWalletProviderProps): react_jsx_runtime.JSX.Element;

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
declare const useBoomWallet: () => BoomWallet;

declare function WalletConnectButton({ className }: {
    className?: string;
}): react_jsx_runtime.JSX.Element;

export { BoomWalletProvider, WalletConnectButton, useBoomWallet };
