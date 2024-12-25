// src/index.ts
import { Buffer as Buffer2 } from "buffer";

// src/BoomWalletProvider.tsx
import { useCallback, useMemo } from "react";
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
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { jsx } from "react/jsx-runtime";
function BoomWalletProvider({ appId, clientId, children }) {
  const onError = useCallback((error) => {
    console.error(error);
  }, []);
  const wallets = useMemo(() => {
    return [new SolflareWalletAdapter()];
  }, []);
  return /* @__PURE__ */ jsx(
    PrivyProvider,
    {
      appId,
      clientId,
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
      children: /* @__PURE__ */ jsx(ConnectionProvider, { endpoint: SOLANA_MAINNET_CLUSTER.rpcUrl, children: /* @__PURE__ */ jsx(WalletProvider, { wallets, onError, autoConnect: true, children }) })
    }
  );
}

// src/wallets/useExternalWallet.ts
import {
  useWallet
} from "@solana/wallet-adapter-react";

// src/solana.ts
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

// src/utils.ts
var logger = (() => {
  const isDev = process.env.NODE_ENV === "development";
  const formatMessage = (level) => {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    return `[${timestamp}] [${level}]`;
  };
  return {
    log: (...messages) => {
      if (isDev) {
        console.log(formatMessage("LOG"), messages);
      } else {
        console.debug(formatMessage("LOG"), messages);
      }
    },
    warn: (...messages) => {
      if (isDev) {
        console.warn(formatMessage("WARN"), messages);
      }
    },
    error: (...messages) => {
      if (isDev) {
        console.error(formatMessage("ERROR"), messages);
      }
    },
    info: (...messages) => {
      if (isDev) {
        console.info(formatMessage("INFO"), messages);
      }
    }
  };
})();

// src/solana.ts
var connection = new Connection(SOLANA_MAINNET_RPC_URL, "confirmed");
var useSolanaBalance = (address) => {
  const [balance, setBalance] = useState(0);
  const fetchUpdateBalance = async () => {
    try {
      const publicKey = new PublicKey(address);
      const balance2 = await connection.getBalance(publicKey);
      logger.log(`Balance of ${address}: ${balance2 / 1e9} SOL`);
      return balance2;
    } catch (error) {
      logger.error("Failed to get balance:", error);
      return 0;
    }
  };
  useEffect(() => {
    if (!!address) {
      fetchUpdateBalance().then(setBalance);
    }
  }, [address]);
  return { balance, fetchUpdateBalance };
};

// src/request.ts
import axios from "axios";
var headers = {
  "Content-Type": "application/json"
};
var API_BASE_URL = "https://test.boom.meme/";
var instance = axios.create({
  baseURL: API_BASE_URL,
  headers,
  timeout: 1e5
  // 100s
});
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    logger.error("Request error:", error);
    throw error;
  }
);
var API_REQUEST = {
  getTransaction: (payload) => instance.post("/privy/jupiter/transaction", payload),
  sendDelegateTransaction: (payload, accessToken) => instance.post("/privy/jupiter/sendTransaction", payload, {
    headers: {
      "privy-auth-token": `Bearer ${accessToken}`
    }
  })
};
var request_default = API_REQUEST;

// src/wallets/useExternalWallet.ts
import { VersionedTransaction } from "@solana/web3.js";
var useExternalWallet = () => {
  const walletState = useWallet();
  const {
    autoConnect,
    connected,
    connecting,
    disconnect,
    disconnecting,
    publicKey,
    select,
    wallet,
    wallets,
    sendTransaction
  } = walletState;
  logger.log(
    "\u{1F680} ~ CustomWalletButton ~ connect:",
    connected,
    publicKey,
    publicKey == null ? void 0 : publicKey.toString(),
    wallet,
    wallets
  );
  if (!wallet) return null;
  const trade = async (payload) => {
    const { inputTokenAddress, outputTokenAddress, amountIn, slippage } = payload;
    if (!(publicKey == null ? void 0 : publicKey.toString()) || !sendTransaction || !connection) return;
    const res = await request_default.getTransaction({
      userPublicKey: publicKey == null ? void 0 : publicKey.toString(),
      inputToken: inputTokenAddress,
      outputToken: outputTokenAddress,
      amount: amountIn,
      slippage: slippage || 50
    });
    const swapTransactionBuf = Buffer.from(res.data, "base64");
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    const signature = await sendTransaction(transaction, connection);
    return signature;
  };
  return {
    ...walletState,
    wallets,
    select,
    wallet,
    disconnect,
    publicKey,
    trade
  };
};

// src/wallets/usePrivyEmbeddedWallet.tsx
import {
  useDelegatedActions,
  usePrivy,
  useSolanaWallets
} from "@privy-io/react-auth";
import { useEffect as useEffect2 } from "react";
import bs58 from "bs58";
var usePrivyEmbeddedWallet = () => {
  const {
    user,
    ready: readyUser,
    authenticated,
    login,
    connectWallet,
    logout,
    getAccessToken
  } = usePrivy();
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
  useEffect2(() => {
    if (!authenticated || !readyUser) return;
    if (userEmbeddedWallet || (user == null ? void 0 : user.wallet)) return;
    if (loginType !== "EMAIL") return;
    try {
      logger.log("CreateWallet");
      createWallet();
    } catch (error) {
      logger.warn(error);
    }
  }, [userEmbeddedWallet, authenticated]);
  useEffect2(() => {
    const getToken = async () => {
      const accessToken = await getAccessToken();
      logger.log("accessToken", accessToken);
    };
    getToken();
  }, []);
  logger.log(
    "solanaWallets",
    user,
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
      logger.warn("Failed to sign message");
      return null;
    }
    const base58Signature = bs58.encode(signature);
    const hexSignature = Buffer.from(signature).toString("hex");
    logger.log("signMessage success", base58Signature, hexSignature);
    return {
      signature: base58Signature,
      // base58 格式
      hexSignature
      // hex 格式
    };
  };
  const trade = async (payload) => {
    const { inputTokenAddress, outputTokenAddress, amountIn, slippage } = payload;
    if (!(userEmbeddedWallet == null ? void 0 : userEmbeddedWallet.address)) return "";
    const accessToken = await getAccessToken();
    const res = await request_default.sendDelegateTransaction(
      {
        userPublicKey: userEmbeddedWallet.address,
        inputToken: inputTokenAddress,
        outputToken: outputTokenAddress,
        amount: amountIn,
        slippage: slippage || 50
      },
      accessToken != null ? accessToken : void 0
    );
    logger.log(res);
    return res;
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
    logout,
    trade
  };
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
    logger.log(walletToDelegate, isAlreadyDelegated);
    if (isAlreadyDelegated) return;
    if (walletToDelegate && walletToDelegate.address) {
      logger.log(isAlreadyDelegated, walletToDelegate.address);
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

// src/wallets/useBoomWallet.tsx
var useBoomWallet = () => {
  var _a, _b;
  const privyEmbeddedWallet = usePrivyEmbeddedWallet();
  const externalWallet = useExternalWallet();
  if (privyEmbeddedWallet.user.wallet) {
    const { trade, logout, exportWallet, user, authenticated } = privyEmbeddedWallet;
    return {
      type: "EMAIL",
      email: (_a = user.email) == null ? void 0 : _a.address,
      isConnected: authenticated,
      walletAddress: (_b = user.wallet) == null ? void 0 : _b.address,
      exportWallet,
      disconnect: logout,
      transactions: {
        trade: (payload) => trade(payload)
      }
    };
  }
  if (externalWallet == null ? void 0 : externalWallet.wallet) {
    const { trade, disconnect, publicKey } = externalWallet;
    return {
      type: "WALLET",
      email: void 0,
      isConnected: externalWallet.connected,
      walletAddress: publicKey == null ? void 0 : publicKey.toString(),
      exportWallet: void 0,
      disconnect,
      transactions: {
        trade: (payload) => trade(payload)
      }
    };
  }
  return {
    type: "NONE",
    isConnected: false,
    walletAddress: "",
    exportWallet: void 0,
    disconnect: void 0,
    transactions: {
      trade: () => Promise.resolve("")
    }
  };
};

// src/WalletConnectButton.tsx
import { useLogin } from "@privy-io/react-auth";
import { useEffect as useEffect3, useState as useState2 } from "react";
import { useWallet as useWallet2 } from "@solana/wallet-adapter-react";

// src/componnets/Modal.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Modal({
  isOpen,
  onClose,
  children
}) {
  return /* @__PURE__ */ jsx2("div", { className: "modal_overlay", onClick: onClose, children: /* @__PURE__ */ jsx2("div", { className: "modal_content", onClick: (e) => e.stopPropagation(), children }) });
}
var Modal_default = Modal;

// src/assets/privy_dark.png
var privy_dark_default = "./privy_dark-RKT5Z5ZY.png";

// src/componnets/Divider.tsx
import { Fragment, jsx as jsx3, jsxs } from "react/jsx-runtime";
function Divider() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx3("div", { className: "divider", children: /* @__PURE__ */ jsx3("span", { className: "divider-text", children: "OR" }) }),
    /* @__PURE__ */ jsx3("style", { children: `
/* \u5206\u5272\u7EBF\u5BB9\u5668 */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 18px 0; /* \u4E0A\u4E0B\u95F4\u8DDD */
  position: relative;
}

/* \u5DE6\u53F3\u7EBF\u6761 */
.divider::before,
.divider::after {
  content: "";
  flex-grow: 1; /* \u586B\u5145\u5269\u4F59\u7A7A\u95F4 */
  height: 1.5px; /* \u7EBF\u6761\u9AD8\u5EA6 */
  background-color: #E4E4E7; /* \u6D45\u7070\u8272\u7EBF\u6761 */
}

/* \u4E2D\u95F4\u6587\u5B57 */
.divider-text {
  color: #000; /* \u9ED1\u8272\u6587\u672C */
  font-size: 14px; /* \u5B57\u4F53\u5927\u5C0F */
  font-weight: 500; /* \u52A0\u7C97 */
  background-color: #fff; /* \u80CC\u666F\u989C\u8272\uFF0C\u8986\u76D6\u7EBF\u6761 */
  padding: 0 16px; /* \u5185\u8FB9\u8DDD\uFF0C\u589E\u52A0\u5DE6\u53F3\u7A7A\u95F4 */
}

            ` })
  ] });
}
var Divider_default = Divider;

// src/WalletConnectButton.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var formatAddress = (address) => {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 3)}...${address.slice(-4)}`;
};
function WalletConnectButton({
  className,
  hideConnectByWallets = false
}) {
  const boomWallet = useBoomWallet();
  logger.log("\u{1F680} ~ boomWallet:", boomWallet);
  const userWalletAddress = boomWallet == null ? void 0 : boomWallet.walletAddress;
  const { balance, fetchUpdateBalance } = useSolanaBalance(userWalletAddress || "");
  const { option, onDelegate, onRevoke } = useBoomWalletDelegate();
  const [isOpen, setIsOpen] = useState2(false);
  useEffect3(() => {
    if (boomWallet == null ? void 0 : boomWallet.walletAddress) {
      setIsOpen(false);
    }
  }, [boomWallet == null ? void 0 : boomWallet.walletAddress]);
  if (!boomWallet || !(boomWallet == null ? void 0 : boomWallet.isConnected))
    return /* @__PURE__ */ jsxs2("div", { className: "boom_privy_button_container", children: [
      /* @__PURE__ */ jsx4(
        ConnectWalletModal,
        {
          isOpen,
          onClose: () => setIsOpen(false),
          hideConnectByWallets
        }
      ),
      /* @__PURE__ */ jsx4(
        "button",
        {
          className: `privy-wallet-button wallet-connect-base ${className}  red-button`,
          onClick: () => setIsOpen(true),
          children: "Connect Wallet"
        }
      )
    ] });
  return /* @__PURE__ */ jsx4("div", { className: "boom_privy_button_container", children: /* @__PURE__ */ jsxs2("div", { className: "privy_wallet_dropdown", children: [
    /* @__PURE__ */ jsxs2("div", { className: "privy_user_info", onClick: fetchUpdateBalance, children: [
      "(",
      (balance / 1e9).toFixed(4),
      " SOL) ",
      formatAddress(userWalletAddress)
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "privy_dropdown_content", children: [
      /* @__PURE__ */ jsx4("button", { className: "privy_dropdown_item", onClick: boomWallet.disconnect, children: "Logout" }),
      boomWallet.type === "EMAIL" && /* @__PURE__ */ jsx4("button", { className: "privy_dropdown_item", onClick: boomWallet.exportWallet, children: "Export Wallet" }),
      boomWallet.type === "EMAIL" && option && /* @__PURE__ */ jsx4(
        "button",
        {
          className: "privy_dropdown_item",
          onClick: option === "DELEGATE" ? onDelegate : onRevoke,
          children: option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"
        }
      )
    ] })
  ] }) });
}
function ExternalWalletList() {
  const { wallets, select } = useWallet2();
  console.log("\u3010XXXXX\u3011 \u{1F680} ExternalWalletList \u{1F680} wallets:", wallets);
  const [showAll, setShowAll] = useState2(false);
  const visibleWallets = showAll ? wallets : wallets.slice(0, 2);
  return /* @__PURE__ */ jsxs2("div", { className: "privy_wallet_list_container", children: [
    visibleWallets.map((wallet) => /* @__PURE__ */ jsxs2(
      "button",
      {
        onClick: () => {
          select(wallet.adapter.name);
        },
        className: "privy_wallet_list_item",
        children: [
          /* @__PURE__ */ jsx4("img", { src: wallet.adapter.icon, alt: wallet.adapter.name, width: 24 }),
          /* @__PURE__ */ jsxs2("div", { className: "privy_wallet_list_item_name", children: [
            " ",
            wallet.adapter.name,
            " "
          ] })
        ]
      },
      wallet.adapter.name
    )),
    !showAll && /* @__PURE__ */ jsx4(
      "div",
      {
        className: "privy_wallet_list_more",
        onClick: () => setShowAll(true),
        children: "More Wallets"
      }
    )
  ] });
}
function PrivyLogin({ onClose }) {
  const [email, setEmail] = useState2("");
  const { login } = useLogin({
    onComplete: () => {
    }
  });
  return /* @__PURE__ */ jsxs2("div", { className: "privy_login_container", children: [
    /* @__PURE__ */ jsx4("div", { className: "privy_login_title", children: "Protected by Privy" }),
    /* @__PURE__ */ jsxs2("div", { className: "privy_email_form", children: [
      /* @__PURE__ */ jsx4("img", { src: privy_dark_default, alt: "email", width: 20 }),
      /* @__PURE__ */ jsx4(
        "input",
        {
          type: "email",
          placeholder: "your@email.com",
          id: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsx4("div", { className: "privy_login_mpc_tip", children: "MPC wallet is more SECURE" }),
    /* @__PURE__ */ jsx4(
      "button",
      {
        className: "privy_login_submit_button",
        type: "submit",
        onClick: () => {
          onClose();
          login({
            type: "email",
            prefill: {
              type: "email",
              value: email
            }
          });
        },
        children: "Submit"
      }
    )
  ] });
}
function ConnectWalletModal({
  isOpen,
  onClose,
  hideConnectByWallets
}) {
  return /* @__PURE__ */ jsxs2(Modal_default, { isOpen, onClose, children: [
    /* @__PURE__ */ jsx4("h4", { className: "modal_title", children: "Log in or Sign up" }),
    /* @__PURE__ */ jsx4(PrivyLogin, { onClose }),
    !hideConnectByWallets && /* @__PURE__ */ jsx4(Divider_default, {}),
    !hideConnectByWallets && /* @__PURE__ */ jsx4(ExternalWalletList, {})
  ] });
}

// src/index.ts
if (typeof window !== "undefined") {
  window.Buffer = Buffer2;
}
if (typeof window !== "undefined") {
  const isDev = process.env.NODE_ENV === "development";
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = isDev ? "node_modules/boom-wallet-sdk/dist/index.css" : "https://cdn.jsdelivr.net/npm/boom-wallet-sdk/dist/index.css";
  document.head.appendChild(link);
}
export {
  BoomWalletProvider,
  WalletConnectButton,
  useBoomWallet
};
