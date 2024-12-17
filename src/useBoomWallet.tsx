import {
    ConnectedSolanaWallet,
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
import { useEffect, useMemo } from "react";
import bs58 from "bs58";
import { Connection, TransactionSignature } from "@solana/web3.js";
import { SendTransactionOptions, WalletName } from "@solana/wallet-adapter-base";
import { useWallet, Wallet as AdapterWallet } from "@solana/wallet-adapter-react";

export type LoginType = "EMAIL" | "WALLET";
export type User = {
    id?: string; // 用户在 privy 的唯一 id
    email?: Email; // 邮箱登录时才有，钱包登录时为 undefined
    wallet?: Wallet | ConnectedSolanaWallet; // 用户最新的链接的钱包，也会是用于签名的钱包。
    linkedAccounts?: LinkedAccountWithMetadata[]; // 用户关联的钱包
};

export type SendTransactionFunction =
    | ((
          transaction: SupportedSolanaTransaction,
          connection: Connection,
          uiOptions?: SendTransactionModalUIOptions,
          transactionOptions?: SendTransactionOptions
      ) => Promise<SolanaTransactionReceipt> | Promise<{ signature: TransactionSignature }>)
    | ((
          transaction: SupportedSolanaTransaction,
          connection: Connection,
          options?: SendTransactionOptions
      ) => Promise<TransactionSignature>)
    | undefined;

export type PrivyWallet = {
    user: User;
    authenticated: boolean; // 是否通过了登录授权
    login: () => void; // 登录
    logout: () => void; // 登出
    loginType: LoginType; // 用户的登录类型
    exportWallet?: () => void; // 导出钱包
    signMessage: (message: string) => Promise<{ signature: string; hexSignature: string } | null>; // 签名
    sendTransaction?: any; // 发送交易
};

// https://docs.privy.io/guide/react/wallets/usage/solana/
type ButtonState = "connecting" | "connected" | "disconnecting" | "has-wallet" | "no-wallet";
type ExternalWalletType = {
    buttonState: ButtonState;
    label: string;
    wallet: AdapterWallet;
    wallets: AdapterWallet[];
    select: (walletName: WalletName | null) => void;
    disconnect: () => void;
};
export const useExternalWallet: () => ExternalWalletType | null = () => {
    const {
        connected,
        connecting,
        disconnect,
        disconnecting,
        publicKey,
        select,
        wallet,
        wallets,
        sendTransaction,
    } = useWallet();
    // connect 和 select 的区别？

    console.log(
        "🚀 ~ CustomWalletButton ~ connect:",
        connected,
        publicKey,
        publicKey?.toString(),
        wallet,
        wallets
    );

    const { buttonState, label } = useMemo(() => {
        let buttonState: ButtonState;
        if (connecting) {
            buttonState = "connecting";
        } else if (connected) {
            buttonState = "connected";
        } else if (disconnecting) {
            buttonState = "disconnecting";
        } else if (wallet) {
            buttonState = "has-wallet";
        } else {
            buttonState = "no-wallet";
        }
        let label;
        switch (buttonState) {
            case "connected":
                label = "Disconnect";
                break;
            case "connecting":
                label = "Connecting";
                break;
            case "disconnecting":
                label = "Disconnecting";
                break;
            case "has-wallet":
                label = "Connect";
                break;
            case "no-wallet":
                label = "Select Wallet";
                break;
        }
        return { buttonState, label };
    }, [connecting, connected, disconnecting, wallet]);

    if (!wallet) return null;

    return { buttonState, label, wallets, select, wallet, disconnect };
};

const usePrivyEmbeddedWallet: () => PrivyWallet = () => {
    const { user, ready: readyUser, authenticated, login, connectWallet, logout } = usePrivy();
    const { sendSolanaTransaction } = useSendSolanaTransaction();

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
    console.log(
        "solanaWallets",
        userEmbeddedWallet,
        user?.wallet,
        readySolanaWallets,
        authenticated,
        userEmbeddedWallet?.isConnected()
    );

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
        console.log("signMessage success", base58Signature, hexSignature);

        return {
            signature: base58Signature, // base58 格式
            hexSignature, // hex 格式
        };
    };

    return {
        user: {
            id: user?.id,
            wallet: userEmbeddedWallet, //这个时候 user?.wallet 和 userEmbeddedWallet 应该是一样的
            email: user?.email,
            linkedAccounts: user?.linkedAccounts,
        },
        loginType: "EMAIL" as LoginType,
        signMessage,
        sendTransaction: userEmbeddedWallet?.sendTransaction,
        // sendTransaction: sendSolanaTransaction,
        exportWallet: exportWallet,
        authenticated,
        login,
        logout,
    };
};

export const useBoomWallet: () => any = () => {
    const privyEmbeddedWallet = usePrivyEmbeddedWallet();
    const externalWallet = useExternalWallet();
    if (privyEmbeddedWallet.user.wallet) {
        return {
            type: "EMAIL",
            isConnected: privyEmbeddedWallet.authenticated,
            walletAddress: privyEmbeddedWallet.user.wallet?.address,
            exportWallet: privyEmbeddedWallet.exportWallet,
            disconnect: privyEmbeddedWallet.logout,
        };
    }
    if (externalWallet?.wallet) {
        return {
            type: "WALLET",
            isConnected: externalWallet.buttonState === "connected",
            walletAddress: externalWallet.wallets[0]?.adapter.publicKey?.toString(),
            exportWallet: undefined,
            disconnect: externalWallet.disconnect,
        };
    }
    return null;
};

export const useBoomWalletDelegate = () => {
    const privyEmbeddedWallet = usePrivyEmbeddedWallet();
    const wallet = privyEmbeddedWallet?.user?.wallet;

    const { delegateWallet, revokeWallets } = useDelegatedActions();

    // Find the embedded wallet to delegate from the array of the user's wallets
    const walletToDelegate = wallet?.walletClientType === "privy" ? wallet : undefined;

    // Check if the wallet to delegate by inspecting the user's linked accounts
    const isAlreadyDelegated = !!privyEmbeddedWallet.user?.linkedAccounts?.find(
        (account: LinkedAccountWithMetadata): account is WalletWithMetadata =>
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
