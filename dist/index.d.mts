import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import react__default from 'react';
import * as _privy_io_react_auth from '@privy-io/react-auth';

interface BoomWalletProviderProps {
    appId: string;
    children: react__default.ReactNode;
}
declare function BoomWalletProvider({ appId, children }: BoomWalletProviderProps): react_jsx_runtime.JSX.Element;

declare const useBoomWallet: () => {
    user: {
        id: string | undefined;
        wallet: _privy_io_react_auth.Wallet | undefined;
        email: _privy_io_react_auth.Email | undefined;
    };
    authenticated: boolean;
    login: (options?: _privy_io_react_auth.LoginModalOptions | react.MouseEvent<any, any>) => void;
    connectWallet: (options?: _privy_io_react_auth.ConnectWalletModalOptions | react.MouseEvent<any, any>) => void;
    logout: () => Promise<void>;
    wallet: _privy_io_react_auth.ConnectedSolanaWallet | undefined;
    signMessage: (message: string) => Promise<{
        signature: string;
        hexSignature: string;
    } | null>;
    signMessageByPrivy: (message: string, uiOptions?: _privy_io_react_auth.SignMessageModalUIOptions, address?: string) => Promise<string>;
};

declare function WalletConnectButton({ onComplete, className, }: {
    onComplete?: () => void;
    className?: string;
}): react_jsx_runtime.JSX.Element;

export { BoomWalletProvider, WalletConnectButton, useBoomWallet };
