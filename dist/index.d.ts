import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { Email, Wallet } from '@privy-io/react-auth';

interface BoomWalletProviderProps {
    appId: string;
    children: React.ReactNode;
}
declare function BoomWalletProvider({ appId, children }: BoomWalletProviderProps): react_jsx_runtime.JSX.Element;

type LoginType = "EMAIL" | "WALLET";
type User = {
    id?: string;
    email?: Email;
    wallet?: Wallet;
};
type BoomWallet = {
    user: User;
    authenticated: boolean;
    login: () => void;
    logout: () => void;
    loginType: LoginType;
    exportWallet?: () => void;
    signMessage: (message: string) => Promise<{
        signature: string;
        hexSignature: string;
    } | null>;
};
declare const useBoomWallet: () => BoomWallet;

declare function WalletConnectButton({ onComplete, className, }: {
    onComplete?: () => void;
    className?: string;
}): react_jsx_runtime.JSX.Element;

export { BoomWalletProvider, WalletConnectButton, useBoomWallet };
