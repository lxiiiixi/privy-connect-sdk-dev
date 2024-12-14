import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { SOLANA_CHAIN, SOLANA_MAINNET_CLUSTER } from "./constant";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

export interface BoomWalletProviderProps {
    appId: string;
    children: React.ReactNode;
}

export default function BoomWalletProvider({ appId, children }: BoomWalletProviderProps) {
    const solanaConnectors = toSolanaWalletConnectors({
        // By default, shouldAutoConnect is enabled
        shouldAutoConnect: false,
    });

    // https://docs.privy.io/guide/react/wallets/external/
    return (
        <PrivyProvider
            appId={appId}
            config={{
                appearance: {
                    accentColor: "#FCD535",
                    theme: "#ffffff",
                    logo: undefined,
                    landingHeader: "Connect wallet",
                    showWalletLoginFirst: false, // 是否有限展示钱包链接的方式
                    // loginMessage: "Welcome to the app",
                    walletChainType: "solana-only", // 展示支持链的钱包类型
                    walletList: ["phantom", "metamask", "okx_wallet", "detected_wallets"], // 可以选择的钱包列表 WalletListEntry
                    // 'metamask' | 'coinbase_wallet' | 'rainbow' | 'phantom' | 'zerion' | 'cryptocom' | 'uniswap' | 'okx_wallet' | 'universal_profile'
                },
                // Display email and wallet as login methods
                loginMethods: ["email", "wallet"],
                fundingMethodConfig: {
                    moonpay: {
                        useSandbox: true,
                    },
                },
                externalWallets: {
                    solana: {
                        connectors: solanaConnectors,
                    },
                },
                embeddedWallets: {
                    // createOnLogin: "all-users",
                    // showWalletUIs: false,
                    // createOnLogin: 'off',
                    // requireUserPasswordOnCreate: false,
                },
                mfa: {
                    noPromptOnMfaRequired: false,
                },
                supportedChains: [SOLANA_CHAIN],
                solanaClusters: [SOLANA_MAINNET_CLUSTER],
            }}
        >
            {children}
        </PrivyProvider>
    );
}
