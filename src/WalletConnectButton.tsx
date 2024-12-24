import { useLogin } from "@privy-io/react-auth";
import { useSolanaBalance } from "./solana";
import { useBoomWallet } from "./wallets/useBoomWallet";
import { useEffect, useState } from "react";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useBoomWalletDelegate } from "./wallets/usePrivyEmbeddedWallet";
import { logger } from "./utils";

const formatAddress = (address?: string) => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 3)}...${address.slice(-4)}`;
};

export default function WalletConnectButton({
    className,
    hideConnectByWallets = false,
}: {
    className?: string;
    hideConnectByWallets?: boolean;
}) {
    const boomWallet = useBoomWallet();
    logger.log("🚀 ~ boomWallet:", boomWallet);
    const userWalletAddress = boomWallet?.walletAddress;
    const { balance, fetchUpdateBalance } = useSolanaBalance(userWalletAddress || "");

    const { option, onDelegate, onRevoke } = useBoomWalletDelegate();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // 已经连接的状态下保证modal关闭
        if (boomWallet?.walletAddress) {
            setIsOpen(false);
        }
    }, [boomWallet?.walletAddress]);

    if (!boomWallet || !boomWallet?.isConnected)
        return (
            <>
                <ConnectWalletModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    hideConnectByWallets={hideConnectByWallets}
                />
                <button
                    className={`privy-wallet-connect-button wallet-connect-base ${className}  red-button`}
                    onClick={() => setIsOpen(true)}
                >
                    Connect Wallet
                </button>
            </>
        );

    return (
        <>
            <div className="privy-wallet-dropdown">
                <div className="privy-user-info" onClick={fetchUpdateBalance}>
                    ({(balance / 1e9).toFixed(4)} SOL) {formatAddress(userWalletAddress)}
                </div>
                <div className="privy-dropdown-content">
                    <button className="dropdown-item" onClick={boomWallet.disconnect}>
                        Logout
                    </button>
                    {boomWallet.type === "EMAIL" && (
                        <button className="dropdown-item" onClick={boomWallet.exportWallet}>
                            Export Wallet
                        </button>
                    )}
                    {boomWallet.type === "EMAIL" && option && (
                        <button
                            className="dropdown-item"
                            onClick={option === "DELEGATE" ? onDelegate : onRevoke}
                        >
                            {option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"}
                        </button>
                    )}
                </div>
            </div>
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
        </>
    );
}

function ExternalWalletList() {
    const { wallets, select } = useWallet();

    return (
        <div>
            {wallets.map((wallet: Wallet) => (
                <button
                    key={wallet.adapter.name}
                    onClick={() => {
                        select(wallet.adapter.name);
                    }}
                    className="wallet-list-item"
                >
                    <img src={wallet.adapter.icon} alt={wallet.adapter.name} width={30} />
                    {wallet.adapter.name}
                </button>
            ))}
        </div>
    );
}
function PrivyLogin({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const { login } = useLogin({
        onComplete: () => {},
    });
    return (
        <>
            <div className="email-form">
                <input
                    type="email"
                    placeholder="your@email.com"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button
                    type="submit"
                    onClick={() => {
                        onClose();
                        login({
                            type: "email",
                            prefill: {
                                type: "email",
                                value: email,
                            },
                        });
                    }}
                >
                    submit
                </button>
            </div>
        </>
    );
}
function ConnectWalletModal({
    isOpen,
    onClose,
    hideConnectByWallets,
}: {
    isOpen: boolean;
    onClose: () => void;
    hideConnectByWallets: boolean;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h4>Login</h4>
            <PrivyLogin onClose={onClose} />
            {!hideConnectByWallets && <hr />}
            {!hideConnectByWallets && <ExternalWalletList />}
        </Modal>
    );
}
