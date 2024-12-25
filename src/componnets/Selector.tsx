import React, { useState, useEffect, useRef } from "react";
import { src_arrow_down } from "../assets";

function Select({ content, children }: { content: React.ReactNode; children: React.ReactNode }) {
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
        <div className="select-container" ref={selectRef}>
            {/* Select Button */}
            <div className={`select-button ${isOpen ? "active" : ""}`} onClick={toggleDropdown}>
                <span>{content}</span>
                <img src={src_arrow_down} alt="arrow_down" width={10} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && <div className="select-dropdown">{children}</div>}

            <style>{`
                .select-container {
                    position: relative;
                }

                .select-button {
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 16px;
                    border: 1px solid #e4e4e7;
                    border-radius: 12px;
                    background-color: #fff;
                    cursor: pointer;
                    transition: all 0.3s ease;

                    img {
                        margin-left: 8px;
                    }
                }

                .select-button:hover {
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 1),
                        0 0 0 calc(2px + 2px) var(--wallet-primary-color);
                }

                .select-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background-color: #fff;
                    border: 1px solid #e4e4e7;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-top: 8px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    padding: 8px;
                }

                .dropdown-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 16px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .dropdown-item:hover {
                    background-color: #f3f4f6;
                }

                .dropdown-item.selected {
                    font-weight: 500;
                }

                .dropdown-item .checkmark {
                    margin-left: auto;
                    color: #ffd700;
                }

                @media (max-width: 767px) {
                    .select-button {
                        height: 38px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Select;
