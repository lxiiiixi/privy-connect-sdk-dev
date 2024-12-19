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
  useEffect(() => {
    if (!!address) {
      getBalance(address).then(setBalance);
    }
  }, [address]);
  return balance;
};

// src/request.ts
import axios from "axios";
var headers = {
  "Content-Type": "application/json"
};
var API_BASE_URL = "http://localhost:8001/";
var instance = axios.create({
  baseURL: API_BASE_URL,
  headers,
  timeout: 1e4
  // 10s
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
  getTransaction: (payload, accessToken) => instance.post("/privy/jupiter/transaction", payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
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
    const amount = 0.01 * 1e9;
    const res = await request_default.getTransaction({
      userPublicKey: publicKey == null ? void 0 : publicKey.toString(),
      inputToken: "So11111111111111111111111111111111111111112",
      // sol
      outputToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      // 购买 usdc
      amount: amount.toString(),
      slippage: 50
      // 滑点
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
    buy
  };
};

// src/wallets/usePrivyEmbeddedWallet.tsx
import {
  useDelegatedActions,
  usePrivy,
  useSendSolanaTransaction,
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
  useEffect2(() => {
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
  const buy = async () => {
    if (!(userEmbeddedWallet == null ? void 0 : userEmbeddedWallet.address)) return "";
    const accessToken = await getAccessToken();
    const amount = 0.1 * 1e9;
    const res = await request_default.getTransaction(
      {
        userPublicKey: userEmbeddedWallet.address,
        inputToken: "So11111111111111111111111111111111111111112",
        // sol
        outputToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        // 购买 usdc
        amount: amount.toString(),
        slippage: 50
        // 滑点
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
    buy
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
import { useLogin } from "@privy-io/react-auth";
import { useEffect as useEffect3, useState as useState2 } from "react";
import { useWallet as useWallet2 } from "@solana/wallet-adapter-react";
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
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
  const [isOpen, setIsOpen] = useState2(false);
  useEffect3(() => {
    if (boomWallet == null ? void 0 : boomWallet.walletAddress) {
      setIsOpen(false);
    }
  }, [boomWallet == null ? void 0 : boomWallet.walletAddress]);
  if (!boomWallet || !(boomWallet == null ? void 0 : boomWallet.isConnected))
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx2(ConnectWalletModal, { isOpen, onClose: () => setIsOpen(false) }),
      /* @__PURE__ */ jsx2(
        "button",
        {
          className: `privy-wallet-connect-button wallet-connect-base ${className}  red-button`,
          onClick: () => setIsOpen(true),
          children: "Connect Wallet"
        }
      )
    ] });
  return /* @__PURE__ */ jsx2(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "privy-wallet-dropdown", children: [
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
  ] }) });
}
function Modal({
  isOpen,
  onClose,
  children
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx2(Fragment, { children: /* @__PURE__ */ jsx2("div", { className: "modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsx2("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children }) }) });
}
function ExternalWalletList() {
  const { wallets, select } = useWallet2();
  return /* @__PURE__ */ jsx2("div", { children: wallets.map((wallet) => /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => {
        select(wallet.adapter.name);
      },
      className: "wallet-list-item",
      children: [
        /* @__PURE__ */ jsx2("img", { src: wallet.adapter.icon, alt: wallet.adapter.name, width: 30 }),
        wallet.adapter.name
      ]
    },
    wallet.adapter.name
  )) });
}
function PrivyLogin({ onClose }) {
  const [email, setEmail] = useState2("");
  const { login } = useLogin({
    onComplete: () => {
    }
  });
  return /* @__PURE__ */ jsx2(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "email-form", children: [
    /* @__PURE__ */ jsx2(
      "input",
      {
        type: "email",
        placeholder: "your@email.com",
        id: "email",
        value: email,
        onChange: (e) => setEmail(e.target.value)
      }
    ),
    /* @__PURE__ */ jsx2(
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
  return /* @__PURE__ */ jsxs(Modal, { isOpen, onClose, children: [
    /* @__PURE__ */ jsx2("h4", { children: "Login" }),
    /* @__PURE__ */ jsx2(PrivyLogin, { onClose }),
    /* @__PURE__ */ jsx2("hr", {}),
    /* @__PURE__ */ jsx2(ExternalWalletList, {})
  ] });
}

// src/index.ts
if (typeof window !== "undefined") {
  window.Buffer = Buffer2;
}
if (typeof window !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "node_modules/boom-wallet-sdk/dist/index.css";
  document.head.appendChild(link);
}
export {
  BoomWalletProvider,
  WalletConnectButton,
  useBoomWallet
};
