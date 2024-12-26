import { useLogin, useLoginWithEmail } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { logger } from "./utils";
import Modal from "./componnets/Modal";
import {
    src_email_dark,
    src_email_light,
    src_privy_dark,
    src_privy_light,
    src_secure,
} from "./assets";
import Divider from "./componnets/Divider";
import { useBoomWallet } from "./wallets/useBoomWallet";

function ExternalWalletList() {
    const { wallets, select } = useWallet();
    logger.log("【XXXXX】 🚀 ExternalWalletList 🚀 wallets:", wallets);
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
            <div className="input-wrapper">
                <img src={src_email_dark} className="light_img" alt="email" width={20} />
                <img src={src_email_light} className="dark_img" alt="email" width={20} />
                <input
                    type="email"
                    placeholder="your@email.com"
                    id="email"
                    className="privy_email_input"
                    value={email}
                    autoComplete="off"
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
                    login({
                        type: "email",
                        prefill: {
                            type: "email",
                            value: email,
                        },
                    });
                    onClose();
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
    hideConnectByWallets = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    hideConnectByWallets?: boolean;
}) {
    const { walletAddress } = useBoomWallet();

    useEffect(() => {
        // 已经连接的状态下保证modal关闭
        if (!!walletAddress) {
            onClose();
        }
    }, [walletAddress]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h4 className="modal_title">Log in or Sign up</h4>
            <PrivyLogin onClose={onClose} />
            {!hideConnectByWallets && <Divider />}
            {!hideConnectByWallets && <ExternalWalletList />}
        </Modal>
    );
}

export default ConnectWalletModal;
