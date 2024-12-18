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

// interceptors
instance.interceptors.request.use(
    config => {
        // do something before request is sent
        const token = ""; // 拿哪个token？
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // config.headers["Authorization"] = `Bearer ${"19b7501d-6baf-4724-ae9e-b8fa7792ec45"}`;
        return config;
    },
    () => {
        // do something with request error
        throw new Error("Request Error");
    }
);
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
    getTransaction: (payload: {
        userPublicKey: string;
        inputToken: string;
        outputToken: string;
        amount: string;
        slippage: number;
    }) => instance.post("/privy/jupiter/transaction", payload),
};

export default API_REQUEST;
