"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BoomWalletProvider: () => BoomWalletProvider,
  WalletConnectButton: () => WalletConnectButton,
  useBoomWallet: () => useBoomWallet
});
module.exports = __toCommonJS(src_exports);
var import_buffer = require("buffer");

// src/BoomWalletProvider.tsx
var import_react = require("react");
var import_react_auth = require("@privy-io/react-auth");

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
var import_wallet_adapter_wallets = require("@solana/wallet-adapter-wallets");
var import_wallet_adapter_react = require("@solana/wallet-adapter-react");
var import_jsx_runtime = require("react/jsx-runtime");
function BoomWalletProvider({ appId, children }) {
  const onError = (0, import_react.useCallback)((error) => {
    console.error(error);
  }, []);
  const wallets = (0, import_react.useMemo)(() => {
    return [new import_wallet_adapter_wallets.PhantomWalletAdapter(), new import_wallet_adapter_wallets.SolflareWalletAdapter()];
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_auth.PrivyProvider,
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
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_wallet_adapter_react.ConnectionProvider, { endpoint: SOLANA_MAINNET_CLUSTER.rpcUrl, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_wallet_adapter_react.WalletProvider, { wallets, onError, autoConnect: true, children }) })
    }
  );
}

// src/wallets/useExternalWallet.ts
var import_wallet_adapter_react2 = require("@solana/wallet-adapter-react");

// src/lib/buy.ts
var import_web3 = require("@solana/web3.js");
var import_cross_fetch = __toESM(require("cross-fetch"));
async function fetchQuote(inputMint, outputMint, amount, slippageBps, excludeDexes = []) {
  try {
    console.log("\u{1F680} \u6B63\u5728\u8C03\u7528api\u83B7\u53D6\u62A5\u4EF7 \u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014");
    const excludeDexesParam = excludeDexes.length > 0 ? `&excludeDexes=${excludeDexes.join(",")}` : "";
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}${excludeDexesParam}`;
    const response = await (0, import_cross_fetch.default)(quoteUrl);
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
    const response = await (0, import_cross_fetch.default)(swapUrl, {
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
var buyTokenBySol = async (userWalletAddress, sendTransaction, connection2) => {
  if (!userWalletAddress) return;
  if (!sendTransaction) return;
  if (!connection2) return;
  console.log("\u53C2\u6570\u6709\u6548");
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
  const transaction = import_web3.VersionedTransaction.deserialize(swapTransactionBuf);
  console.timeEnd("\u23F1\uFE0F \u53CD\u5E8F\u5217\u5316\u8017\u65F6");
  console.time("\u23F1\uFE0F \u53D1\u9001\u4EA4\u6613\u8017\u65F6");
  const res = await sendTransaction(transaction, connection2);
  console.timeEnd("\u23F1\uFE0F \u53D1\u9001\u4EA4\u6613\u8017\u65F6");
  console.log("\u{1F680} ~ Buy ~ res:", res);
  console.timeEnd("\u2705 \u6240\u6709\u6D41\u7A0B\u5B8C\u6210!");
};

// src/solana.ts
var import_web32 = require("@solana/web3.js");
var import_react2 = require("react");
var connection = new import_web32.Connection(SOLANA_MAINNET_RPC_URL, "confirmed");
var useSolanaBalance = (address) => {
  const [balance, setBalance] = (0, import_react2.useState)(0);
  const getBalance = async (address2) => {
    try {
      const publicKey = new import_web32.PublicKey(address2);
      const balance2 = await connection.getBalance(publicKey);
      console.log(`Balance of ${address2}: ${balance2 / 1e9} SOL`);
      return balance2;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  };
  (0, import_react2.useEffect)(() => {
    if (!!address) {
      getBalance(address).then(setBalance);
    }
  }, [address]);
  return balance;
};

// src/wallets/useExternalWallet.ts
var useExternalWallet = () => {
  const walletState = (0, import_wallet_adapter_react2.useWallet)();
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
  console.log(
    "\u{1F680} ~ CustomWalletButton ~ connect:",
    connected,
    publicKey,
    publicKey == null ? void 0 : publicKey.toString(),
    wallet,
    wallets
  );
  if (!wallet) return null;
  const buy = async () => {
    if (!(publicKey == null ? void 0 : publicKey.toString()) || !sendTransaction || !connection) return;
    const signature = await buyTokenBySol(publicKey == null ? void 0 : publicKey.toString(), sendTransaction, connection);
    return signature;
  };
  return {
    ...walletState,
    wallets,
    select,
    wallet,
    disconnect,
    publicKey,
    buy
  };
};

// src/wallets/usePrivyEmbeddedWallet.tsx
var import_react_auth2 = require("@privy-io/react-auth");
var import_react3 = require("react");
var import_bs58 = __toESM(require("bs58"));
var usePrivyEmbeddedWallet = () => {
  const { user, ready: readyUser, authenticated, login, connectWallet, logout } = (0, import_react_auth2.usePrivy)();
  const { sendSolanaTransaction } = (0, import_react_auth2.useSendSolanaTransaction)();
  const {
    ready: readySolanaWallets,
    wallets: embeddedSolanaWallets,
    createWallet,
    exportWallet
  } = (0, import_react_auth2.useSolanaWallets)();
  const userEmbeddedWallet = embeddedSolanaWallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const loginType = (user == null ? void 0 : user.email) ? "EMAIL" : "WALLET";
  (0, import_react3.useEffect)(() => {
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
  console.log(
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
      console.warn("Failed to sign message");
      return null;
    }
    const base58Signature = import_bs58.default.encode(signature);
    const hexSignature = Buffer.from(signature).toString("hex");
    console.log("signMessage success", base58Signature, hexSignature);
    return {
      signature: base58Signature,
      // base58 格式
      hexSignature
      // hex 格式
    };
  };
  const buy = async () => {
    if (!(userEmbeddedWallet == null ? void 0 : userEmbeddedWallet.address)) return "";
    const signature = await buyTokenBySol(
      userEmbeddedWallet.address,
      userEmbeddedWallet.sendTransaction,
      connection
    );
    return signature;
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
    buy
  };
};
var useBoomWalletDelegate = () => {
  var _a, _b, _c;
  const privyEmbeddedWallet = usePrivyEmbeddedWallet();
  const wallet = (_a = privyEmbeddedWallet == null ? void 0 : privyEmbeddedWallet.user) == null ? void 0 : _a.wallet;
  const { delegateWallet, revokeWallets } = (0, import_react_auth2.useDelegatedActions)();
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

// src/wallets/useBoomWallet.tsx
var useBoomWallet = () => {
  var _a, _b;
  const privyEmbeddedWallet = usePrivyEmbeddedWallet();
  const externalWallet = useExternalWallet();
  if (privyEmbeddedWallet.user.wallet) {
    const { buy, logout, exportWallet, user, authenticated } = privyEmbeddedWallet;
    return {
      type: "EMAIL",
      email: (_a = user.email) == null ? void 0 : _a.address,
      isConnected: authenticated,
      walletAddress: (_b = user.wallet) == null ? void 0 : _b.address,
      exportWallet,
      disconnect: logout,
      transactions: {
        buy: () => buy()
      }
    };
  }
  if (externalWallet == null ? void 0 : externalWallet.wallet) {
    const { buy, disconnect, publicKey } = externalWallet;
    return {
      type: "WALLET",
      email: void 0,
      isConnected: externalWallet.connected,
      walletAddress: publicKey == null ? void 0 : publicKey.toString(),
      exportWallet: void 0,
      disconnect,
      transactions: {
        buy: () => externalWallet.buy()
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
      buy: () => Promise.resolve("")
    }
  };
};

// src/WalletConnectButton.tsx
var import_react_auth3 = require("@privy-io/react-auth");
var import_react4 = require("react");
var import_wallet_adapter_react3 = require("@solana/wallet-adapter-react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var formatAddress = (address) => {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 3)}...${address.slice(-4)}`;
};
function WalletConnectButton({ className }) {
  const boomWallet = useBoomWallet();
  console.log("\u{1F680} ~ boomWallet:", boomWallet);
  const userWalletAddress = boomWallet == null ? void 0 : boomWallet.walletAddress;
  const balance = useSolanaBalance(userWalletAddress || "");
  const { option, onDelegate, onRevoke } = useBoomWalletDelegate();
  const [isOpen, setIsOpen] = (0, import_react4.useState)(false);
  console.log("\u{1F680} ~ WalletConnectButton ~ isOpen:", isOpen);
  (0, import_react4.useEffect)(() => {
    if (boomWallet == null ? void 0 : boomWallet.walletAddress) {
      setIsOpen(false);
    }
  }, [boomWallet == null ? void 0 : boomWallet.walletAddress]);
  if (!boomWallet || !(boomWallet == null ? void 0 : boomWallet.isConnected))
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ConnectWalletModal, { isOpen, onClose: () => setIsOpen(false) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          className: `privy-wallet-connect-button wallet-connect-base ${className}  red-button`,
          onClick: () => setIsOpen(true),
          children: "Connect Wallet"
        }
      )
    ] });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "privy-wallet-dropdown", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "privy-user-info", children: [
      "(",
      (balance / 1e9).toFixed(2),
      " SOL) ",
      formatAddress(userWalletAddress)
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "privy-dropdown-content", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "dropdown-item", onClick: boomWallet.disconnect, children: "Logout" }),
      boomWallet.type === "EMAIL" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "dropdown-item", onClick: boomWallet.exportWallet, children: "Export Wallet" }),
      boomWallet.type === "EMAIL" && option && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          className: "dropdown-item",
          onClick: option === "DELEGATE" ? onDelegate : onRevoke,
          children: option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate"
        }
      )
    ] })
  ] }) });
}
function Modal({
  isOpen,
  onClose,
  children
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "modal-overlay", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children }) }) });
}
function ExternalWalletList() {
  const { wallets, select } = (0, import_wallet_adapter_react3.useWallet)();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: wallets.map((wallet) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "button",
    {
      onClick: () => {
        select(wallet.adapter.name);
      },
      className: "wallet-list-item",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: wallet.adapter.icon, alt: wallet.adapter.name, width: 30 }),
        wallet.adapter.name
      ]
    },
    wallet.adapter.name
  )) });
}
function PrivyLogin({ onClose }) {
  const [email, setEmail] = (0, import_react4.useState)("");
  const { login } = (0, import_react_auth3.useLogin)({
    onComplete: () => onClose()
  });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "email-form", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      {
        type: "email",
        placeholder: "your@email.com",
        id: "email",
        value: email,
        onChange: (e) => setEmail(e.target.value)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "submit",
        onClick: () => {
          login({
            type: "email",
            prefill: {
              type: "email",
              value: email
            }
          });
        },
        children: "submit"
      }
    )
  ] }) });
}
function ConnectWalletModal({ isOpen, onClose }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Modal, { isOpen, onClose, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { children: "Login" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PrivyLogin, { onClose }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("hr", {}),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ExternalWalletList, {})
  ] });
}

// src/index.ts
if (typeof window !== "undefined") {
  window.Buffer = import_buffer.Buffer;
}
if (typeof window !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "node_modules/boom-wallet-sdk/dist/index.css";
  document.head.appendChild(link);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BoomWalletProvider,
  WalletConnectButton,
  useBoomWallet
});
