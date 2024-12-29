import "./App.css";
import {
    BalanceTokenAmount,
    ConnectWalletModal,
    WalletConnectButton,
    getAllAssociatedTokens,
    getTokenBalance,
    useBoomWallet,
} from "boom-wallet-sdk";
import { Trade } from "./Trade";
import { useEffect, useState } from "react";

function App() {
    const { walletAddress, type, email, disconnect, signMessage } = useBoomWallet();
    const [usdcBalance, setUsdcBalance] = useState<BalanceTokenAmount | null>(null);
    const [allAssociatedTokens, setAllAssociatedTokens] = useState<BalanceTokenAmount[]>([]);

    useEffect(() => {
        if (walletAddress) {
            const usdcMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
            const getBalance = async () => {
                const balance = await getTokenBalance(usdcMintAddress, walletAddress);
                return balance;
            };
            getBalance().then(balance => {
                setUsdcBalance(balance);
            });
        }
    }, [walletAddress]);

    useEffect(() => {
        if (walletAddress) {
            getAllAssociatedTokens(walletAddress).then(tokens => {
                setAllAssociatedTokens(tokens);
            });
        }
    }, [walletAddress]);

    // 切换明暗模式 ————————————————————————
    const htmlElement = document.documentElement;
    const [isDark, setIsDark] = useState(htmlElement.classList.contains("dark"));
    function toggleTheme() {
        if (isDark) {
            htmlElement.classList.remove("dark");
            htmlElement.classList.add("light");
            setIsDark(false);
        } else {
            htmlElement.classList.remove("light");
            htmlElement.classList.add("dark");
            setIsDark(true);
        }
    }
    // 切换明暗模式 ————————————————————————

    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const openConnectModal = () => setIsConnectModalOpen(true);
    const closeConnectModal = () => setIsConnectModalOpen(false);

    return (
        <>
            <div className="space-y-4">
                <button
                    onClick={toggleTheme}
                    className="fixed top-10 right-10 bg-yellow-200 rounded-lg px-3 py-1"
                >
                    Toggle To {isDark ? "Light" : "Dark"}
                </button>
                <WalletConnectButton />
                <hr />
                {walletAddress ? (
                    <button onClick={disconnect} className="btn mx-2">
                        logout
                    </button>
                ) : (
                    <button onClick={openConnectModal} className="btn mx-2">
                        open
                    </button>
                )}

                <ConnectWalletModal isOpen={isConnectModalOpen} onClose={closeConnectModal} />
                <hr />
                <div>
                    <h2 className="text-2xl font-bold my-3">User Info</h2>
                    <div className="w-[400px]">
                        <div className="flex justify-between">
                            <div>User Login Type</div>
                            <div>{type}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>User Email</div>
                            <div>{email || "null"}</div>
                        </div>
                        <div className="flex justify-between gap-10">
                            <div className="flex-shrink-0">Wallet Address</div>
                            <div className="truncate ">{walletAddress || "null"}</div>
                        </div>
                        <div className="flex justify-between gap-10">
                            <div className="flex-shrink-0">USDC Balance</div>
                            <div className="truncate">{usdcBalance?.uiAmountString || "null"}</div>
                        </div>
                        <h2 className="text-2xl font-bold my-3">All Associated Tokens</h2>
                        {allAssociatedTokens.map(token => (
                            <div className="flex justify-between w-full" key={token.tokenAddress}>
                                <div className="truncate w-[100px]">{token.tokenAddress}</div>
                                <div>{token.uiAmountString}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <hr />
                {walletAddress && <Trade />}
                <hr />
                <button
                    onClick={async () => {
                        if (walletAddress) {
                            const s = await signMessage(walletAddress);
                            console.log(s); // 拿到签名
                        }
                    }}
                    className="btn mx-2"
                >
                    sign
                </button>
            </div>
        </>
    );
}

export default App;
