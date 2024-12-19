import { getAccessToken } from "@privy-io/react-auth";
import axios from "axios";

const headers = {
    "Content-Type": "application/json",
};
const API_BASE_URL = "http://localhost:8001/";
// const API_BASE_URL = "http://172.16.0.14:8001/";
const instance = axios.create({
    baseURL: API_BASE_URL,
    headers,
    timeout: 10000, // 10s
});

instance.interceptors.response.use(
    response => {
        // handle response data
        return response;
    },
    error => {
        // handle response error
        console.log("Request error:", error);
        throw error;
    }
);

const API_REQUEST = {
    getTransaction: (
        payload: {
            userPublicKey: string;
            inputToken: string;
            outputToken: string;
            amount: string;
            slippage: number;
        },
        accessToken?: string
    ) =>
        instance.post("/privy/jupiter/transaction", payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
};

export default API_REQUEST;
