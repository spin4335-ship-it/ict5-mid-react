import apiClient from "./apiClient";

export const authService = {
    login: async (credentials) => {
        const response = await apiClient.post("/auth/login", credentials);
        return response.data;
    },

    signup: async (userData) => {
        const response = await apiClient.post("/auth/signup", userData);
        return response.data;
    },

    sendEmailCode: async (email) => {
        const response = await apiClient.post("/auth/email/send-code", {
            email,
        });
        return response.data;
    },

    verifyEmailCode: async (email, code) => {
        const response = await apiClient.post("/auth/email/verify-code", {
            email,
            code,
        });
        return response.data;
    },

    sendResetEmailCode: async (email) => {
        const response = await apiClient.post("/auth/email/send-reset-code", {
            email,
        });
        return response.data;
    },

    verifyResetCode: async (email, code) => {
        const response = await apiClient.post("/auth/email/verify-reset-code", {
            email,
            code,
        });
        return response.data;
    },

    resetPassword: async (email, newPassword) => {
        const response = await apiClient.post("/auth/reset-password", {
            email,
            newPassword,
        });
        return response.data;
    },

    logout: async () => {
        try {
            const response = await apiClient.post("auth/logout");
            return response.data;
        } catch (error) {
            console.error("서버 로그아웃 중 오류:", error);
        } finally {
            localStorage.removeItem("user");
        }
    },

    checkEmailDuplicates: async (email) => {
        const response = await apiClient.get(
            `/auth/email/check?email=${encodeURIComponent(email)}`,
        );
        return response.data;
    },
};
