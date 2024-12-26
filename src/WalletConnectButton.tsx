import { useSolanaBalance } from "./solana";
import { useBoomWallet } from "./wallets/useBoomWallet";
import { useEffect, useState } from "react";
import { useBoomWalletDelegate } from "./wallets/usePrivyEmbeddedWallet";
import { logger } from "./utils";
import { src_wallet } from "./assets";
import Select from "./componnets/Selector";
import Menu from "./componnets/Menu";
import ConnectWalletModal from "./ConnectWalletModal";

const formatAddress = (address?: string) => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 3)}...${address.slice(-4)}`;
};

export default function WalletConnectButton({
    buttonClassName = "",
    selectedButtonClassName = "",
    hideConnectByWallets = false,
}: {
    buttonClassName?: string;
    selectedButtonClassName?: string;
    hideConnectByWallets?: boolean;
}) {
    const boomWallet = useBoomWallet();
    logger.log("🚀 ~ boomWallet:", boomWallet);
    const userWalletAddress = boomWallet?.walletAddress;
    const { balance, updateBalance } = useSolanaBalance(userWalletAddress || "");
    const { option, onDelegate, onRevoke } = useBoomWalletDelegate();

    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const openConnectModal = () => setIsConnectModalOpen(true);
    const closeConnectModal = () => setIsConnectModalOpen(false);

    useEffect(() => {
        // 已经连接的状态下保证modal关闭
        if (boomWallet?.walletAddress) {
            closeConnectModal();
        }
    }, [boomWallet?.walletAddress]);

    if (!boomWallet || !boomWallet?.isConnected)
        return (
            <div className="boom_privy_button_container">
                <ConnectWalletModal
                    isOpen={isConnectModalOpen}
                    onClose={closeConnectModal}
                    hideConnectByWallets={hideConnectByWallets}
                />
                <button
                    className={`privy_wallet_button ${buttonClassName}`}
                    onClick={openConnectModal}
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
                selectedButtonClassName={selectedButtonClassName}
                content={
                    <div onClick={updateBalance}>
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
                                    {option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"}
                                </span>
                            </div>
                        )}
                    </>
                }
            />
            {/* h5 */}
            <Menu
                balance={(balance / 1e9).toFixed(4)}
                address={formatAddress(userWalletAddress)}
                buttonClassName={buttonClassName}
            >
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
