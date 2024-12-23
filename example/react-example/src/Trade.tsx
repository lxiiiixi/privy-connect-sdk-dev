import React, { useState } from "react";

const Slippages = [30, 50, 100];

export const Trade: React.FC = () => {
    const [type, setType] = useState<"buy" | "sell">("buy");
    const [slippage, setSlippage] = useState(50);
    const [amount, setAmount] = useState("");
    const [token, setToken] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Trade submitted:", { type, slippage, amount, token });
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md bg-yellow-500/10">
            <div className="flex mb-4 rounded-lg overflow-hidden">
                <button
                    className={`flex-1 py-2 px-4 text-center ${
                        type === "buy" ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setType("buy")}
                >
                    Buy
                </button>
                <button
                    className={`flex-1 py-2 px-4 text-center ${
                        type === "sell" ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setType("sell")}
                >
                    Sell
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div>
                    <label
                        htmlFor="token"
                        className="block text-sm font-medium text-gray-700 mb-1 text-left"
                    >
                        Token
                    </label>
                    <input
                        id="token"
                        type="text"
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        placeholder={`Enter token to ${type}`}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                    Confirm {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
            </form>
        </div>
    );
};
