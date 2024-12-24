import axios from "axios";
import { logger } from "./utils";

const headers = {
    "Content-Type": "application/json",
};
// const API_BASE_URL = "http://localhost:8001/";
// const API_BASE_URL = "http://172.16.0.14:8001/";
const API_BASE_URL = "https://test.boom.meme/";

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers,
    timeout: 100000, // 100s
});

instance.interceptors.response.use(
    response => {
        // handle response data
        return response;
    },
    error => {
        // handle response error
        logger.error("Request error:", error);
        throw error;
    }
);

type TransactionPayload = {
    userPublicKey: string;
    inputToken: string;
    outputToken: string;
    amount: string;
    slippage: number;
};

const API_REQUEST = {
    getTransaction: (payload: TransactionPayload) =>
        instance.post("/privy/jupiter/transaction", payload),
    sendDelegateTransaction: (payload: TransactionPayload, accessToken?: string) =>
        instance.post("/privy/jupiter/sendTransaction", payload, {
            headers: {
                "privy-auth-token": `Bearer ${accessToken}`,
            },
        }),
};

export default API_REQUEST;
