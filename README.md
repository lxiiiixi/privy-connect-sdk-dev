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
    type: "EMAIL" | "WALLET" | "NONE"; // 登录类型,NONE时表示未登录
    email?: string; // 邮箱（邮箱登录时才有）
    isConnected: boolean; // 是否连接钱包
    walletAddress?: string; // 钱包地址
    transactions: {
        trade: () => void;
    };
    exportWallet?: () => void; // 导出内部钱包（前端应该用不到）
    disconnect?: () => void; // 断开钱包（前端应该用不到）
};
```

4. `useSolanaBalance` 可以用于获取和更新用户余额
