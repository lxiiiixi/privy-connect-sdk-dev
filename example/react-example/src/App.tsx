import "./App.css";
import { WalletConnectButton, useBoomWallet } from "boom-wallet-sdk";

function App() {
    // const { user, signMessage, loginType } = useBoomWallet();
    // console.log("🚀 ~ App ~ user:", user, user.wallet);

    // const { sendBuyTransaction } = useBoomTransactions();

    const boomWallet = useBoomWallet();
    console.log("🚀 ~ App ~ boomWallet:", boomWallet);

    return (
        <>
            <div className="space-y-4">
                <WalletConnectButton className="privy-wallet-connect-button" />
                <hr />
                {boomWallet && (
                    <button
                        className="btn"
                        onClick={async () => {
                            await boomWallet.sendTransactions.buy();
                        }}
                    >
                        Buy usdc by 0.01 SOL
                    </button>
                )}
                {/* <details>
                    <summary className="mt-6 font-bold uppercase text-sm text-gray-600 cursor-pointer">
                        User object
                    </summary>
                    <pre className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </details>
                {loginType === "EMAIL" && (
                    <div className="bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
                        <h2>钱包类型一：邮箱登录 =&gt; 由平台创建的钱包</h2>
                        <hr className="my-2" />
                        <div>User Email —— {user?.email?.address || "null"}</div>
                        <div>Embedded Wallet —— {user.wallet?.address || "null"}</div>
                        <div>
                            是否授权了privy钱包的权限：
                        </div>
                        <div className="bg-white/10 p-4 rounded-md m-4 space-y-4 space-x-4">
                            <button
                                className="btn"
                                onClick={() => {
                                    signMessage("Hello!");
                                }}
                            >
                                Sign Message
                            </button>
                            <button
                                className="btn"
                                onClick={() => {
                                    sendBuyTransaction();
                                }}
                            >
                                Buy usdc by 0.01 SOL
                            </button>
                        </div>
                    </div>
                )}
                {loginType === "WALLET" && (
                    <div className="bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
                        <h2>钱包类型二：用户自己的外部钱包</h2>
                        <hr className="my-2" />
                        <div>External Wallet —— {user?.wallet?.address || "null"}</div>
                        <div className="bg-white/10 p-4 rounded-md m-4 space-y-4 space-x-4">
                            <button
                                className="btn"
                                onClick={() => {
                                    signMessage("Hello!");
                                }}
                            >
                                Sign Message
                            </button>
                            <button
                                className="btn"
                                onClick={() => {
                                    sendBuyTransaction();
                                }}
                            >
                                Buy usdc by 0.01 SOL
                            </button>
                        </div>
                    </div>
                )} */}
            </div>
        </>
    );
}

export default App;
