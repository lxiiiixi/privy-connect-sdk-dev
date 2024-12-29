import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { SOLANA_MAINNET_RPC_URL } from "./constant";
import { logger } from "./utils";

export const connection = new Connection(SOLANA_MAINNET_RPC_URL, "confirmed");

// TODO：余额的获取是否需要定时更新？

export const useSolanaBalance = (address: string) => {
    const [balance, setBalance] = useState(0);

    const updateBalance = async () => {
        try {
            const publicKey = new PublicKey(address);
            const balance = await connection.getBalance(publicKey);
            // 转换为 SOL（1 SOL = 10^9 Lamports）
            logger.log(`Balance of ${address}: ${balance / 1e9} SOL`);
            return balance;
        } catch (error) {
            logger.error("Failed to get balance:", error);
            return 0;
        }
    };

    useEffect(() => {
        if (!!address) {
            updateBalance().then(setBalance);
        }
    }, [address]);

    return { balance, updateBalance };
};

export const getTokenBalance = async (tokenMintAddress?: string, walletAddress?: string) => {
    if (!tokenMintAddress || !walletAddress) {
        logger.warn("tokenMintAddress or walletAddress is not provided");
        return null;
    }

    const userPublicKey = new PublicKey(walletAddress);
    const mintPublicKey = new PublicKey(tokenMintAddress);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
        mint: mintPublicKey,
    });

    // 获取 Token 账户中的余额
    if (tokenAccounts.value.length > 0) {
        const tokenAccount = tokenAccounts.value[0]; // 获取第一个匹配的代币账户
        const balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
        return balance;
    } else {
        logger.warn("User does not own this token: " + tokenMintAddress);
        return null;
    }
};

export const useTokenBalance = (tokenMintAddress?: string, walletAddress?: string) => {
    const [balance, setBalance] = useState(0);

    const updateBalance = async () => {
        if (!!tokenMintAddress && !!walletAddress) {
            const balance = await getTokenBalance(tokenMintAddress, walletAddress);
            setBalance(balance);
        }
    };

    useEffect(() => {
        updateBalance();
    }, [tokenMintAddress, walletAddress]);

    return { balance, updateBalance };
};
