import { useLogin, useLoginWithEmail } from "@privy-io/react-auth";
import { useSolanaBalance } from "./solana";
import { useBoomWallet } from "./wallets/useBoomWallet";
import { useEffect, useState } from "react";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useBoomWalletDelegate } from "./wallets/usePrivyEmbeddedWallet";
import { logger } from "./utils";
import Modal from "./componnets/Modal";
import {
    src_email_dark,
    src_email_light,
    src_privy_dark,
    src_privy_light,
    src_secure,
    src_wallet,
} from "./assets";
import Divider from "./componnets/Divider";
import Select from "./componnets/Selector";
import Menu from "./componnets/Menu";

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
                    className={`privy_wallet_button wallet-connect-base ${className}`}
                    onClick={() => setIsOpen(true)}
                >
                    <span> Connect Wallet </span>
                    <img src={src_wallet} alt="arrow_right" width={20} />
                </button>
            </div>
        );

    return (
        <div className="boom_privy_button_container">
            {/* pc */}
            <Select
                content={
                    <div onClick={fetchUpdateBalance}>
                        ({(balance / 1e9).toFixed(4)} SOL) {formatAddress(userWalletAddress)}
                    </div>
                }
                children={
                    <>
                        <div className={`dropdown-item`} onClick={boomWallet.disconnect}>
                            <span>{"Logout"}</span>
                        </div>
                        {boomWallet.type === "EMAIL" && (
                            <div className={`dropdown-item`} onClick={boomWallet.exportWallet}>
                                <span>{"Export Wallet"}</span>
                            </div>
                        )}
                        {boomWallet.type === "EMAIL" && option && (
                            <div
                                className={`dropdown-item`}
                                onClick={option === "DELEGATE" ? onDelegate : onRevoke}
                            >
                                <span>
                                    {" "}
                                    {option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"}
                                </span>
                            </div>
                        )}
                    </>
                }
            />
            {/* h5 */}
            <Menu balance={(balance / 1e9).toFixed(4)} address={formatAddress(userWalletAddress)}>
                <div className={`menu-dropdown-item`} onClick={boomWallet.disconnect}>
                    <span>{"Logout"}</span>
                </div>
                {boomWallet.type === "EMAIL" && (
                    <div className={`menu-dropdown-item`} onClick={boomWallet.exportWallet}>
                        <span>{"Export Wallet"}</span>
                    </div>
                )}
                {boomWallet.type === "EMAIL" && option && (
                    <div
                        className={`menu-dropdown-item`}
                        onClick={option === "DELEGATE" ? onDelegate : onRevoke}
                    >
                        <span>
                            {option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"}
                        </span>
                    </div>
                )}
            </Menu>
        </div>
    );
}

function ExternalWalletList() {
    const { wallets, select } = useWallet();
    console.log("【XXXXX】 🚀 ExternalWalletList 🚀 wallets:", wallets);
    const [showAll, setShowAll] = useState(false); // 控制是否显示全部钱包

    const visibleWallets = showAll ? wallets : wallets.slice(0, 2);

    return (
        <div className="privy_wallet_list_container">
            {visibleWallets.map((wallet: Wallet) => (
                <button
                    key={wallet.adapter.name}
                    onClick={() => {
                        select(wallet.adapter.name);
                    }}
                    className="privy_wallet_list_item"
                >
                    <img src={wallet.adapter.icon} alt={wallet.adapter.name} width={24} />
                    <div className="privy_wallet_list_item_name"> {wallet.adapter.name} </div>
                </button>
            ))}
            {!showAll && (
                <div
                    className="privy_wallet_list_more"
                    onClick={() => setShowAll(true)} // 点击按钮显示全部钱包
                >
                    More Wallets
                </div>
            )}
        </div>
    );
}
function PrivyLogin({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const { login } = useLogin({
        onComplete: () => {},
    });

    const { state, sendCode, loginWithCode } = useLoginWithEmail();

    return (
        <div className="privy_login_container">
            <div className="privy_login_title">
                Protected by{" "}
                <img src={src_privy_light} className="dark_img" alt="privy" width={56} />
                <img src={src_privy_dark} className="light_img" alt="privy_img" width={56} />
            </div>
            <div className="privy_email_form">
                <img src={src_email_dark} className="light_img" alt="email" width={20} />
                <img src={src_email_light} className="dark_img" alt="email" width={20} />
                <input
                    type="email"
                    placeholder="your@email.com"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="privy_login_mpc_tip">
                MPC wallet is more <img src={src_secure} alt="secure" width={80} />
            </div>
            <button
                className="privy_login_submit_button"
                type="submit"
                onClick={() => {
                    // loginWithCode({
                    //     code: "000000",
                    // });
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
            {!hideConnectByWallets && <Divider />}
            {!hideConnectByWallets && <ExternalWalletList />}
        </Modal>
    );
}
