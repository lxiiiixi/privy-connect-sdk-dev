import React, { useState } from "react";
import { useBoomWallet } from "../../../dist";
import { getTokenByAddress, getTokenBySymbol } from "./tokens";

const Multiplier = 10 ** 6;
const Slippages = [30, 50, 100];

export const Trade: React.FC = () => {
    const { transactions } = useBoomWallet();

    const [slippage, setSlippage] = useState(50);
    const [amount, setAmount] = useState("");
    const [inputToken, setInputToken] = useState("");
    const [outputToken, setOutputToken] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Trade submitted:", { slippage, amount, inputToken, outputToken });

        const InputToken = getTokenByAddress(inputToken) || getTokenBySymbol(inputToken);
        const OutputToken = getTokenByAddress(outputToken) || getTokenBySymbol(outputToken);
        if (!InputToken || !OutputToken) {
            throw new Error("Token not found");
        }

        const tradeAmount = (
            (BigInt(Number(amount) * Multiplier) * BigInt(10 ** InputToken.decimals)) /
            BigInt(Multiplier)
        ).toString();

        transactions.trade({
            inputTokenAddress: InputToken.address,
            outputTokenAddress: OutputToken.address,
            amountIn: tradeAmount,
            slippage: slippage,
        });
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md bg-yellow-500/10">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="token"
                        className="block text-sm font-medium text-gray-700 mb-1 text-left"
                    >
                        Input Token
                    </label>
                    <input
                        id="inputToken"
                        type="text"
                        value={inputToken}
                        onChange={e => setInputToken(e.target.value)}
                        placeholder={`Enter token address or symbol to trade`}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="token"
                        className="block text-sm font-medium text-gray-700 mb-1 text-left"
                    >
                        Output Token
                    </label>
                    <input
                        id="outputToken"
                        type="text"
                        value={outputToken}
                        onChange={e => setOutputToken(e.target.value)}
                        placeholder={`Enter token address or symbol to trade`}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 mb-1 text-left"
                    >
                        Amount
                    </label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        Slippage
                    </label>
                    <div className="flex space-x-2">
                        {Slippages.map(s => (
                            <label key={s} className="flex items-center">
                                <input
                                    type="radio"
                                    value={s}
                                    checked={slippage === s}
                                    onChange={() => setSlippage(s)}
                                    className="mr-1"
                                />
                                <span>{s / 100}%</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                    Confirm Trade
                </button>
            </form>
        </div>
    );
};
