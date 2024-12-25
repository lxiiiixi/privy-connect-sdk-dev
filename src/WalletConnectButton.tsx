import { useLogin } from "@privy-io/react-auth";
import { useSolanaBalance } from "./solana";
import { useBoomWallet } from "./wallets/useBoomWallet";
import { useEffect, useState } from "react";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useBoomWalletDelegate } from "./wallets/usePrivyEmbeddedWallet";
import { logger } from "./utils";
import Modal from "./componnets/Modal";
import { src_email, src_privy_dark } from "./assets";

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
            <div className="boom_privy_button_container">
                <ConnectWalletModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    hideConnectByWallets={hideConnectByWallets}
                />
                <button
                    className={`privy-wallet-button wallet-connect-base ${className}  red-button`}
                    onClick={() => setIsOpen(true)}
                >
                    Connect Wallet
                </button>
            </div>
        );

    return (
        <div className="boom_privy_button_container">
            <div className="privy_wallet_dropdown">
                <div className="privy_user_info" onClick={fetchUpdateBalance}>
                    ({(balance / 1e9).toFixed(4)} SOL) {formatAddress(userWalletAddress)}
                </div>
                <div className="privy_dropdown_content">
                    <button className="privy_dropdown_item" onClick={boomWallet.disconnect}>
                        Logout
                    </button>
                    {boomWallet.type === "EMAIL" && (
                        <button className="privy_dropdown_item" onClick={boomWallet.exportWallet}>
                            Export Wallet
                        </button>
                    )}
                    {boomWallet.type === "EMAIL" && option && (
                        <button
                            className="privy_dropdown_item"
                            onClick={option === "DELEGATE" ? onDelegate : onRevoke}
                        >
                            {option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"}
                        </button>
                    )}
                </div>
            </div>
        </div>
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
                    className="privy_wallet_list_item"
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
        <div className="privy_login_container">
            <div className="privy_login_title">Protected by Privy</div>
            <div className="privy_email_form">
                <img src={src_privy_dark} alt="email" width={20} />
                <input
                    type="email"
                    placeholder="your@email.com"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="privy_login_mpc_tip">MPC wallet is more SECURE</div>
            <button
                className="privy_login_submit_button"
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
                Submit
            </button>
        </div>
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
            <h4 className="modal_title">Log in or Sign up</h4>
            <PrivyLogin onClose={onClose} />
            {!hideConnectByWallets && <hr />}
            {!hideConnectByWallets && <ExternalWalletList />}
        </Modal>
    );
}
