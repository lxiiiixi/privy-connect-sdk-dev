import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { Email, Wallet, LinkedAccountWithMetadata, SupportedSolanaTransaction, SendTransactionModalUIOptions, SolanaTransactionReceipt } from '@privy-io/react-auth';
import { Connection, TransactionSignature } from '@solana/web3.js';
import { SendTransactionOptions } from '@solana/wallet-adapter-base';

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
    linkedAccounts?: LinkedAccountWithMetadata[];
};
type SendTransactionFunction = (transaction: SupportedSolanaTransaction, connection: Connection, uiOptions?: SendTransactionModalUIOptions, transactionOptions?: SendTransactionOptions) => Promise<SolanaTransactionReceipt> | Promise<{
    signature: TransactionSignature;
}>;
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
    sendTransaction?: SendTransactionFunction;
};
declare const useBoomWallet: () => BoomWallet;

declare function WalletConnectButton({ onComplete, className, }: {
    onComplete?: () => void;
    className?: string;
}): react_jsx_runtime.JSX.Element;

declare function useBoomTransactions(): {
    sendBuyTransaction: () => Promise<void>;
};

export { BoomWalletProvider, WalletConnectButton, useBoomTransactions, useBoomWallet };
