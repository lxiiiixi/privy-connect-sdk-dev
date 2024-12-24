import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { SOLANA_MAINNET_RPC_URL } from "./constant";
import { logger } from "./utils";

export const connection = new Connection(SOLANA_MAINNET_RPC_URL, "confirmed");

// TODO：余额的获取是否需要定时更新？

export const useSolanaBalance = (address: string) => {
    const [balance, setBalance] = useState(0);

    const fetchUpdateBalance = async () => {
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
            fetchUpdateBalance().then(setBalance);
        }
    }, [address]);

    return { balance, fetchUpdateBalance };
};
