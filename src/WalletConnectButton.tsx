import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useSolanaBalance } from "./solana";

const formatAddress = (address?: string) => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 3)}...${address.slice(-4)}`;
};

export default function WalletConnectButton({
    onComplete,
    className,
}: {
    onComplete?: () => void;
    className?: string;
}) {
    const { login } = useLogin({
        onComplete: () => onComplete?.(),
    });
    const { connectWallet, user, authenticated, logout } = usePrivy();
    const balance = useSolanaBalance(user?.wallet?.address || "");
    console.log("🚀 ~ balance:", balance);

    if (!user || !authenticated)
        return (
            <>
                <button
                    className={`privy-wallet-connect-button wallet-connect-base ${className}`}
                    onClick={login}
                >
                    Connect Wallet
                </button>
                <style>{`
    .privy-wallet-connect-button {
    background-color: #fcd535;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-weight: 500;
    color: #09090b;
    cursor: pointer;
    font-size: 16px;
    line-height: 24px;
}
        `}</style>
            </>
        );

    return (
        <>
            <div className="privy-wallet-dropdown">
                <div className="privy-user-info">
                    ({(balance / 1e9).toFixed(2)} SOL){" "}
                    {formatAddress(user.email?.address || user.wallet?.address)}
                </div>
                <div className="privy-dropdown-content">
                    <button className="dropdown-item" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
            <style>{`
            .privy-user-info{
                background-color: #fcd535;
                border: none;
                border-radius: 12px;
                padding: 12px 24px;
                font-weight: 500;
                color: #09090b;
                cursor: pointer;
                font-size: 16px;
                line-height: 24px;
            }
                
            .privy-wallet-dropdown {
                position: relative;
                display: inline-block;
            }

            .privy-user-info {
                cursor: pointer;
                padding: 8px 16px;
                border-radius: 8px;
            }

            .privy-dropdown-content {
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                background-color: white;
                min-width: 160px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border-radius: 8px;
                padding: 8px 0;
                z-index: 1000;
            }

            .privy-wallet-dropdown:hover .privy-dropdown-content {
                display: block;
            }

            .dropdown-item {
                display: block;
                width: 100%;
                padding: 8px 16px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
            }

            .dropdown-item:hover {
                background-color: #f5f5f5;
            }
        `}</style>
        </>
    );
}
