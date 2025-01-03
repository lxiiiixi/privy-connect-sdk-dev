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
    SOL: new Token("So11111111111111111111111111111111111111112", "Solana", "SOL", 9, 101),
    USDC: new Token("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "USDC", "USDC", 6, 101),
};

export const getTokenByAddress = (address: string) => {
    return Object.values(TOKENS).find(
        token => token.address.toLowerCase() === address.toLowerCase()
    );
};

export const getTokenBySymbol = (symbol: string) => {
    return Object.values(TOKENS).find(token => token.symbol.toLowerCase() === symbol.toLowerCase());
};
