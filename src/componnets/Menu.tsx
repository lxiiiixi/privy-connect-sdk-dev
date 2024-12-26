import React, { useState, useEffect, useRef } from "react";
import {
    src_arrow_down_dark,
    src_arrow_down_light,
    src_solana_icon,
    src_user_icon,
    src_wallet,
} from "../assets";

function Menu({
    address,
    balance,
    buttonClassName,
    children,
}: {
    address: string;
    balance: string;
    buttonClassName?: string;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false); // 控制下拉菜单开关
    const selectRef = useRef<HTMLDivElement>(null); // 用于检测点击目标是否在组件内

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    // 点击组件外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false); // 点击外部时关闭下拉菜单
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="menu-container" ref={selectRef}>
            {/* Select Button */}
            <button className={`privy_wallet_button ${buttonClassName}`} onClick={toggleDropdown}>
                <span> Connect Wallet </span>
                <img src={src_wallet} alt="arrow_right" width={20} />
            </button>
            {/* Dropdown Menu */}
            {isOpen && (
                <div className="menu-select-dropdown">
                    <div>
                        <span className="menu-dropdown-item" style={{ fontWeight: "600" }}>
                            <img src={src_user_icon} width={14} /> {address}
                        </span>
                        <span className="menu-dropdown-item" style={{ fontWeight: "500" }}>
                            <img src={src_solana_icon} width={14} />
                            {balance} SOL
                        </span>
                    </div>
                    <div className="divider"></div>
                    {children}
                </div>
            )}

            <style>{`
.menu-container {
    display: none;
}

@media (max-width: 767px) {
    .menu-container {
        display: block;
        position: relative;

        .menu-select-dropdown {
            position: absolute;
            top: 100%;
            right: 0px;
            width: 160px;
            background-color: var(--wallet-theme-color);
            border: 1px solid var(--wallet-border-color);
            border-radius: 12px;
            overflow: hidden;
            margin-top: 8px;
            z-index: 1000;
            text-align: left;
        }

        .divider {
            width: 100%;
            height: 1px;
            background-color: var(--wallet-border-color);
        }

        .menu-dropdown-item {
            display: flex;
            justify-content: start;
            align-items: baseline;
            gap: 6px;
            padding: 4px 12px;
            margin: 4px;
            font-size: 14px;
            line-height: 21px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .menu-dropdown-item:hover {
            background-color: var(--wallet-bg-muted);
        }
    }
}
            `}</style>
        </div>
    );
}

export default Menu;
