import apiClient from "./apiClient";

export const userService = {
    getMyProfile: async () => {
        try {
            const response = await apiClient.get("/users/me");
            const data = response.data;
            const calculatedLevel = Math.floor((data.totalBadges || 0) / 5) + 1;
            console.log("[getMyProfile] 응답:", data);
            return { ...data, level: calculatedLevel };
        } catch (error) {
            console.error("Error fetching my profile:", error);
            throw error;
        }
    },

    getUserProfile: async (userId) => {
        const response = await apiClient.get(`/users/${userId}`);
        console.log("[getUserProfile]", userId, "응답:", response.data);
        return response.data;
    },

    updateProfile: async (profileData) => {
        console.log("[updateProfile] 요청:", profileData);
        const response = await apiClient.put("/users/me", profileData);
        return response.data;
    },

    uploadProfileImage: async (formData) => {
        const response = await apiClient.post(
            "/users/me/profile-image",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            },
        );
        console.log("[uploadProfileImage] 응답:", response.data);
        return response.data;
    },

    changePassword: async (passwordData) => {
        console.log("[changePassword] 요청");
        const response = await apiClient.put(
            "/users/me/password",
            passwordData,
        );
        return response.data;
    },

    deleteAccount: async (passwordData) => {
        const response = await apiClient.delete("/users/me", {
            data: passwordData,
        });
        return response.data;
    },

    getSettings: async () => {
        try {
            const response = await apiClient.get("/api/users/settings");
            return response.data;
        } catch (error) {
            console.warn("서버 설정을 불러올 수 없어 기본 설정을 적용합니다.");
            return {
                notificationEnabled: true,
                themeColor: "#ffffff",
                labFeaturesEnabled: false,
                bgmUrl: null,
            };
        }
    },

    updateSettings: async (settings) => {
        console.log("[updateSettings] 요청:", settings);
        const response = await apiClient.put("/users/me/settings", settings);
        return response.data;
    },
};
