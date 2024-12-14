export const INJECTED_WALLET_CLIENT = ["metamask", "phantom"];

export const SOLANA_MAINNET_RPC_URL =
    "https://rpc-mainnet.solanatracker.io/?api_key=72759b5d-df4b-461b-9a1d-4ab2abc30ad4";
export const SOLANA_MAINNET_CLUSTER = {
    name: "mainnet-beta" as const,
    rpcUrl: SOLANA_MAINNET_RPC_URL,
};

export const SOLANA_CHAIN = {
    id: 101,
    name: "Solana",
    network: "mainnet-beta",
    nativeCurrency: {
        name: "Solana",
        symbol: "SOL",
        decimals: 9,
    },
    testnet: false,
    rpcUrls: {
        default: {
            http: [SOLANA_MAINNET_CLUSTER.rpcUrl],
            webSocket: [SOLANA_MAINNET_CLUSTER.rpcUrl],
        },
    },
} as const;
