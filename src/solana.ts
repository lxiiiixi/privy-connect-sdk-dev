import { Connection, PublicKey, TokenAmount } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { SOLANA_MAINNET_RPC_URL } from "./constant";
import { logger } from "./utils";

export const connection = new Connection(SOLANA_MAINNET_RPC_URL, "confirmed");

export type BalanceTokenAmount = TokenAmount & {
    tokenAddress: string;
};

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

export const getTokenBalance: (
    tokenMintAddress?: string,
    walletAddress?: string
) => Promise<BalanceTokenAmount | null> = async (
    tokenMintAddress?: string,
    walletAddress?: string
) => {
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
        const balance: BalanceTokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;
        return { ...balance, tokenAddress: tokenMintAddress };
    } else {
        logger.warn("User does not own this token: " + tokenMintAddress);
        return null;
    }
};

export const useTokenBalance = (tokenMintAddress?: string, walletAddress?: string) => {
    const [balance, setBalance] = useState<BalanceTokenAmount | null>(null);

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

/** Address of the SPL Token program */
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
/** Address of the SPL Token 2022 program */
export const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

export const getAllAssociatedTokens = async (userAddress: string) => {
    const userPublicKey = new PublicKey(userAddress);

    // 获取所有与用户地址关联的 Token 账户
    const [tokenAccounts, token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(userPublicKey, {
            programId: TOKEN_PROGRAM_ID,
        }),
        connection.getParsedTokenAccountsByOwner(userPublicKey, {
            programId: TOKEN_2022_PROGRAM_ID,
        }),
    ]);

    const result = [];

    for (const { pubkey, account } of [...tokenAccounts.value, ...token2022Accounts.value]) {
        const parsedData = account.data.parsed.info;

        // 获取代币的 mint 地址
        const tokenMint: string = parsedData.mint;
        const tokenAmount: BalanceTokenAmount = parsedData.tokenAmount;

        result.push({
            ...tokenAmount,
            tokenAddress: tokenMint, // 代币 mint 地址
        });
    }

    return result;
};
