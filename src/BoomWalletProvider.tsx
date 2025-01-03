import React, { useCallback, useMemo } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { SOLANA_CHAIN, SOLANA_MAINNET_CLUSTER } from "./constant";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletError } from "@solana/wallet-adapter-base";

export interface BoomWalletProviderProps {
    appId: string;
    clientId: string;
    children: React.ReactNode;
}

export default function BoomWalletProvider({ appId, clientId, children }: BoomWalletProviderProps) {
    const onError = useCallback((error: WalletError) => {
        console.error(error);
    }, []);
    const wallets = useMemo(() => {
        return [new SolflareWalletAdapter()];
    }, []);

    // https://docs.privy.io/guide/react/wallets/external/
    return (
        <PrivyProvider
            appId={appId}
            clientId={clientId}
            config={{
                appearance: {
                    accentColor: "#FCD535",
                    theme: "#ffffff",
                    logo: undefined,
                    landingHeader: "Connect wallet",
                    showWalletLoginFirst: false, // 是否有限展示钱包链接的方式
                    loginMessage: "Welcome to the app",
                    // walletChainType: "solana-only", // 展示支持链的钱包类型
                    // walletList: ["phantom", "metamask", "okx_wallet", "detected_wallets"], // 可以选择的钱包列表 WalletListEntry
                    // 'metamask' | 'coinbase_wallet' | 'rainbow' | 'phantom' | 'zerion' | 'cryptocom' | 'uniswap' | 'okx_wallet' | 'universal_profile'
                },
                // Display email and wallet as login methods
                // loginMethods: ["email", "wallet"],
                loginMethods: ["email"],
                fundingMethodConfig: {
                    moonpay: {
                        useSandbox: true,
                    },
                },
                // externalWallets: {
                //     solana: {
                //         connectors: toSolanaWalletConnectors({
                //             // By default, shouldAutoConnect is enabled
                //             shouldAutoConnect: true,
                //         }),
                //     },
                // },
                embeddedWallets: {
                    createOnLogin: "off",
                    showWalletUIs: false, // Overrides the value of "Add confirmation modals" you set in the Privy Dashboard
                    requireUserPasswordOnCreate: false,
                },
                mfa: {
                    // 多重身份验证（Multi-Factor Authentication）
                    noPromptOnMfaRequired: false,
                },
                supportedChains: [SOLANA_CHAIN],
                solanaClusters: [SOLANA_MAINNET_CLUSTER],
            }}
        >
            <ConnectionProvider endpoint={SOLANA_MAINNET_CLUSTER.rpcUrl}>
                <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
                    {children}
                </WalletProvider>
            </ConnectionProvider>
        </PrivyProvider>
    );
}
