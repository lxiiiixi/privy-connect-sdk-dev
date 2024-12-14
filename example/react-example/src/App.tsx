import "./App.css";
import { WalletConnectButton, useBoomWallet } from "privy-connect-test-sdk";

function App() {
    const { user, signMessage, wallet } = useBoomWallet();
    console.log("🚀 ~ App ~ user:", user);

    return (
        <>
            <div className="space-y-4">
                <WalletConnectButton
                    onComplete={() => {}}
                    className="privy-wallet-connect-button"
                />
                <hr />
                <details>
                    <summary className="mt-6 font-bold uppercase text-sm text-gray-600 cursor-pointer">
                        User object
                    </summary>
                    <pre className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </details>

                <div className="bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
                    <h2>钱包类型一：邮箱登录 =&gt; 由平台创建的钱包</h2>
                    <hr className="my-2" />
                    <div>User Email —— {user?.email?.address || "null"}</div>
                    <div>Embedded Wallet —— {wallet?.address || "null"}</div>
                    <div className="bg-white/10 p-4 rounded-md m-4 space-y-4">
                        <div> Sign Message</div>
                        <button
                            className="btn"
                            onClick={() => {
                                signMessage("Hello!");
                            }}
                        >
                            Sign Message
                        </button>
                    </div>
                </div>
                <div className="bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
                    <h2>钱包类型二：用户自己的外部钱包</h2>
                    <hr className="my-2" />
                    <div>External Wallet —— {user?.wallet?.address || "null"}</div>
                    <div className="bg-white/10 p-4 rounded-md m-4 space-y-4">
                        <div> Sign Message</div>
                        <button className="btn" onClick={() => {}}>
                            Sign Message
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
