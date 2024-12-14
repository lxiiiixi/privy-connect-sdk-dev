import { addRpcUrlOverrideToChain, PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

export const solanaDevnet = {
    blockExplorers: {
        default: {
            name: "Explorer",
            url: "https://solscan.io",
        },
    },
    id: 103,
    name: "Solana Devnet",
    nativeCurrency: {
        decimals: 9,
        name: "Devnet SOL",
        symbol: "SOL",
    },
    rpcUrls: {
        default: {
            http: ["https://api.devnet.solana.com"],
        },
    },
    sourceId: undefined,
    testnet: true,
    custom: {
        chainType: "solana",
    },
    formatters: undefined,
} as const; // 使用 as const 来保持对象的只读特性

const LoginButton = () => {
    const { login, user, logout } = usePrivy();
    console.log("🚀 ~ LoginButton ~ user:", user);
    return (
        <>
            <button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                onClick={login}
            >
                Log in
            </button>
            <div onClick={logout}>Logout</div>
        </>
    );
};
const solanaConnectors = toSolanaWalletConnectors({
    // By default, shouldAutoConnect is enabled
    shouldAutoConnect: true,
});

export default function Login() {
    const solanaDevnetOverride = addRpcUrlOverrideToChain(
        solanaDevnet,
        "https://api.devnet.solana.com"
    );

    return (
        <div className="bg-pink-50 p-4 rounded-lg">
            <PrivyProvider
                appId="cm485ehd706mjjqspwtpqlo74"
                config={{
                    appearance: {
                        accentColor: "#6A6FF5",
                        theme: "#fbe9e9",
                        logo: undefined,
                        // logo: (
                        //   <img src="https://auth.privy.io/logos/privy-logo.png" alt="privy-logo" style={{ width: '10px' }} />
                        // ),
                        // logo: 'https://auth.privy.io/logos/privy-logo.png',
                        landingHeader: "Connect wallet",
                        showWalletLoginFirst: false, // 是否有限展示钱包链接的方式
                        loginMessage: "Welcome to the app",
                        walletChainType: "solana-only", // 展示支持链的钱包类型
                        walletList: ["phantom", "metamask", "okx_wallet"], // 可以选择的钱包列表 WalletListEntry
                    },
                    // Display email and wallet as login methods
                    loginMethods: ["email", "wallet", "google", "apple", "github", "discord"],
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
                    // Create embedded wallets for users who don't have a wallet
                    embeddedWallets: {
                        // createOnLogin: "all-users",
                        // createOnLogin: 'off',
                        // requireUserPasswordOnCreate: false,
                    },
                    mfa: {
                        noPromptOnMfaRequired: false,
                    },
                    supportedChains: [solanaDevnetOverride],
                }}
            >
                <LoginButton />
            </PrivyProvider>
        </div>
    );
}
