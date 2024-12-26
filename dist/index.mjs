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
      } else {
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
  const updateBalance = async () => {
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
      updateBalance().then(setBalance);
    }
  }, [address]);
  return { balance, updateBalance };
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
    trade,
    getAccessToken
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
  const delegateAllowanceStatus = isAlreadyDelegated ? "ALLOWED" : "NOT_ALLOWED";
  return {
    option,
    delegateAllowanceStatus,
    onDelegate,
    onRevoke
  };
};

// src/wallets/useBoomWallet.tsx
var useBoomWallet = () => {
  var _a, _b;
  const privyEmbeddedWallet = usePrivyEmbeddedWallet();
  const externalWallet = useExternalWallet();
  const { delegateAllowanceStatus, onDelegate, onRevoke } = useBoomWalletDelegate();
  if (privyEmbeddedWallet.user.wallet) {
    const { trade, logout, exportWallet, user, authenticated, getAccessToken } = privyEmbeddedWallet;
    return {
      privyUserId: user.id,
      type: "EMAIL",
      email: (_a = user.email) == null ? void 0 : _a.address,
      isConnected: authenticated,
      walletAddress: (_b = user.wallet) == null ? void 0 : _b.address,
      exportWallet,
      disconnect: logout,
      getAccessToken,
      delegateAllowanceStatus,
      onDelegate,
      onRevoke,
      transactions: {
        trade: (payload) => trade(payload)
      }
    };
  }
  if (externalWallet == null ? void 0 : externalWallet.wallet) {
    const { trade, disconnect, publicKey } = externalWallet;
    return {
      privyUserId: void 0,
      type: "WALLET",
      email: void 0,
      isConnected: externalWallet.connected,
      walletAddress: publicKey == null ? void 0 : publicKey.toString(),
      exportWallet: void 0,
      disconnect,
      getAccessToken: void 0,
      delegateAllowanceStatus: void 0,
      onRevoke: void 0,
      onDelegate: void 0,
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
import { useEffect as useEffect6, useState as useState5 } from "react";

// src/assets/index.tsx
var src_email_dark = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAjCAYAAADrJzjpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAP8SURBVHgB7VivcxpBFH57vwlkBpE2iIoTEYgKJKIioqKiIqIioiKyf05lZUVFREVERUUFMhJRgag4UUFmIuhMDxbYu+33jls4KEkbkgCZyWe42z3g23ffe+/bFbQEYRgGFxcXDSI7TNOkRhuEEFbPtqntum7UA6bjiw8GQTUUYniktajSFkEI3bMsqxXHcZvv7eLk7u5uPU3VWzwW0NZBBFpT3XVLUqnhT8cMV4HhcHhkXoIQQmqdnAdB0KYNYTwecwBraUqHWutMAVqrV1BFdyqVnZ2dIzzQoAnpnu+7H4ua2jAC3985EYLyfBORZWag6frs2j3bItIMWSp5p7NbHWbEy+VyDa8i0zVLRMpeRFsGDiQ03jX3WXLatr0Hyo18zHFdp1GpVDpYgaQtAOcfWB5DKs/MWEbccZxqgThxBiuVNH3fC5AgPzGgaEMolUrNJEne4HKvOH4F8Qnwap4h+s9935dYQJfWCO4nnmcdI/fASziL838RZx2h0CPKOl/hpH56nltFLnTvWz7ctQeD8Ushktf434oZB6cu7i9xWV1KHMl5KWX8CTJBVRFcfoJ8QTWWj+P4pNQoonsAywKd8Zj5mzEuFuia3waD/pnnBSGKSFYSnat+hFsrciIaDAZNIezmbCY9xB80iu33tuDkk3IMm6HD+RkRoZ8sLc1LNC56So0zQiwLJMaPSqXcTpKU63xuBe5GPiwLKdULpRRHeeqNuAEiQKdSDlrF33Zdv24ifi1xA/4yxs6XyQcLasA/KPYPdANw8sXxL/giqs/PpK1abf/sElj8zo2JG3BlQfQ7sLoccWN3Ibf04H9rP8sCEYUnSl/OmzkR2bY4hTS/QxlLy+/KxBlMDAvoIPodPHtABflw8l4nH1OTUeKmHt8kn5T9L/jd33QNisQdWhFITK7r7+EeDzl5jWVgowaXGYLkudZ+NwioF8fj0HV1E3NzmxIs4LxWe9KKoujGObIycQMEtoW33x6NRofGXeabkFdEI+K4YwfDC5qCazJ8/9fhUIJzTKvg1sQZebk6g0SiondehPH4/X6/RbfEnRA3yOt6GwtopKnAbirFAnRgWTZklUT7+0/bq8hiGe6UuIFZwOI4SNNdwaIHikfi68Yj8XXjYRNH256dyQna6FnhdZj0hQky4tz5uKvxNXsOz9ut05ZhstOfbTSmZ4eOY6MZiWzCsugA7u/Hv9zaupAfD54YGwx+7eJpbVAqld8VfQY/oJTdQcveyPkK+37XTXHUnTZg3KYHVtjOfZg7Zp6sbHxylUnaNJg0gvmRLfXcMTObf97hJAkT13u0VeAdEn3O9wF/H+wb8HkiPtjlVc0mYd2YRFj3sGviLWFUnPsDJ1QhiqdlK8UAAAAASUVORK5CYII=";
var src_privy_light = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAAaCAYAAACNU8MOAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAU4SURBVHgB7VrbVeM8EB5CuD1tOvj9dxA6CBWEDkgqCKkAtoIlFeCtgFBBvBUsWwHuYPPGHfYbI7GyPJJlYhvOnnzn6MQZ6zKam0aSidb4Z7ERUunl5aX38PAQbWxs9PC83N7evqJPAPASPT4+Rp+Jp88Ep3JZoRDcBL8j/I2s10uU+dbW1lcoPKWaAUMaYNwTi5/Zzs7O3ODrGOSeUSUFL3G3253hd6mJt7e3x51OZyiNgz5+oM/Tm5ubCO2Onp+f+2zA0rj39/cLuz0M6kDqH/1c7u7unpF/jifoe2CRpygTsuQNnr5C1omvv7u7uwubdxEQ3iEm8xvlJaB8Y4FTjUCfI2GcESsBv9cl/FyzRxuTjj11z1WfvrmOFE+Fdx5er33zY3lJYyr6mdBfmaEMhDaLjlDxBJZ3QXmv8OEYbRZ1K9jG5ubmFxT2nqikalSFH9Xnu3mHR83pNZLZPAxcbfDuUBgz5oiDMheaHJEHmKv0/ntOueyxqHhK1dEHwxfUIJ6enk7pr2JZmIkqS6E6C/cbleOQyo3FC7UEFNZ7yPHQ02Yo1L/kXxV+7Tn1fMYCFN5xP2/K5fAEjw0RiHMAXn+oOWhLn4Hx/3m94wKl70MwkrWPODxjPYzxPOZ2nj61ghK7hOQUvCYKZNHbWM6C4lNe143/3+12Du/MHJIsA+U1n/nuagLC04BWtGIIkpOgM2oOV1BozoD29vZSTHwMy+6TxT+vh5ww8TMLFXOcCH2mMJZ9MwmrCiRjVxif25uhNvM2OxFScraRq8OhGXOyeeWoOrX5hCILUQB6yAzFDMvSxKuiLHysBExO8pAsNGKSM4E+pBKgzngVxerxSfY2KTQfCe1zbV2hGV7at/pnYyqMofKAV+WqSn2qAb61ZlXAaxNyjyuF5ohKULbFCEVIIsTRg4rrYyrxwFswgZbbHvoSM37IlGtbxIr4Qg3B52EcngVyr+ksXiMkEQoJyRoIrRK9b87Hl5hlfVD9iKgZpPQ+tKJchbLQXBqSNZSxpBa5p7zVlZgtzcRMe25K9SGlZhD5Xro8tIkTNBdcoZl5qxKSNdBOUnxmII4okBs/U64KaSslFRpIbH5RQzBPnmw4lpZa5hQKXyIExUu5yCV5AFnGAnmgDLk0CryFZTNWrwJrv1Yr9FGgBGkfCOH8oJYhJULgY4I1VNqNxOSBcrrEpqsDmoFFLkSBN+Wqzf6qiJsMg+h7InkvlM5eO7Lper/XJqRESHltZJHTkJssPpAQyCOBltiEN+Wy1h0xPhh8S0TNghOKhTqs73Phs3DQF0JdFl5MLcORCBUg7cslIBLGIfWkxCyXLavTn5TeATA7bSl5iVDOUX5yUWfhUjLVtKE5EeIkocuX2v4lJdXExKxjd4Sz2gMSDsI94MHHZfeXNSB2nVAJmH2E12o4EiETSRVHcIRmE+L7wj6XF3EIZp9eD9tT8iPhc9m2BKnOiflCO3VU4WPIqX3+3DZciZCBSstfQGgW33ddtZXCYr51gMA4/f5P3fSnvN3hsNLmHtLg6wx7xjnv88DTUH/6o76qiF2nWIgsS8zlgN4J9FupLSLgGBcKkfSOLxqoAnhOyC8SEq72yJOYBX1D1TbUlufcIseYxJj+cejvwoRXQ/VpUQ4cqVxLotNz1/gYsGHDU09C6/sSM6dy9RePeOzDOnrmx1ccjrmsvzr8cHjPFQrKVZfa5+ZtBjbmhYZQbPYLS+M1eNZCtrxGHldIZqe+CgWtceKhUu8Qj0xREsf11Br1ghPFFCVRO4LSr0f+AEi7yrlr79kMAAAAAElFTkSuQmCC";
var src_arrow_down_light = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACQSURBVHgBrc7tCYQwDAbgRk7Q1ANHuVFuBDdRJ3EUR3AFR/C3grER/AI/EvWFlAaapzHm5QAfiJgCeLHvf/LGxSiznnfN9x+GlrgQbRW76DBbLPNR5vU9zRsRmV/bdqUUZczNJFMPQPV4CYIom36RbrrejIuNzQMNeolpUDEmQdXYGXobO0IfYWfobWwPlWADj2deadJksQ4AAAAASUVORK5CYII=";
var src_email_light = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGUSURBVHgBtZQvc8JAEMUv4YDDIZFIJBIZieQj8BH6UZCVlZWRlZFIZGRkJI7jf3+PuUw7GQZoCm+Gubll7+3bze5GBpzP5/52u51EUTTm6kxDwLOGo+h0Ol+cPgrE81ar5TDkcjANcTqdBhwjOErn3Ls9HA5S3LfWLjgbE1fY7XbKfobgUUwURfPmSWi32xeB8A7jYHNEfNvv9wnGRjXXO9TO4JnrTiWcDX+UlKSkZgkOYxwyPsrqUWL8J/ySOI4NZc5CY5gLOUYPWUqQDPVzTtVsiC279R2Uesh2qC5BbaqyeO9/yCsEooWUcE5CqTIeZPUSoDCRn4Rx/0RIXg9urynCccmDXKmqVFICiYIU2AZkNVWH4bNErbK72hBXyX9lkUKUQzxVqSA2oYzF8XhMe71eYW7AmjvodrtKN1ffEtBBur5H+jB5LcifEJsX4rXkYK0V0HQy69AiVCfRZaWlj1cE0FTONETmf3tGG3bKhvW0aB7JstlsNLqJeQI0VBB/aJ1ElVHpaEDUbqYh4NAaKaqh+gaqHwWuaAaajwAAAABJRU5ErkJggg==";
var src_privy_dark = "data:image/jpeg;base64,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";
var src_arrow_down_dark = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB5SURBVHgBpdLLEYAgDARQSrAEO7QEW7AEO6EES7AOkkNMDnHwh0nYmT0A4Q0HUuIAwMTdEXFOgTzu82LjktSLyrzelSq41JtW9I7Jw87DUsrqQd8wIhouQ1bUhFlRF/aHhrAvlJvDWAONYw00jmmqf5q7MQ1Do2XuAInvZxsrDiNWAAAAAElFTkSuQmCC";
var src_secure = "data:image/jpeg;base64,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";
var src_wallet = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASLSURBVHgB7VlLcttGEO0BSRn8VIU5QeATWNllZ/IEYXbZBTmBpF12ok5g6QSSTmDpBGJuwBsYPoHpKsmACQHj1wRADIgPAf6Esv2qQMxgBmC/mZ6e7h6in/iJHxuC9oherzeQkv70fXnMdU0TU89rXjnOzKIdYecE+sB8Pj+RUpxyNbuXf2bb9iXtADshwEK7rjvyffoH1UGZd0Bw6DiPE9oSWxFQVMSk7NGeQW1uIewEfWZCyGs8M8K2iW0/DWlLVCYQqQheHUH445zPTtB2oevN6QxQ3/361f1AIdlXr1qv0WzRFmiW6RQI7WG0/RMIMMjiLYSYQoXuIfRlJLTjJPvw806nZ0kZLGqoXZ+2RCGBSEUgtEkFKuJ5dGfbgT6vCr0KCL+cEc8T+yPQbnffeZ48zW5lFZG3ut66U1XkJZBJoNPpXmPkzZXHMyzGqyIVeQmkCOh610wKHyzIyOTVQWgVKQJC0HlUxoiz4GOqMRIEeNFC742waqnCwxAZsBoD2hKYzT6uBRoNGnW7XUNt1zRt5vu+9fT0NC3zvQQBCH8cf0jc873T6ZxjJkxYIoN2DGxuJ+ln/uIOI2JpGl2AyE3RNzS1Alu+NGuwMr/gIx8g/Jji3fOQMMDlmmXQ9b6R1ynXjGZZIV7QcAf2ajYxYAZ+WROiwTSEcB9AYpjlxZbZiVPm8xDAyPMexAaFiSxIYB3+viqDtuY7s+dnYq9xfOgNC47eJf83LWZ+AWM+f05trIUEsIjOXLecNdgHwv++iOpYl6lFX0TAWmcBDgGeCYpnoa/rvYHanksAG9qEagLIch+XZcKFL1jE4mPWU13XsaAaamBSVRhsVK2/qsXFAn1l+H7Sgy0VD6jQtCZ8JTmgDcG7sKY9myiOaQdYZ4VScF15R7FObgLMQPMmr5GdSZjQB1yfcEm+AMU/k2/Vja3yDLBl6Hb7r+GVbhSM6PoiMEsNQBhuvqf1SYGBuidUJsAIBdhoFvLc8fncfUclMxqAEUaJl5VVaB8IQ1czfiKuEPD/ChMq1AsNZ8segt7wfaMZ2DUQU4+iMgS7+fLl8dS20/1AEqmZ5LNazABsez8ua/9XeLUeBOAszuLyMqAqhZoQoLu4LM8RpZll363FGuCEAez9hEIrFAYybPutla6KGxF4CrUgwJDS+xcuygPFLopB+e7KcjOshQoxHMdBytEbwsrcUvEeYwUxSuBL1WYGGEwCN5PLrVb3uNEIHDdNk5yr4tQ9O3O3rvu4jFFqRUAFuyyuG5SREB5E3ugqEiqENIcV1+RvVB+8iYsiESEmCCDRtGzElI3YwaIXBscfqvsuhG+p7QkCYTZsElbZOzynFwYsE8fB0UCmMnaN1ReOjvTPGP+/w+ofR0ctPoiotL3vCpwVBIX/onqQZHDXJxna7c77KJjgi9Pt7DHSgcD/FQY1CRmy+maekQVHSu5DzhmYRftFn1ZOg7A3TKEJw6xAqPCQr93uIaWRzsUcFhwbNHMTa2tPKdkKaFpjjNl4S4dL8lqcHeezt3VnyZWOWVm1No2FyyIvZv5u8Q2TyjC6XRTrkwAAAABJRU5ErkJggg==";
var src_solana_icon = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPSSURBVHgB1VW9jiNFEK7q7vnxisAZIhtnmyDBI/giNsIgCBAJ+wb8PACbXXiI5DI2IEViswsdknGXcdmOJSQuO0tob2fcP8VX3WOvby8h4SRst3umu+qr6uqqr4j+7x8+fln9+rT72/h1nKXOz5L4xvPuJEloAoc6kdhIyQRKNhGZqLMkDixORPfE5MGJ04QoV/YAfvlHF2NcM3PHonus1plER37CJJNHBhLMxUNoSH7JsqK6JiNspHJfZANfPbqew9/f8NhlMJVRnQR12R+ThRXL3J1cZYQnCeZsjNhARDZRePmiOu/t1xfX8zGlNUROs+akkL2SvbdExXkpPwtHeTKbv1JOmkWktzY++HN23uu+Szf1T00bPjiERWIG81LAVMnkELAUowoYmVrBHRCVaDspp4lbyH/az77s96F3xptvnTU/BmvI+UQBSmyF9KAGl2VwoQmQtvhPgS3VDuADAtEmrAsFDaUjijf2Wb/4bEtv88MXq5dz0m870LbFCsaAZ2poeh/yGFR6TnnO+1mu7A956N6w7RefvHYCV1t7GUf5eMc11xTF5yBU4tlzy5F2bGhHNQwifK8iUR0RSkcBOW9QExpadi1ZH6htTq5Pr588eL446/cGDMfqGzfypr511GDUg86W9T2PV5YarFWIuRudVCPMj1aqQdcrqm6xBhnoiRttx2zWp3896Q4h0r+Hq5cdm2odqtjtWnitowmYA6GiaWyC+Dawx5pvRUIdUdmRgj6jyj3k894JZjxjr0cCLJ+/d9YfqOLh6hZG4jq42KnQ2ERRQ16NtJHHPMNoo8AJgEkiDHnIRYRPZfJ+kafQpGe3fLN8jYv0JIbr32FkDkXazQIrIAzBGJ4x+zJnj5Wfgt5NkwHBXTgNuKucyKvxK76fVhcrmTc05Kwa99lxlF1Dk7OlZFSbc0uly3zIrqIHmf++Jt44wSOcQH0ajhfhzXiU7/+uVrLc1h3jPMZF74J/CmqY16AAMSLJCKediAELImnprlYc6iNQg1rx8NNzQ6yZhVph3I3bRa2Vu37w+CPpUuA1GOvdPdEX/lUOEjbgG5syJRZizlpGeGoMuQ8op5Y/3d+8k9yZ3YOD15SyuylsPMFI7iwTJFqVQu67D6q0SBXYPO91N9al5dXnH76wGTwW8ImQld6l6PIx6+dWpAa0I+Z14QOllzNxbjZsePnL+fu97jiAf5/BJ0cQCsSDOOLFKNnDTXRcbOSeksErD/7PvWNqT1I6H3h9g8ta/vzdoj9k0SWyZtjS/H42aabsP4d8f0PmXq0A6YeLxdvtB/8AUDQqQPJlEpYAAAAASUVORK5CYII=";
var src_user_icon = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAdCAYAAAC5UQwxAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIQSURBVHgBvZZBVtswEIZnxm5fN6XuDcINyCJ9r7twAsIJEk7QsuymOHAAuAFwgsAJyA5eWJAb4Bsg2DrRoFFiIGDJcvLCv8hznjT6rBlpfgN8sjB0YnJ71NbEOzjlDiM05sFjRhxTpPuqmWYh61QCk7s04QmdMnDHvxKeGfC+ASvvNN9gcp02OMKrYkeVQsgo4qYPSr54jnEQDLMB0DDZGPimOIHJKO0xwBbUlEl9+/vosAd1gRrxDywpQui6xkprKAdFT/ABVhDF/LOsluU7nES1U/lBeXntCdYlhASCgTz13qUgMahw4BfIzO8qUKV+pWMIBdpiI5zDskK8cA05a0g5n8CSu5Te6hxzDajf0ozdgW7ZfppBXaDoqdU3u+QaUL0/i3EryJ5sE4+tY7TLF8EhmmyoVjqsWqu804zSLUY6thNivVekSMA6JmNTPL9jqCjWF2/H5cXex3mBAjN99Eoe5zMyYt6rentr0KAHC3ERb7+HLgC9/icGC3gJ0XRY9EjpuZCTfAF0S9NdAl0A/hj17wP9r7guSdVEqe9j6/928f/llG7cHh3UMNsEAmAi2fnGzeHf1xeA+XdLjne13L2ezOHiTSnFbIc5dNYIExl/pZ48WKC5Al1Ys0wqd16BwKsbboUKBs4uM97DJ4jir5sE3+wRX91wq2TupGr+y2h2cngX2ZruelhmbdK8K8/PaEPb65H1RXgAAAAASUVORK5CYII=";

// src/componnets/Selector.tsx
import { useState as useState2, useEffect as useEffect3, useRef } from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function Select({
  content,
  selectedButtonClassName,
  children
}) {
  const [isOpen, setIsOpen] = useState2(false);
  const selectRef = useRef(null);
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  useEffect3(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "select-container", ref: selectRef, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `select-button ${isOpen ? "active" : ""} ${selectedButtonClassName}`,
        onClick: toggleDropdown,
        children: [
          /* @__PURE__ */ jsx2("span", { children: content }),
          /* @__PURE__ */ jsx2("img", { src: src_arrow_down_light, className: "light_img", alt: "arrow_down", width: 10 }),
          /* @__PURE__ */ jsx2("img", { src: src_arrow_down_dark, className: "dark_img", alt: "arrow_down", width: 10 })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx2("div", { className: "select-dropdown", children }),
    /* @__PURE__ */ jsx2("style", { children: `
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
                    background-color: transparent;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background-color: var(--wallet-theme-color);

                    img {
                        margin-left: 8px;
                    }
                }

                .select-button:hover {
                    box-shadow: 0 0 0 2px var(--wallet-theme-color),
                        0 0 0 calc(2px + 2px) var(--wallet-primary-color);
                }

                .select-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background-color: var(--wallet-theme-color);
                    border: 1px solid var(--wallet-border-color);
                    border-radius: 12px;
                    overflow: hidden;
                    margin-top: 8px;
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
                    background-color: var(--wallet-bg-muted);
                }

                .dropdown-item.selected {
                    font-weight: 500;
                }

                .dropdown-item .checkmark {
                    margin-left: auto;
                    color: #ffd700;
                }

                @media (max-width: 767px) {
                    .select-container {
                        display: none;
                    }
                
                    .select-button {
                        height: 38px;
                    }
                }
            ` })
  ] });
}
var Selector_default = Select;

// src/componnets/Menu.tsx
import { useState as useState3, useEffect as useEffect4, useRef as useRef2 } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Menu({
  address,
  balance,
  buttonClassName,
  children
}) {
  const [isOpen, setIsOpen] = useState3(false);
  const selectRef = useRef2(null);
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  useEffect4(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return /* @__PURE__ */ jsxs2("div", { className: "menu-container", ref: selectRef, children: [
    /* @__PURE__ */ jsxs2("button", { className: `privy_wallet_button ${buttonClassName}`, onClick: toggleDropdown, children: [
      /* @__PURE__ */ jsx3("span", { children: " Connect Wallet " }),
      /* @__PURE__ */ jsx3("img", { src: src_wallet, alt: "arrow_right", width: 20 })
    ] }),
    isOpen && /* @__PURE__ */ jsxs2("div", { className: "menu-select-dropdown", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("span", { className: "menu-dropdown-item", style: { fontWeight: "600" }, children: [
          /* @__PURE__ */ jsx3("img", { src: src_user_icon, width: 14 }),
          " ",
          address
        ] }),
        /* @__PURE__ */ jsxs2("span", { className: "menu-dropdown-item", style: { fontWeight: "500" }, children: [
          /* @__PURE__ */ jsx3("img", { src: src_solana_icon, width: 14 }),
          balance,
          " SOL"
        ] })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "divider" }),
      children
    ] }),
    /* @__PURE__ */ jsx3("style", { children: `
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
            ` })
  ] });
}
var Menu_default = Menu;

// src/ConnectWalletModal.tsx
import { useLogin, useLoginWithEmail } from "@privy-io/react-auth";
import { useEffect as useEffect5, useState as useState4 } from "react";
import { useWallet as useWallet2 } from "@solana/wallet-adapter-react";

// src/componnets/Modal.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function Modal({
  isOpen,
  onClose,
  children
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx4("div", { className: "boom_privy_button_container modal_overlay", onClick: onClose, children: /* @__PURE__ */ jsx4("div", { className: "modal_content", onClick: (e) => e.stopPropagation(), children }) });
}
var Modal_default = Modal;

// src/componnets/Divider.tsx
import { Fragment, jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function Divider() {
  return /* @__PURE__ */ jsxs3(Fragment, { children: [
    /* @__PURE__ */ jsx5("div", { className: "divider", children: /* @__PURE__ */ jsx5("span", { className: "divider-text", children: "OR" }) }),
    /* @__PURE__ */ jsx5("style", { children: `
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 18px 0; 
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  flex-grow: 1; 
  height: 1.5px;
  background-color: var(--wallet-border-color);
}

.divider-text {
  color: var(--wallet-text-foreground-color); 
  font-size: 14px; 
  font-weight: 500; 
  padding: 0 16px;
}

            ` })
  ] });
}
var Divider_default = Divider;

// src/ConnectWalletModal.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function ExternalWalletList() {
  const { wallets, select } = useWallet2();
  logger.log("\u3010XXXXX\u3011 \u{1F680} ExternalWalletList \u{1F680} wallets:", wallets);
  const [showAll, setShowAll] = useState4(false);
  const visibleWallets = showAll ? wallets : wallets.slice(0, 2);
  return /* @__PURE__ */ jsxs4("div", { className: "privy_wallet_list_container", children: [
    visibleWallets.map((wallet) => /* @__PURE__ */ jsxs4(
      "button",
      {
        onClick: () => {
          select(wallet.adapter.name);
        },
        className: "privy_wallet_list_item",
        children: [
          /* @__PURE__ */ jsx6("img", { src: wallet.adapter.icon, alt: wallet.adapter.name, width: 24 }),
          /* @__PURE__ */ jsxs4("div", { className: "privy_wallet_list_item_name", children: [
            " ",
            wallet.adapter.name,
            " "
          ] })
        ]
      },
      wallet.adapter.name
    )),
    !showAll && /* @__PURE__ */ jsx6(
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
  const [email, setEmail] = useState4("");
  const { login } = useLogin({
    onComplete: () => {
    }
  });
  const { state, sendCode, loginWithCode } = useLoginWithEmail();
  return /* @__PURE__ */ jsxs4("div", { className: "privy_login_container", children: [
    /* @__PURE__ */ jsxs4("div", { className: "privy_login_title", children: [
      "Protected by",
      " ",
      /* @__PURE__ */ jsx6("img", { src: src_privy_light, className: "dark_img", alt: "privy", width: 56 }),
      /* @__PURE__ */ jsx6("img", { src: src_privy_dark, className: "light_img", alt: "privy_img", width: 56 })
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "input-wrapper", children: [
      /* @__PURE__ */ jsx6("img", { src: src_email_dark, className: "light_img", alt: "email", width: 20 }),
      /* @__PURE__ */ jsx6("img", { src: src_email_light, className: "dark_img", alt: "email", width: 20 }),
      /* @__PURE__ */ jsx6(
        "input",
        {
          type: "email",
          placeholder: "your@email.com",
          id: "email",
          className: "privy_email_input",
          value: email,
          autoComplete: "off",
          onChange: (e) => setEmail(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "privy_login_mpc_tip", children: [
      "MPC wallet is more ",
      /* @__PURE__ */ jsx6("img", { src: src_secure, alt: "secure", width: 80 })
    ] }),
    /* @__PURE__ */ jsx6(
      "button",
      {
        className: "privy_login_submit_button",
        type: "submit",
        onClick: () => {
          login({
            type: "email",
            prefill: {
              type: "email",
              value: email
            }
          });
          onClose();
        },
        children: "Submit"
      }
    )
  ] });
}
function ConnectWalletModal({
  isOpen,
  onClose,
  hideConnectByWallets = false
}) {
  const { walletAddress } = useBoomWallet();
  useEffect5(() => {
    if (!!walletAddress) {
      onClose();
    }
  }, [walletAddress]);
  return /* @__PURE__ */ jsxs4(Modal_default, { isOpen, onClose, children: [
    /* @__PURE__ */ jsx6("h4", { className: "modal_title", children: "Log in or Sign up" }),
    /* @__PURE__ */ jsx6(PrivyLogin, { onClose }),
    !hideConnectByWallets && /* @__PURE__ */ jsx6(Divider_default, {}),
    !hideConnectByWallets && /* @__PURE__ */ jsx6(ExternalWalletList, {})
  ] });
}
var ConnectWalletModal_default = ConnectWalletModal;

// src/WalletConnectButton.tsx
import { Fragment as Fragment2, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var formatAddress = (address) => {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 3)}...${address.slice(-4)}`;
};
function WalletConnectButton({
  buttonClassName = "",
  selectedButtonClassName = "",
  hideConnectByWallets = false
}) {
  const boomWallet = useBoomWallet();
  logger.log("\u{1F680} ~ boomWallet:", boomWallet);
  const userWalletAddress = boomWallet == null ? void 0 : boomWallet.walletAddress;
  const { balance, updateBalance } = useSolanaBalance(userWalletAddress || "");
  const { option, onDelegate, onRevoke } = useBoomWalletDelegate();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState5(false);
  const openConnectModal = () => setIsConnectModalOpen(true);
  const closeConnectModal = () => setIsConnectModalOpen(false);
  useEffect6(() => {
    if (boomWallet == null ? void 0 : boomWallet.walletAddress) {
      closeConnectModal();
    }
  }, [boomWallet == null ? void 0 : boomWallet.walletAddress]);
  if (!boomWallet || !(boomWallet == null ? void 0 : boomWallet.isConnected))
    return /* @__PURE__ */ jsxs5("div", { className: "boom_privy_button_container", children: [
      /* @__PURE__ */ jsx7(
        ConnectWalletModal_default,
        {
          isOpen: isConnectModalOpen,
          onClose: closeConnectModal,
          hideConnectByWallets
        }
      ),
      /* @__PURE__ */ jsxs5(
        "button",
        {
          className: `privy_wallet_button ${buttonClassName}`,
          onClick: openConnectModal,
          children: [
            /* @__PURE__ */ jsx7("span", { children: " Connect Wallet " }),
            /* @__PURE__ */ jsx7("img", { src: src_wallet, alt: "arrow_right", width: 20 })
          ]
        }
      )
    ] });
  return /* @__PURE__ */ jsxs5("div", { className: "boom_privy_button_container", children: [
    /* @__PURE__ */ jsx7(
      Selector_default,
      {
        selectedButtonClassName,
        content: /* @__PURE__ */ jsxs5("div", { onClick: updateBalance, children: [
          "(",
          (balance / 1e9).toFixed(4),
          " SOL) ",
          formatAddress(userWalletAddress)
        ] }),
        children: /* @__PURE__ */ jsxs5(Fragment2, { children: [
          /* @__PURE__ */ jsx7("div", { className: `dropdown-item`, onClick: boomWallet.disconnect, children: /* @__PURE__ */ jsx7("span", { children: "Logout" }) }),
          boomWallet.type === "EMAIL" && /* @__PURE__ */ jsx7("div", { className: `dropdown-item`, onClick: boomWallet.exportWallet, children: /* @__PURE__ */ jsx7("span", { children: "Export Wallet" }) }),
          boomWallet.type === "EMAIL" && option && /* @__PURE__ */ jsx7(
            "div",
            {
              className: `dropdown-item`,
              onClick: option === "DELEGATE" ? onDelegate : onRevoke,
              children: /* @__PURE__ */ jsx7("span", { children: option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate" })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs5(
      Menu_default,
      {
        balance: (balance / 1e9).toFixed(4),
        address: formatAddress(userWalletAddress),
        buttonClassName,
        children: [
          /* @__PURE__ */ jsx7("div", { className: `menu-dropdown-item`, onClick: boomWallet.disconnect, children: /* @__PURE__ */ jsx7("span", { children: "Logout" }) }),
          boomWallet.type === "EMAIL" && /* @__PURE__ */ jsx7("div", { className: `menu-dropdown-item`, onClick: boomWallet.exportWallet, children: /* @__PURE__ */ jsx7("span", { children: "Export Wallet" }) }),
          boomWallet.type === "EMAIL" && option && /* @__PURE__ */ jsx7(
            "div",
            {
              className: `menu-dropdown-item`,
              onClick: option === "DELEGATE" ? onDelegate : onRevoke,
              children: /* @__PURE__ */ jsx7("span", { children: option === "DELEGATE" ? "Approve Delegate" : "Revoke Delegate" })
            }
          )
        ]
      }
    )
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
  link.href = isDev ? "node_modules/boom-wallet-sdk/dist/index.css" : "https://cdn.jsdelivr.net/npm/boom-wallet-sdk@latest/dist/index.css";
  document.head.appendChild(link);
}
export {
  BoomWalletProvider,
  ConnectWalletModal_default as ConnectWalletModal,
  WalletConnectButton,
  useBoomWallet,
  useSolanaBalance
};
