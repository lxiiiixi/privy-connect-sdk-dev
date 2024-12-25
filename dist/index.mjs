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
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx2("div", { className: "modal_overlay", onClick: onClose, children: /* @__PURE__ */ jsx2("div", { className: "modal_content", onClick: (e) => e.stopPropagation(), children }) });
}
var Modal_default = Modal;

// src/assets/index.tsx
var src_email = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAP8SURBVHgB7VivcxpBFH57vwlkBpE2iIoTEYgKJKIioqKiIqIioiKyf05lZUVFREVERUUFMhJRgag4UUFmIuhMDxbYu+33jls4KEkbkgCZyWe42z3g23ffe+/bFbQEYRgGFxcXDSI7TNOkRhuEEFbPtqntum7UA6bjiw8GQTUUYniktajSFkEI3bMsqxXHcZvv7eLk7u5uPU3VWzwW0NZBBFpT3XVLUqnhT8cMV4HhcHhkXoIQQmqdnAdB0KYNYTwecwBraUqHWutMAVqrV1BFdyqVnZ2dIzzQoAnpnu+7H4ua2jAC3985EYLyfBORZWag6frs2j3bItIMWSp5p7NbHWbEy+VyDa8i0zVLRMpeRFsGDiQ03jX3WXLatr0Hyo18zHFdp1GpVDpYgaQtAOcfWB5DKs/MWEbccZxqgThxBiuVNH3fC5AgPzGgaEMolUrNJEne4HKvOH4F8Qnwap4h+s9935dYQJfWCO4nnmcdI/fASziL838RZx2h0CPKOl/hpH56nltFLnTvWz7ctQeD8Ushktf434oZB6cu7i9xWV1KHMl5KWX8CTJBVRFcfoJ8QTWWj+P4pNQoonsAywKd8Zj5mzEuFuia3waD/pnnBSGKSFYSnat+hFsrciIaDAZNIezmbCY9xB80iu33tuDkk3IMm6HD+RkRoZ8sLc1LNC56So0zQiwLJMaPSqXcTpKU63xuBe5GPiwLKdULpRRHeeqNuAEiQKdSDlrF33Zdv24ifi1xA/4yxs6XyQcLasA/KPYPdANw8sXxL/giqs/PpK1abf/sElj8zo2JG3BlQfQ7sLoccWN3Ibf04H9rP8sCEYUnSl/OmzkR2bY4hTS/QxlLy+/KxBlMDAvoIPodPHtABflw8l4nH1OTUeKmHt8kn5T9L/jd33QNisQdWhFITK7r7+EeDzl5jWVgowaXGYLkudZ+NwioF8fj0HV1E3NzmxIs4LxWe9KKoujGObIycQMEtoW33x6NRofGXeabkFdEI+K4YwfDC5qCazJ8/9fhUIJzTKvg1sQZebk6g0SiondehPH4/X6/RbfEnRA3yOt6GwtopKnAbirFAnRgWTZklUT7+0/bq8hiGe6UuIFZwOI4SNNdwaIHikfi68Yj8XXjYRNH256dyQna6FnhdZj0hQky4tz5uKvxNXsOz9ut05ZhstOfbTSmZ4eOY6MZiWzCsugA7u/Hv9zaupAfD54YGwx+7eJpbVAqld8VfQY/oJTdQcveyPkK+37XTXHUnTZg3KYHVtjOfZg7Zp6sbHxylUnaNJg0gvmRLfXcMTObf97hJAkT13u0VeAdEn3O9wF/H+wb8HkiPtjlVc0mYd2YRFj3sGviLWFUnPsDJ1QhiqdlK8UAAAAASUVORK5CYII=";
var src_privy_dark = "data:image/jpeg;base64,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";
var src_secure = "data:image/jpeg;base64,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";

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
          className: `privy_wallet_button wallet-connect-base ${className}`,
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
    /* @__PURE__ */ jsxs2("div", { className: "privy_login_title", children: [
      "Protected by ",
      /* @__PURE__ */ jsx4("img", { src: src_privy_dark, alt: "privy", width: 56 })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "privy_email_form", children: [
      /* @__PURE__ */ jsx4("img", { src: src_email, alt: "email", width: 20 }),
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
    /* @__PURE__ */ jsxs2("div", { className: "privy_login_mpc_tip", children: [
      "MPC wallet is more ",
      /* @__PURE__ */ jsx4("img", { src: src_secure, alt: "secure", width: 80 })
    ] }),
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
