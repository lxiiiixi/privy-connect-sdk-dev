import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { TokenAmount } from '@solana/web3.js';

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
    delegateAllowanceStatus?: "ALLOWED" | "NOT_ALLOWED";
    onDelegate?: () => Promise<void>;
    onRevoke?: () => Promise<void>;
    signMessage: (message: string) => Promise<string | null>;
};
declare const useBoomWallet: () => BoomWallet;

declare function WalletConnectButton({ buttonClassName, selectedButtonClassName, hideConnectByWallets, }: {
    buttonClassName?: string;
    selectedButtonClassName?: string;
    hideConnectByWallets?: boolean;
}): react_jsx_runtime.JSX.Element;

declare function ConnectWalletModal({ isOpen, onClose, hideConnectByWallets, }: {
    isOpen: boolean;
    onClose: () => void;
    hideConnectByWallets?: boolean;
}): react_jsx_runtime.JSX.Element;

type BalanceTokenAmount = TokenAmount & {
    tokenAddress: string;
};
declare const useSolanaBalance: (address: string) => {
    balance: number;
    updateBalance: () => Promise<number>;
};
declare const getTokenBalance: (tokenMintAddress?: string, walletAddress?: string) => Promise<BalanceTokenAmount | null>;
declare const getAllAssociatedTokens: (userAddress: string) => Promise<{
    tokenAddress: string;
    amount: string;
    decimals: number;
    uiAmount: number | null;
    uiAmountString?: string;
}[]>;

export { type BalanceTokenAmount, BoomWalletProvider, ConnectWalletModal, WalletConnectButton, getAllAssociatedTokens, getTokenBalance, useBoomWallet, useSolanaBalance };
