## Usage

1. 在入口文件中导入 `BoomWalletProvider` 并且包裹在组件外层。

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BoomWalletProvider } from "boom-wallet-sdk";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BoomWalletProvider
            appId={import.meta.env.VITE_BOOM_APP_ID}
            clientId={import.meta.env.VITE_BOOM_CLIENT_ID}
        >
            <App />
        </BoomWalletProvider>
    </StrictMode>
);
```

2. `<WalletConnectButton />` 组件直接显示

3. 在组件中使用 `useBoomWallet` 钩子函数来获取 BoomWallet 相关数据和方法，返回的参数类型说明，可能后续会有更新，查看具体类型定义文件

```tsx
type BoomWallet = {
    privyUserId?: string; // 邮箱登录时才有的用户id
    type: "EMAIL" | "WALLET" | "NONE"; // 登录类型,NONE时表示未登录
    email?: string; // 邮箱（邮箱登录时才有）
    isConnected: boolean; // 是否连接钱包
    walletAddress?: string; // 钱包地址
    transactions: {
        trade: (payload: TradePayload) => Promise<string>; // 交易
    };
    exportWallet?: () => void; // 导出内部钱包（前端应该用不到）
    disconnect?: () => void; // 断开钱包（前端应该用不到）
    getAccessToken?: () => Promise<string | null>; // 获取accessToken(邮箱登录时)
};
```

4. `useSolanaBalance` 可以用于获取和更新用户余额

## Change Log

-   1.3.5

    -   修复部分 h5 样式。
    -   删除开发环境下的 console.log

-   1.4.0

    -   调试发现样式有点不好做兼容，所以改动比较大，但是之前的内容也都保留了，右上角的按钮需要自己写，相关的方法都保留在 **useBoomWallet **了。
    -   用法上不使用之前的 `&lt;WalletConnectButton /&gt;` 组件了，导入 `&lt;ConnectWalletModal *isOpen*={isConnectModalOpen} *onClose*={closeConnectModal} /&gt;` 组件，自己定义一个状态控制 Modal 的开关。
    -   相关的展示数据和操作方法在 BoomWallet 类型中（如下图），按钮的 ui 样式见 Figma。

-   1.4.1

    -   增加 **signMessage **方法给钱包做签名，两种钱包方法通用，方法类型为 `signMessage: (message: string) => Promise<string | null>;`\*\* \*\*

-   新版本: 1.4.2
    -   添加单币余额查询的方法 getTokenBalance，以及 hook 形式的 useTokenBalance。
    -   添加根据钱包地址获取所有关联的标准 SPL Token 的地址和余额列表方法 getAllAssociatedTokens。
    -   返回的数据类型是 BalanceTokenAmount，可以直接引入。
