interface Window {
    Buffer: typeof import("buffer").Buffer;

    solana: {
        isPhantom?: boolean;
        connect: () => Promipnpmse<{ publicKey: PublicKey }>;
        disconnect: () => Promise<void>;
        signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
        signTransaction?: (transaction: any) => Promise<any>;
        signAndSendTransaction(
            transaction: Transaction,
            options?: SendOptions
        ): Promise<{ signature: TransactionSignature }>;
        request: (args: { method: string; params?: any }) => Promise<any>;
        publicKey?: {
            toString: () => string;
        };
    };
}
