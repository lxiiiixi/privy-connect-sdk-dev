import "./App.css";
import { WalletConnectButton, useBoomWallet } from "boom-wallet-sdk";

function App() {
    const { walletAddress, type, transactions, email } = useBoomWallet();

    console.log("useBoomWallet", useBoomWallet());

    return (
        <>
            <div className="space-y-4">
                <WalletConnectButton className="privy-wallet-connect-button" />
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
                {transactions.buy && (
                    <button
                        className="btn"
                        onClick={async () => {
                            await transactions.buy();
                        }}
                    >
                        Buy usdc by 0.01 SOL
                    </button>
                )}
            </div>
        </>
    );
}

export default App;
