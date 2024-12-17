import { useLogin } from "@privy-io/react-auth";
import { useSolanaBalance } from "./solana";
import { useBoomWallet, useBoomWalletDelegate, useExternalWallet } from "./useBoomWallet";
import { useState } from "react";
import { Wallet } from "@solana/wallet-adapter-react";

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
    const { user, authenticated, logout, exportWallet, loginType } = useBoomWallet();
    const userWalletAddress = user?.wallet?.address;
    const balance = useSolanaBalance(userWalletAddress || "");

    const { option, onDelegate, onRevoke } = useBoomWalletDelegate();

    const [isOpen, setIsOpen] = useState(false);

    if (!user || !authenticated)
        return (
            <>
                <ConnectWalletModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                <button
                    className={`privy-wallet-connect-button wallet-connect-base ${className}`}
                    // onClick={login}
                    onClick={() => setIsOpen(true)}
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
                    ({(balance / 1e9).toFixed(2)} SOL) {formatAddress(userWalletAddress)}
                </div>
                <div className="privy-dropdown-content">
                    <button className="dropdown-item" onClick={logout}>
                        Logout
                    </button>
                    {loginType === "EMAIL" && (
                        <button className="dropdown-item" onClick={exportWallet}>
                            Export Wallet
                        </button>
                    )}
                    {loginType === "EMAIL" && option && (
                        <button
                            className="dropdown-item"
                            onClick={option === "DELEGATE" ? onDelegate : onRevoke}
                        >
                            {option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"}
                        </button>
                    )}
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
                padding: 8px;
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
                border-radius: 8px;
            }

            .dropdown-item:hover {
                background-color: #f5f5f5;
            }
        `}</style>
        </>
    );
}

function Modal({
    isOpen,
    onClose,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    if (!isOpen) return null; // 如果 Modal 没有打开，则不渲染

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                }

                .modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    width: 100%;
                }
            `}</style>
        </>
    );
}

function ConnectWalletModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { wallets, select } = useExternalWallet();
    const { login } = useLogin({
        onComplete: () => onClose(),
    });
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h4>Login</h4>
            <button onClick={login}>Login by Email</button>
            <hr />
            {wallets.map((wallet: Wallet) => (
                <button
                    key={wallet.adapter.name}
                    onClick={() => {
                        select(wallet.adapter.name);
                    }}
                >
                    <img src={wallet.adapter.icon} alt={wallet.adapter.name} width={40} />
                    {wallet.adapter.name}
                </button>
            ))}
        </Modal>
    );
}
