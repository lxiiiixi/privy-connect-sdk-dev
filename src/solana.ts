import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { SOLANA_MAINNET_RPC_URL } from "./constant";

export const connection = new Connection(SOLANA_MAINNET_RPC_URL, "confirmed");

export const useSolanaBalance = (address: string) => {
    const [balance, setBalance] = useState(0);

    const getBalance = async (address: string) => {
        try {
            const publicKey = new PublicKey(address);
            const balance = await connection.getBalance(publicKey);
            // 转换为 SOL（1 SOL = 10^9 Lamports）
            // console.log(`Balance of ${address}: ${balance / 1e9} SOL`);
            return balance;
        } catch (error) {
            console.error("Failed to get balance:", error);
            return 0;
        }
    };

    useEffect(() => {
        if (!!address) {
            getBalance(address).then(setBalance);
        }
    }, [address]);

    return balance;
};

export const useSolanaSignMessage = (address: string) => {};

export const useSolanaSendTransaction = (address: string) => {};
