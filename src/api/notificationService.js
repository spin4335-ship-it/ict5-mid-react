import apiClient from "./apiClient";

export const notificationService = {
    getAll: async () => {
        const response = await apiClient.get("/notifications");
        console.log("[notifications] 응답:", response.data?.length, "개");
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await apiClient.get("/notifications/unread");
        console.log("[unreadCount] 응답:", response.data);
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await apiClient.put(`/notifications/${id}/read`);
        console.log("[markAsRead] id:", id);
        return response.data;
    },

    markAllRead: async () => {
        const response = await apiClient.put("/notifications/read-all");
        console.log("[markAllRead] 완료");
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/notifications/${id}`);
        console.log("[notification] 삭제 id:", id);
        return response.data;
    },

    deleteAll: async () => {
        const response = await apiClient.delete("/notifications");
        console.log("[notification] 전체 삭제 완료");
        return response.data;
    },
};
