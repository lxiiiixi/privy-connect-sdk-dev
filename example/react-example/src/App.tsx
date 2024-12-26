import "./App.css";
import { ConnectWalletModal, WalletConnectButton, useBoomWallet } from "boom-wallet-sdk";
import { Trade } from "./Trade";
import { useState } from "react";

function App() {
    const { walletAddress, type, email, disconnect } = useBoomWallet();
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
                    </div>
                </div>
                <hr />
                {walletAddress && <Trade />}
            </div>
        </>
    );
}

export default App;
