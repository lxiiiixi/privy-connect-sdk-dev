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
function BoomWalletProvider({ appId, clientId, children }) {
  const onError = (0, import_react.useCallback)((error) => {
    console.error(error);
  }, []);
  const wallets = (0, import_react.useMemo)(() => {
    return [new import_wallet_adapter_wallets.SolflareWalletAdapter()];
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_auth.PrivyProvider,
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
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_wallet_adapter_react.ConnectionProvider, { endpoint: SOLANA_MAINNET_CLUSTER.rpcUrl, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_wallet_adapter_react.WalletProvider, { wallets, onError, autoConnect: true, children }) })
    }
  );
}

// src/wallets/useExternalWallet.ts
var import_wallet_adapter_react2 = require("@solana/wallet-adapter-react");

// src/solana.ts
var import_web3 = require("@solana/web3.js");
var import_react2 = require("react");
var connection = new import_web3.Connection(SOLANA_MAINNET_RPC_URL, "confirmed");
var useSolanaBalance = (address) => {
  const [balance, setBalance] = (0, import_react2.useState)(0);
  const getBalance = async (address2) => {
    try {
      const publicKey = new import_web3.PublicKey(address2);
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

// src/request.ts
var import_axios = __toESM(require("axios"));
var headers = {
  "Content-Type": "application/json"
};
var API_BASE_URL = "http://localhost:8001/";
var instance = import_axios.default.create({
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
    console.log("Request error:", error);
    throw error;
  }
);
var API_REQUEST = {
  getTransaction: (payload) => instance.post("/privy/jupiter/transaction", payload),
  sendDelegateTransaction: (payload, accessToken) => instance.post("/privy/jupiter/sendTransaction", payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
};
var request_default = API_REQUEST;

// src/wallets/useExternalWallet.ts
var import_web33 = require("@solana/web3.js");

// src/tokens.ts
var import_web32 = require("@solana/web3.js");
var Token = class {
  constructor(address, name, symbol, decimals, chainId) {
    this.address = address;
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
    this.chainId = chainId;
  }
  parseAmount(amount) {
    return amount * 10 ** this.decimals;
  }
  formatAmount(amount) {
    return amount / 10 ** this.decimals;
  }
};
var TOKENS = {
  SOL: new Token(
    "So11111111111111111111111111111111111111112",
    "Solana",
    "SOL",
    import_web32.LAMPORTS_PER_SOL,
    101
  ),
  USDC: new Token("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "USDC", "USDC", 6, 101)
};
var getTokenByAddress = (address) => {
  return Object.values(TOKENS).find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );
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
  const trade = async (payload) => {
    const { tokenAddress, amountIn, op, slippage } = payload;
    const SolToken = TOKENS.SOL;
    const OpToken = getTokenByAddress(tokenAddress);
    if (!OpToken) {
      throw new Error("Token not found");
    }
    const [tokenIn, tokenOut] = op === "BUY" ? [SolToken.address, OpToken.address] : [OpToken.address, SolToken.address];
    if (!(publicKey == null ? void 0 : publicKey.toString()) || !sendTransaction || !connection) return;
    const res = await request_default.getTransaction({
      userPublicKey: publicKey == null ? void 0 : publicKey.toString(),
      inputToken: tokenIn,
      outputToken: tokenOut,
      amount: (amountIn * 10 ** OpToken.decimals).toString(),
      slippage: slippage || 50
    });
    const swapTransactionBuf = Buffer.from(res.data, "base64");
    const transaction = import_web33.VersionedTransaction.deserialize(swapTransactionBuf);
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
var import_react_auth2 = require("@privy-io/react-auth");
var import_react3 = require("react");
var import_bs58 = __toESM(require("bs58"));
var usePrivyEmbeddedWallet = () => {
  const {
    user,
    ready: readyUser,
    authenticated,
    login,
    connectWallet,
    logout,
    getAccessToken
  } = (0, import_react_auth2.usePrivy)();
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
  (0, import_react3.useEffect)(() => {
    const getToken = async () => {
      const accessToken = await getAccessToken();
      console.log("accessToken", accessToken);
    };
    getToken();
  }, []);
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
  const trade = async (payload) => {
    const { tokenAddress, amountIn, op, slippage } = payload;
    const SolToken = TOKENS.SOL;
    const OpToken = getTokenByAddress(tokenAddress);
    if (!OpToken) {
      throw new Error("Token not found");
    }
    const [tokenIn, tokenOut] = op === "BUY" ? [SolToken.address, OpToken.address] : [OpToken.address, SolToken.address];
    if (!(userEmbeddedWallet == null ? void 0 : userEmbeddedWallet.address)) return "";
    if (!(userEmbeddedWallet == null ? void 0 : userEmbeddedWallet.address)) return "";
    const accessToken = await getAccessToken();
    const res = await request_default.sendDelegateTransaction(
      {
        userPublicKey: userEmbeddedWallet.address,
        inputToken: tokenIn,
        outputToken: tokenOut,
        amount: (amountIn * 10 ** OpToken.decimals).toString(),
        slippage: slippage || 50
      },
      accessToken != null ? accessToken : void 0
    );
    console.log(res);
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
    onComplete: () => {
    }
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
          onClose();
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
