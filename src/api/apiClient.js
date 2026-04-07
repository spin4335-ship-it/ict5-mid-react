import axios from "axios";

const getBaseUrl = () => {
    const { hostname, port, protocol } = window.location;

    if (hostname === "localhost" && port === "5173") {
        console.log("[Environment]: Web Browser (localhost:5173)");
        return "/api";
    }

    const isCapacitor =
        (hostname === "localhost" && port === "") ||
        protocol === "capacitor:" ||
        window.Capacitor?.isNativePlatform?.();

    if (isCapacitor) {
        console.log("[Environment]: Android App (Capacitor)");

        return "http://10.0.2.2:8080/api";
    }

    return import.meta.env.VITE_API_URL || "http://10.0.2.2:8080/api";
};

const apiClient = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthPath =
            originalRequest.url.includes("/auth/login") ||
            originalRequest.url.includes("/auth/signup") ||
            originalRequest.url.includes("/auth/refresh");

        if (isAuthPath || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${apiClient.defaults.baseURL}/auth/refresh`,
                    {},
                    {
                        withCredentials: true,
                    },
                );

                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("user");

                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        console.error("❌ [API Error]:", error.message);
        return Promise.reject(error);
    },
);

export default apiClient;
