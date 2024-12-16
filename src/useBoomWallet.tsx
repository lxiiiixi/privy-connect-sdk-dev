import {
    Email,
    LinkedAccountWithMetadata,
    SendTransactionModalUIOptions,
    SolanaTransactionReceipt,
    SupportedSolanaTransaction,
    useDelegatedActions,
    usePrivy,
    useSendSolanaTransaction,
    useSignMessage,
    useSolanaWallets,
    Wallet,
    WalletWithMetadata,
} from "@privy-io/react-auth";
import { useEffect } from "react";
import bs58 from "bs58";
import { Connection, TransactionSignature } from "@solana/web3.js";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";

export type LoginType = "EMAIL" | "WALLET";
export type User = {
    id?: string; // 用户在 privy 的唯一 id
    email?: Email; // 邮箱登录时才有，钱包登录时为 undefined
    wallet?: Wallet; // 用户最新的链接的钱包，也会是用于签名的钱包。
    linkedAccounts?: LinkedAccountWithMetadata[]; // 用户关联的钱包
};

export type SendTransactionFunction = (
    transaction: SupportedSolanaTransaction,
    connection: Connection,
    uiOptions?: SendTransactionModalUIOptions,
    transactionOptions?: SendTransactionOptions
) => Promise<SolanaTransactionReceipt> | Promise<{ signature: TransactionSignature }>;
export type BoomWallet = {
    user: User;
    authenticated: boolean; // 是否通过了登录授权
    login: () => void; // 登录
    logout: () => void; // 登出
    loginType: LoginType; // 用户的登录类型
    exportWallet?: () => void; // 导出钱包
    signMessage: (message: string) => Promise<{ signature: string; hexSignature: string } | null>; // 签名
    sendTransaction?: SendTransactionFunction; // 发送交易
};

// https://docs.privy.io/guide/react/wallets/usage/solana/

export const useBoomWallet: () => BoomWallet = () => {
    const { user, ready: readyUser, authenticated, login, connectWallet, logout } = usePrivy();
    const { sendSolanaTransaction } = useSendSolanaTransaction();

    const { signMessage: signMessageByPrivy } = useSignMessage(); // 只能签名 embeddedWallet

    // useSolanaWallets 目前只支持 embeddedWallet
    // 对我们目前的功能来说就是通过邮箱登录时的钱包
    const {
        ready: readySolanaWallets,
        wallets: embeddedSolanaWallets,
        createWallet,
        exportWallet,
    } = useSolanaWallets();
    const userEmbeddedWallet = embeddedSolanaWallets.find(
        wallet => wallet.walletClientType === "privy"
    );

    // 很关键的点在于如何精准的界定一个钱包是自己的外部钱包还是邮箱创建的钱包
    // TODO: 如何更明确具体的区分两种钱包？
    const loginType = user?.email ? "EMAIL" : "WALLET";

    useEffect(() => {
        if (!authenticated || !readyUser) return; // 登陆之前不创建
        if (userEmbeddedWallet || user?.wallet) return; // 已经有钱包不创建
        if (loginType !== "EMAIL") return; // 邮箱登录时才创建
        try {
            console.log("CreateWallet");
            createWallet();
        } catch (error) {
            console.warn(error);
        }
    }, [userEmbeddedWallet, authenticated]);

    console.log("user", user);
    console.log("solanaWallets", userEmbeddedWallet, user?.wallet);

    let diff = undefined;
    if (loginType === "EMAIL") {
        // 邮箱登录时

        // 目前还没测试链接外部钱包的情况
        const signMessage = async (message: string) => {
            const messageBuffer = new TextEncoder().encode(message);
            const signature = await userEmbeddedWallet?.signMessage(messageBuffer);
            if (!signature) {
                console.warn("Failed to sign message");
                return null;
            }
            const base58Signature = bs58.encode(signature);
            const hexSignature = Buffer.from(signature).toString("hex");
            return {
                signature: base58Signature, // base58 格式
                hexSignature, // hex 格式
            };
        };

        diff = {
            user: {
                id: user?.id,
                wallet: user?.wallet, //这个时候 user?.wallet 和 userEmbeddedWallet 应该是一样的
                email: user?.email,
                linkedAccounts: user?.linkedAccounts,
            },
            loginType: "EMAIL" as LoginType,
            signMessage,
            sendTransaction: sendSolanaTransaction,
            exportWallet: exportWallet,
        };
    } else {
        // 钱包登录时
        diff = {
            user: {
                id: user?.id,
                wallet: user?.wallet,
                email: user?.email, // 钱包登录时 email 为 undefined
                linkedAccounts: user?.linkedAccounts,
            },
            loginType: "WALLET" as LoginType,
            signMessage: (message: string) => {
                console.warn("signMessage not supported");
                return Promise.resolve(null);
            }, //todo
            exportWallet: undefined,
            sendTransaction: window?.solana?.signAndSendTransaction,
        };
    }

    return {
        // 公共属性和方法
        authenticated,
        login,
        logout,
        ...diff,
    };
};

export const useBoomWalletDelegate = () => {
    const { user } = useBoomWallet();
    const wallet = user?.wallet;

    const { delegateWallet, revokeWallets } = useDelegatedActions();

    // Find the embedded wallet to delegate from the array of the user's wallets
    const walletToDelegate = wallet?.walletClientType === "privy" ? wallet : undefined;

    // Check if the wallet to delegate by inspecting the user's linked accounts
    const isAlreadyDelegated = !!user?.linkedAccounts?.find(
        (account): account is WalletWithMetadata =>
            Boolean(account.type === "wallet" && account.address && account.delegated)
    );

    const isDisplay = !!walletToDelegate; // 准备好了并且有可以代理调用的钱包

    const onDelegate = async () => {
        console.log(walletToDelegate, isAlreadyDelegated);

        if (isAlreadyDelegated) return; // Button is disabled to prevent this case
        if (walletToDelegate && walletToDelegate.address) {
            console.log(isAlreadyDelegated, walletToDelegate.address);

            await delegateWallet({ address: walletToDelegate.address, chainType: "solana" });
        }
    };

    const onRevoke = async () => {
        if (!isAlreadyDelegated) return; // Button is disabled to prevent this case
        await revokeWallets();
    };

    const option = isDisplay ? (isAlreadyDelegated ? "REVOKE" : "DELEGATE") : null;

    return {
        option,
        onDelegate,
        onRevoke,
    };
};
