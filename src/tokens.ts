import { LAMPORTS_PER_SOL } from "@solana/web3.js";

class Token {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    chainId: number;
    constructor(address: string, name: string, symbol: string, decimals: number, chainId: number) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.decimals = decimals;
        this.chainId = chainId;
    }

    parseAmount(amount: number) {
        return amount * 10 ** this.decimals;
    }

    formatAmount(amount: number) {
        return amount / 10 ** this.decimals;
    }
}

export const TOKENS = {
    SOL: new Token(
        "So11111111111111111111111111111111111111112",
        "Solana",
        "SOL",
        LAMPORTS_PER_SOL,
        101
    ),
    USDC: new Token("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "USDC", "USDC", 6, 101),
};
