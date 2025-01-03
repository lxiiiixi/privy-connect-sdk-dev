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
import { connection } from "../solana";
import API_REQUEST from "../request";
import { TradePayload } from "./useBoomWallet";
import { logger } from "../utils";
import { encodeBase64 } from "tweetnacl-util";

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
    signMessage: (message: string) => Promise<string | null>; // 签名
    sendTransaction?: any; // 发送交易
    trade: any; // 购买 usdc
    getAccessToken?: () => Promise<string | null>;
};

export const usePrivyEmbeddedWallet: () => PrivyWallet = () => {
    const {
        user,
        ready: readyUser,
        authenticated,
        login,
        connectWallet,
        logout,
        getAccessToken,
    } = usePrivy();

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
            logger.log("CreateWallet");
            createWallet();
        } catch (error) {
            logger.warn(error);
        }
    }, [userEmbeddedWallet, authenticated]);

    // useEffect(() => {
    //     const getToken = async () => {
    //         const accessToken = await getAccessToken();
    //         logger.log("accessToken", accessToken);
    //     };
    //     getToken();
    // }, []);

    logger.log(
        "solanaWallets",
        user,
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
            logger.warn("Failed to sign message");
            return null;
        }
        // const base58Signature = bs58.encode(signature); // base58 格式
        // const hexSignature = Buffer.from(signature).toString("hex"); // hex 格式
        const base64Signature = encodeBase64(signature);

        return base64Signature;
    };

    const trade = async (payload: TradePayload) => {
        const { inputTokenAddress, outputTokenAddress, amountIn, slippage } = payload;

        if (!userEmbeddedWallet?.address) return "";
        const accessToken = await getAccessToken();
        const res = await API_REQUEST.sendDelegateTransaction(
            {
                userPublicKey: userEmbeddedWallet.address,
                inputToken: inputTokenAddress,
                outputToken: outputTokenAddress,
                amount: amountIn,
                slippage: slippage || 50,
            },
            accessToken ?? undefined
        );
        logger.log(res);
        return res;
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
        trade,
        getAccessToken,
    };
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
        logger.log(walletToDelegate, isAlreadyDelegated);

        if (isAlreadyDelegated) return; // Button is disabled to prevent this case
        if (walletToDelegate && walletToDelegate.address) {
            logger.log(isAlreadyDelegated, walletToDelegate.address);

            await delegateWallet({ address: walletToDelegate.address, chainType: "solana" });
        }
    };

    const onRevoke = async () => {
        if (!isAlreadyDelegated) return; // Button is disabled to prevent this case
        await revokeWallets();
    };

    const option = isDisplay ? (isAlreadyDelegated ? "REVOKE" : "DELEGATE") : null;

    const delegateAllowanceStatus: "ALLOWED" | "NOT_ALLOWED" = isAlreadyDelegated
        ? "ALLOWED"
        : "NOT_ALLOWED";

    return {
        option,
        delegateAllowanceStatus,
        onDelegate,
        onRevoke,
    };
};
