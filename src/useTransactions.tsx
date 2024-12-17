import { buy } from "./lib/buy";
import { connection } from "./solana";
import { useBoomWallet } from "./wallets/useBoomWallet";

export default function useBoomTransactions() {
    const { user, sendTransaction } = useBoomWallet();
    const wallet = user?.wallet;

    const sendBuyTransaction = async () => {
        if (!wallet?.address || !sendTransaction || !connection) return;
        const transaction = await buy(wallet?.address, sendTransaction, connection);
        console.log("🚀 ~ sendBuyTransaction ~ transaction:", transaction);
    };
    return { sendBuyTransaction };
}
