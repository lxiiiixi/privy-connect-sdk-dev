// src/index.ts
import { Buffer as Buffer2 } from "buffer";

// src/BoomWalletProvider.tsx
import { useCallback } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

// src/constant.ts
var SOLANA_MAINNET_RPC_URL = "https://rpc-mainnet.solanatracker.io/?api_key=72759b5d-df4b-461b-9a1d-4ab2abc30ad4";
var SOLANA_MAINNET_CLUSTER = {
  name: "mainnet-beta",
  rpcUrl: SOLANA_MAINNET_RPC_URL
};
var SOLANA_CHAIN = {
  id: 101,
  name: "Solana",
  network: "mainnet-beta",
  nativeCurrency: {
    name: "Solana",
    symbol: "SOL",
    decimals: 9
  },
  testnet: false,
  rpcUrls: {
    default: {
      http: [SOLANA_MAINNET_CLUSTER.rpcUrl]
    }
  }
};

// src/BoomWalletProvider.tsx
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { jsx } from "react/jsx-runtime";
function BoomWalletProvider({ appId, children }) {
  const onError = useCallback((error) => {
    console.error(error);
  }, []);
  return /* @__PURE__ */ jsx(
    PrivyProvider,
    {
      appId,
      config: {
        appearance: {
          accentColor: "#FCD535",
          theme: "#ffffff",
          logo: void 0,
          landingHeader: "Connect wallet",
          showWalletLoginFirst: false,
          // 是否有限展示钱包链接的方式
          loginMessage: "Welcome to the app"
          // walletChainType: "solana-only", // 展示支持链的钱包类型
          // walletList: ["phantom", "metamask", "okx_wallet", "detected_wallets"], // 可以选择的钱包列表 WalletListEntry
          // 'metamask' | 'coinbase_wallet' | 'rainbow' | 'phantom' | 'zerion' | 'cryptocom' | 'uniswap' | 'okx_wallet' | 'universal_profile'
        },
        // Display email and wallet as login methods
        // loginMethods: ["email", "wallet"],
        loginMethods: ["email"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true
          }
        },
        // externalWallets: {
        //     solana: {
        //         connectors: toSolanaWalletConnectors({
        //             // By default, shouldAutoConnect is enabled
        //             shouldAutoConnect: true,
        //         }),
        //     },
        // },
        embeddedWallets: {
          createOnLogin: "off",
          showWalletUIs: false,
          // Overrides the value of "Add confirmation modals" you set in the Privy Dashboard
          requireUserPasswordOnCreate: false
        },
        mfa: {
          // 多重身份验证（Multi-Factor Authentication）
          noPromptOnMfaRequired: false
        },
        supportedChains: [SOLANA_CHAIN],
        solanaClusters: [SOLANA_MAINNET_CLUSTER]
      },
      children: /* @__PURE__ */ jsx(ConnectionProvider, { endpoint: SOLANA_MAINNET_CLUSTER.rpcUrl, children: /* @__PURE__ */ jsx(WalletProvider, { wallets: [], onError, autoConnect: true, children }) })
    }
  );
}

// src/useBoomWallet.tsx
import {
  useDelegatedActions,
  usePrivy,
  useSendSolanaTransaction,
  useSolanaWallets
} from "@privy-io/react-auth";
import { useEffect, useMemo as useMemo2 } from "react";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
var useExternalWallet = () => {
  const {
    connected,
    connecting,
    disconnect,
    disconnecting,
    publicKey,
    select,
    wallet,
    wallets,
    sendTransaction
  } = useWallet();
  console.log(
    "\u{1F680} ~ CustomWalletButton ~ connect:",
    connected,
    publicKey,
    publicKey == null ? void 0 : publicKey.toString(),
    wallet,
    wallets
  );
  const { buttonState, label } = useMemo2(() => {
    let buttonState2;
    if (connecting) {
      buttonState2 = "connecting";
    } else if (connected) {
      buttonState2 = "connected";
    } else if (disconnecting) {
      buttonState2 = "disconnecting";
    } else if (wallet) {
      buttonState2 = "has-wallet";
    } else {
      buttonState2 = "no-wallet";
    }
    let label2;
    switch (buttonState2) {
      case "connected":
        label2 = "Disconnect";
        break;
      case "connecting":
        label2 = "Connecting";
        break;
      case "disconnecting":
        label2 = "Disconnecting";
        break;
      case "has-wallet":
        label2 = "Connect";
        break;
      case "no-wallet":
        label2 = "Select Wallet";
        break;
    }
    return { buttonState: buttonState2, label: label2 };
  }, [connecting, connected, disconnecting, wallet]);
  if (!wallet) return null;
  return { buttonState, label, wallets, select, wallet, disconnect };
};
var usePrivyEmbeddedWallet = () => {
  const { user, ready: readyUser, authenticated, login, connectWallet, logout } = usePrivy();
  const { sendSolanaTransaction } = useSendSolanaTransaction();
  const {
    ready: readySolanaWallets,
    wallets: embeddedSolanaWallets,
    createWallet,
    exportWallet
  } = useSolanaWallets();
  const userEmbeddedWallet = embeddedSolanaWallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const loginType = (user == null ? void 0 : user.email) ? "EMAIL" : "WALLET";
  useEffect(() => {
    if (!authenticated || !readyUser) return;
    if (userEmbeddedWallet || (user == null ? void 0 : user.wallet)) return;
    if (loginType !== "EMAIL") return;
    try {
      console.log("CreateWallet");
      createWallet();
    } catch (error) {
      console.warn(error);
    }
  }, [userEmbeddedWallet, authenticated]);
  console.log("user", user);
  console.log(
    "solanaWallets",
    userEmbeddedWallet,
    user == null ? void 0 : user.wallet,
    readySolanaWallets,
    authenticated,
    userEmbeddedWallet == null ? void 0 : userEmbeddedWallet.isConnected()
  );
  const signMessage = async (message) => {
    const messageBuffer = new TextEncoder().encode(message);
    const signature = await (userEmbeddedWallet == null ? void 0 : userEmbeddedWallet.signMessage(messageBuffer));
    if (!signature) {
      console.warn("Failed to sign message");
      return null;
    }
    const base58Signature = bs58.encode(signature);
    const hexSignature = Buffer.from(signature).toString("hex");
    console.log("signMessage success", base58Signature, hexSignature);
    return {
      signature: base58Signature,
      // base58 格式
      hexSignature
      // hex 格式
    };
  };
  return {
    user: {
      id: user == null ? void 0 : user.id,
      wallet: userEmbeddedWallet,
      //这个时候 user?.wallet 和 userEmbeddedWallet 应该是一样的
      email: user == null ? void 0 : user.email,
      linkedAccounts: user == null ? void 0 : user.linkedAccounts
    },
    loginType: "EMAIL",
    signMessage,
    sendTransaction: userEmbeddedWallet == null ? void 0 : userEmbeddedWallet.sendTransaction,
    // sendTransaction: sendSolanaTransaction,
    exportWallet,
    authenticated,
    login,
    logout
  };
};
var useBoomWallet = () => {
  var _a, _b, _c;
  const privyEmbeddedWallet = usePrivyEmbeddedWallet();
  const externalWallet = useExternalWallet();
  if (privyEmbeddedWallet.user.wallet) {
    return {
      type: "EMAIL",
      isConnected: privyEmbeddedWallet.authenticated,
      walletAddress: (_a = privyEmbeddedWallet.user.wallet) == null ? void 0 : _a.address,
      exportWallet: privyEmbeddedWallet.exportWallet,
      disconnect: privyEmbeddedWallet.logout
    };
  }
  if (externalWallet == null ? void 0 : externalWallet.wallet) {
    return {
      type: "WALLET",
      isConnected: externalWallet.buttonState === "connected",
      walletAddress: (_c = (_b = externalWallet.wallets[0]) == null ? void 0 : _b.adapter.publicKey) == null ? void 0 : _c.toString(),
      exportWallet: void 0,
      disconnect: externalWallet.disconnect
    };
  }
  return null;
};
var useBoomWalletDelegate = () => {
  var _a, _b, _c;
  const privyEmbeddedWallet = usePrivyEmbeddedWallet();
  const wallet = (_a = privyEmbeddedWallet == null ? void 0 : privyEmbeddedWallet.user) == null ? void 0 : _a.wallet;
  const { delegateWallet, revokeWallets } = useDelegatedActions();
  const walletToDelegate = (wallet == null ? void 0 : wallet.walletClientType) === "privy" ? wallet : void 0;
  const isAlreadyDelegated = !!((_c = (_b = privyEmbeddedWallet.user) == null ? void 0 : _b.linkedAccounts) == null ? void 0 : _c.find(
    (account) => Boolean(account.type === "wallet" && account.address && account.delegated)
  ));
  const isDisplay = !!walletToDelegate;
  const onDelegate = async () => {
    console.log(walletToDelegate, isAlreadyDelegated);
    if (isAlreadyDelegated) return;
    if (walletToDelegate && walletToDelegate.address) {
      console.log(isAlreadyDelegated, walletToDelegate.address);
      await delegateWallet({ address: walletToDelegate.address, chainType: "solana" });
    }
  };
  const onRevoke = async () => {
    if (!isAlreadyDelegated) return;
    await revokeWallets();
  };
  const option = isDisplay ? isAlreadyDelegated ? "REVOKE" : "DELEGATE" : null;
  return {
    option,
    onDelegate,
    onRevoke
  };
};

// src/WalletConnectButton.tsx
import { useLogin, usePrivy as usePrivy2 } from "@privy-io/react-auth";

// src/solana.ts
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect as useEffect2, useState } from "react";
var connection = new Connection(SOLANA_MAINNET_RPC_URL, "confirmed");
var useSolanaBalance = (address) => {
  const [balance, setBalance] = useState(0);
  const getBalance = async (address2) => {
    try {
      const publicKey = new PublicKey(address2);
      const balance2 = await connection.getBalance(publicKey);
      console.log(`Balance of ${address2}: ${balance2 / 1e9} SOL`);
      return balance2;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  };
  useEffect2(() => {
    if (!!address) {
      getBalance(address).then(setBalance);
    }
  }, [address]);
  return balance;
};

// src/WalletConnectButton.tsx
import { useState as useState2 } from "react";
import { useWallet as useWallet2 } from "@solana/wallet-adapter-react";
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
var formatAddress = (address) => {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 3)}...${address.slice(-4)}`;
};
function WalletConnectButton({
  onComplete,
  className
}) {
  const boomWallet = useBoomWallet();
  console.log("\u{1F680} ~ boomWallet:", boomWallet);
  const userWalletAddress = boomWallet == null ? void 0 : boomWallet.walletAddress;
  const balance = useSolanaBalance(userWalletAddress || "");
  const { option, onDelegate, onRevoke } = useBoomWalletDelegate();
  const { logout } = usePrivy2();
  const [isOpen, setIsOpen] = useState2(false);
  if (!boomWallet || !(boomWallet == null ? void 0 : boomWallet.isConnected))
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx2(ConnectWalletModal, { isOpen, onClose: () => setIsOpen(false) }),
      /* @__PURE__ */ jsx2(
        "button",
        {
          className: `privy-wallet-connect-button wallet-connect-base ${className}`,
          onClick: () => setIsOpen(true),
          children: "Connect Wallet"
        }
      ),
      /* @__PURE__ */ jsx2("style", { children: `
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
        ` })
    ] });
  console.log(boomWallet.disconnect);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "privy-wallet-dropdown", children: [
      /* @__PURE__ */ jsxs("div", { className: "privy-user-info", children: [
        "(",
        (balance / 1e9).toFixed(2),
        " SOL) ",
        formatAddress(userWalletAddress)
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "privy-dropdown-content", children: [
        /* @__PURE__ */ jsx2("button", { className: "dropdown-item", onClick: boomWallet.disconnect, children: "Logout" }),
        boomWallet.type === "EMAIL" && /* @__PURE__ */ jsx2("button", { className: "dropdown-item", onClick: boomWallet.exportWallet, children: "Export Wallet" }),
        boomWallet.type === "EMAIL" && option && /* @__PURE__ */ jsx2(
          "button",
          {
            className: "dropdown-item",
            onClick: option === "DELEGATE" ? onDelegate : onRevoke,
            children: option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx2("style", { children: `
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
        ` })
  ] });
}
function Modal({
  isOpen,
  onClose,
  children
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx2("div", { className: "modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsx2("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children }) }),
    /* @__PURE__ */ jsx2("style", { children: `
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
            ` })
  ] });
}
function ExternalWalletList() {
  const { wallets, select } = useWallet2();
  return /* @__PURE__ */ jsx2("div", { children: wallets.map((wallet) => /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => {
        select(wallet.adapter.name);
      },
      children: [
        /* @__PURE__ */ jsx2("img", { src: wallet.adapter.icon, alt: wallet.adapter.name, width: 40 }),
        wallet.adapter.name
      ]
    },
    wallet.adapter.name
  )) });
}
function ConnectWalletModal({ isOpen, onClose }) {
  const { login } = useLogin({
    onComplete: () => onClose()
  });
  return /* @__PURE__ */ jsxs(Modal, { isOpen, onClose, children: [
    /* @__PURE__ */ jsx2("h4", { children: "Login" }),
    /* @__PURE__ */ jsx2(
      "button",
      {
        onClick: () => {
          onClose();
          login();
        },
        children: "Login by Email"
      }
    ),
    /* @__PURE__ */ jsx2("hr", {}),
    /* @__PURE__ */ jsx2(ExternalWalletList, {})
  ] });
}

// src/lib/buy.ts
import { VersionedTransaction } from "@solana/web3.js";
import fetch from "cross-fetch";
async function fetchQuote(inputMint, outputMint, amount, slippageBps, excludeDexes = []) {
  try {
    console.log("\u{1F680} \u6B63\u5728\u8C03\u7528api\u83B7\u53D6\u62A5\u4EF7 \u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014");
    const excludeDexesParam = excludeDexes.length > 0 ? `&excludeDexes=${excludeDexes.join(",")}` : "";
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}${excludeDexesParam}`;
    const response = await fetch(quoteUrl);
    if (!response.ok) {
      throw new Error(`\u83B7\u53D6\u62A5\u4EF7\u5931\u8D25\uFF0CHTTP \u72B6\u6001\u7801: ${response.status}`);
    }
    const quote = await response.json();
    console.log("\u2705 \u83B7\u53D6\u62A5\u4EF7\u6210\u529F:", quote);
    return quote;
  } catch (error) {
    console.error("\u274C \u83B7\u53D6\u62A5\u4EF7\u5931\u8D25:", error.message);
    throw error;
  }
}
async function fetchSwapTransaction(quoteResponse, userPublicKey) {
  try {
    console.log("\u{1F680} \u6B63\u5728\u83B7\u53D6\u4EA4\u6362\u4EA4\u6613...");
    const swapUrl = "https://quote-api.jup.ag/v6/swap";
    const response = await fetch(swapUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true
      })
    });
    if (!response.ok) {
      throw new Error(`\u83B7\u53D6\u4EA4\u6362\u4EA4\u6613\u5931\u8D25\uFF0CHTTP \u72B6\u6001\u7801: ${response.status}`);
    }
    const { swapTransaction } = await response.json();
    console.log("\u2705 \u83B7\u53D6\u4EA4\u6362\u4EA4\u6613\u6210\u529F", swapTransaction);
    return swapTransaction;
  } catch (error) {
    console.error("\u274C \u83B7\u53D6\u4EA4\u6362\u4EA4\u6613\u5931\u8D25:", error.message);
    throw error;
  }
}
var buy = async (userWalletAddress, sendTransaction, connection2) => {
  if (!userWalletAddress) return;
  if (!sendTransaction) return;
  if (!connection2) return;
  console.time("\u2705 \u6240\u6709\u6D41\u7A0B\u5B8C\u6210!");
  const inputMint = "So11111111111111111111111111111111111111112";
  const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  const amount = 1e7;
  const slippageBps = 50;
  console.log("\u{1F4A1} \u5F00\u59CB\u4EA4\u6613\u6D41\u7A0B \u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014");
  console.time("\u23F1\uFE0F \u83B7\u53D6\u62A5\u4EF7\u8017\u65F6");
  const quote = await fetchQuote(inputMint, outputMint, amount, slippageBps);
  console.timeEnd("\u23F1\uFE0F \u83B7\u53D6\u62A5\u4EF7\u8017\u65F6");
  console.time("\u23F1\uFE0F \u83B7\u53D6\u4EA4\u6362\u4EA4\u6613\u8017\u65F6");
  const swapTransaction = await fetchSwapTransaction(quote, userWalletAddress);
  console.timeEnd("\u23F1\uFE0F \u83B7\u53D6\u4EA4\u6362\u4EA4\u6613\u8017\u65F6");
  console.log("\u{1F680} \u5F00\u59CB\u53CD\u5E8F\u5217\u5316\u4EA4\u6613 \u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014");
  console.time("\u23F1\uFE0F \u53CD\u5E8F\u5217\u5316\u8017\u65F6");
  const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  console.timeEnd("\u23F1\uFE0F \u53CD\u5E8F\u5217\u5316\u8017\u65F6");
  console.time("\u23F1\uFE0F \u53D1\u9001\u4EA4\u6613\u8017\u65F6");
  const res = await sendTransaction(transaction, connection2);
  console.timeEnd("\u23F1\uFE0F \u53D1\u9001\u4EA4\u6613\u8017\u65F6");
  console.log("\u{1F680} ~ Buy ~ res:", res);
  console.timeEnd("\u2705 \u6240\u6709\u6D41\u7A0B\u5B8C\u6210!");
};

// src/useTransactions.tsx
function useBoomTransactions() {
  const { user, sendTransaction } = useBoomWallet();
  const wallet = user == null ? void 0 : user.wallet;
  const sendBuyTransaction = async () => {
    if (!(wallet == null ? void 0 : wallet.address) || !sendTransaction || !connection) return;
    const transaction = await buy(wallet == null ? void 0 : wallet.address, sendTransaction, connection);
    console.log("\u{1F680} ~ sendBuyTransaction ~ transaction:", transaction);
  };
  return { sendBuyTransaction };
}

// src/index.ts
if (typeof window !== "undefined") {
  window.Buffer = Buffer2;
}
export {
  BoomWalletProvider,
  WalletConnectButton,
  useBoomTransactions,
  useBoomWallet
};
