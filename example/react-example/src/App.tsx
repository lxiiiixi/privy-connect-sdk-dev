import "./App.css";
import { WalletConnectButton, useBoomWallet } from "boom-wallet-sdk";
import { Trade } from "./Trade";

function App() {
    const { walletAddress, type, email } = useBoomWallet();

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
                {walletAddress && <Trade />}
            </div>
        </>
    );
}

export default App;
