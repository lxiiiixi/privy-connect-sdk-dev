import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

interface BoomWalletProviderProps {
    appId: string;
    children: React.ReactNode;
}
declare function BoomWalletProvider({ appId, children }: BoomWalletProviderProps): react_jsx_runtime.JSX.Element;

declare const useBoomWallet: () => any;

declare function WalletConnectButton({ onComplete, className, }: {
    onComplete?: () => void;
    className?: string;
}): react_jsx_runtime.JSX.Element;

declare function useBoomTransactions(): {
    sendBuyTransaction: () => Promise<void>;
};

export { BoomWalletProvider, WalletConnectButton, useBoomTransactions, useBoomWallet };
