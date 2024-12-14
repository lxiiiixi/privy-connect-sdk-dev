// src/index.ts
import { Buffer as Buffer2 } from "buffer";

// src/BoomWalletProvider.tsx
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

// src/constant.ts
var INJECTED_WALLET_CLIENT = ["metamask", "phantom"];
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
      http: [SOLANA_MAINNET_CLUSTER.rpcUrl],
      webSocket: [SOLANA_MAINNET_CLUSTER.rpcUrl]
    }
  }
};

// src/BoomWalletProvider.tsx
import { jsx } from "react/jsx-runtime";
function BoomWalletProvider({ appId, children }) {
  const solanaConnectors = toSolanaWalletConnectors({
    // By default, shouldAutoConnect is enabled
    shouldAutoConnect: false
  });
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
          // loginMessage: "Welcome to the app",
          walletChainType: "solana-only",
          // 展示支持链的钱包类型
          walletList: ["phantom", "metamask", "okx_wallet", "detected_wallets"]
          // 可以选择的钱包列表 WalletListEntry
          // 'metamask' | 'coinbase_wallet' | 'rainbow' | 'phantom' | 'zerion' | 'cryptocom' | 'uniswap' | 'okx_wallet' | 'universal_profile'
        },
        // Display email and wallet as login methods
        loginMethods: ["email", "wallet"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true
          }
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors
          }
        },
        embeddedWallets: {
          // createOnLogin: "all-users",
          // showWalletUIs: false,
          // createOnLogin: 'off',
          // requireUserPasswordOnCreate: false,
        },
        mfa: {
          noPromptOnMfaRequired: false
        },
        supportedChains: [SOLANA_CHAIN],
        solanaClusters: [SOLANA_MAINNET_CLUSTER]
      },
      children
    }
  );
}

// src/useBoomWallet.tsx
import {
  usePrivy,
  useSendTransaction,
  useSolanaWallets
} from "@privy-io/react-auth";
import { useEffect } from "react";
import bs58 from "bs58";
var useBoomWallet = () => {
  const {
    user,
    ready: readyUser,
    authenticated,
    login,
    connectWallet,
    logout,
    signMessage: signMessageByPrivy
  } = usePrivy();
  const { sendTransaction } = useSendTransaction();
  console.log(user);
  const {
    ready: readySolanaWallets,
    wallets: embeddedSolanaWallets,
    createWallet,
    exportWallet
  } = useSolanaWallets();
  const embeddedWallet = embeddedSolanaWallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const externalWallet = embeddedSolanaWallets.find(
    (wallet) => INJECTED_WALLET_CLIENT.includes(wallet.walletClientType)
  );
  console.log("solanaWallets", embeddedSolanaWallets, embeddedWallet);
  const userSolanaWallet = externalWallet || embeddedWallet;
  useEffect(() => {
    if (!authenticated || !readyUser) return;
    if (userSolanaWallet || (user == null ? void 0 : user.wallet)) return;
    try {
      console.log("createWallet");
      createWallet();
    } catch (error) {
      console.warn(error);
    }
  }, [embeddedWallet, authenticated]);
  const signMessage = async (message) => {
    const messageBuffer = new TextEncoder().encode(message);
    const signature = await (embeddedWallet == null ? void 0 : embeddedWallet.signMessage(messageBuffer));
    console.log("\u{1F680} ~ signMessage ~ signature:", signature);
    if (!signature) return null;
    const base58Signature = bs58.encode(signature);
    const hexSignature = Buffer.from(signature).toString("hex");
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
      wallet: user == null ? void 0 : user.wallet,
      // 当前用户默认的钱包
      email: user == null ? void 0 : user.email
    },
    authenticated,
    login,
    connectWallet,
    logout,
    wallet: userSolanaWallet,
    signMessage,
    signMessageByPrivy
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
  var _a, _b, _c;
  const { login } = useLogin({
    onComplete: () => onComplete == null ? void 0 : onComplete()
  });
  const { connectWallet, user, authenticated, logout } = usePrivy2();
  const balance = useSolanaBalance(((_a = user == null ? void 0 : user.wallet) == null ? void 0 : _a.address) || "");
  console.log("\u{1F680} ~ balance:", balance);
  if (!user || !authenticated)
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx2(
        "button",
        {
          className: `privy-wallet-connect-button wallet-connect-base ${className}`,
          onClick: login,
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "privy-wallet-dropdown", children: [
      /* @__PURE__ */ jsxs("div", { className: "privy-user-info", children: [
        "(",
        (balance / 1e9).toFixed(2),
        " SOL)",
        " ",
        formatAddress(((_b = user.email) == null ? void 0 : _b.address) || ((_c = user.wallet) == null ? void 0 : _c.address))
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "privy-dropdown-content", children: /* @__PURE__ */ jsx2("button", { className: "dropdown-item", onClick: logout, children: "Logout" }) })
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
                padding: 8px 0;
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
            }

            .dropdown-item:hover {
                background-color: #f5f5f5;
            }
        ` })
  ] });
}

// src/index.ts
if (typeof window !== "undefined") {
  window.Buffer = Buffer2;
}
export {
  BoomWalletProvider,
  WalletConnectButton,
  useBoomWallet
};
