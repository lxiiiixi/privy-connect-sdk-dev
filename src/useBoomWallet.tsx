import {
    usePrivy,
    useSendTransaction,
    useSignMessage,
    useSolanaWallets,
} from "@privy-io/react-auth";
import { useEffect } from "react";
import { INJECTED_WALLET_CLIENT } from "./constant";
import bs58 from "bs58";

export const useBoomWallet = () => {
    const {
        user,
        ready: readyUser,
        authenticated,
        login,
        connectWallet,
        logout,
        signMessage: signMessageByPrivy,
    } = usePrivy();
    const { sendTransaction } = useSendTransaction();

    console.log(user);

    // useSolanaWallets 目前只支持 embeddedWallet
    const {
        ready: readySolanaWallets,
        wallets: embeddedSolanaWallets,
        createWallet,
        exportWallet,
    } = useSolanaWallets();

    const embeddedWallet = embeddedSolanaWallets.find(
        wallet => wallet.walletClientType === "privy"
    );
    const externalWallet = embeddedSolanaWallets.find(wallet =>
        INJECTED_WALLET_CLIENT.includes(wallet.walletClientType)
    );
    console.log("solanaWallets", embeddedSolanaWallets, embeddedWallet);

    const userSolanaWallet = externalWallet || embeddedWallet;

    // console.log(authenticated, readySolanaWallets, userSolanaWallet, user);

    useEffect(() => {
        if (!authenticated || !readyUser) return; // 登陆之前不创建
        if (userSolanaWallet || user?.wallet) return; // 已经有钱包不创建
        try {
            console.log("createWallet");
            createWallet();
        } catch (error) {
            console.warn(error);
        }
    }, [embeddedWallet, authenticated]);

    // 目前还没测试链接外部钱包的情况
    const signMessage = async (message: string) => {
        const messageBuffer = new TextEncoder().encode(message);
        const signature = await embeddedWallet?.signMessage(messageBuffer);
        console.log("🚀 ~ signMessage ~ signature:", signature);
        if (!signature) return null;
        const base58Signature = bs58.encode(signature);
        const hexSignature = Buffer.from(signature).toString("hex");
        return {
            signature: base58Signature, // base58 格式
            hexSignature, // hex 格式
        };
    };
    // TODO: 如何更明确具体的区分两种钱包？
    // 1. 邮箱登录 => 自己创建
    // 2. 用户自己的外部钱包
    return {
        user: {
            id: user?.id,
            wallet: user?.wallet, // 当前用户默认的钱包
            email: user?.email,
        },
        authenticated,
        login,
        connectWallet,
        logout,
        wallet: userSolanaWallet,
        signMessage,
        signMessageByPrivy,
    };
};
