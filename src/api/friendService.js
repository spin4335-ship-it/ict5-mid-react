import apiClient from "./apiClient";

export const friendService = {
    listFriends: async () => {
        const response = await apiClient.get("/friends");
        return response.data;
    },

    listPendingRequests: async () => {
        const response = await apiClient.get("/friends/pending");
        return response.data;
    },

    listSentPendingRequests: async () => {
        const response = await apiClient.get("/friends/pending/sent");
        return response.data;
    },

    sendRequest: async (targetUserId) => {
        console.log(
            `[친구 동작] 친구 요청 전송 시도 - 대상 targetUserId: ${targetUserId}`,
        );
        const response = await apiClient.post("/friends/request", {
            targetUserId,
        });
        console.log(`[친구 동작] 친구 요청 전송 완료 - 응답:`, response.data);
        return response.data;
    },

    acceptRequest: async (friendshipId) => {
        console.log(
            `[친구 동작] 친구 요청 수락 시도 - friendshipId: ${friendshipId}`,
        );
        const response = await apiClient.post(
            `/friends/${friendshipId}/accept`,
        );
        console.log(`[친구 동작] 친구 요청 수락 완료 - 응답:`, response.data);
        return response.data;
    },

    rejectRequest: async (friendshipId) => {
        console.log(
            `[친구 동작] 친구 요청 거절 시도 - friendshipId: ${friendshipId}`,
        );
        const response = await apiClient.post(
            `/friends/${friendshipId}/reject`,
        );
        console.log(`[친구 동작] 친구 요청 거절 완료 - 응답:`, response.data);
        return response.data;
    },

    removeFriend: async (friendId) => {
        console.log(
            `[친구 동작] 친구 관계/요청 삭제(취소) 시도 - friendId(또는 friendshipId): ${friendId}`,
        );
        const response = await apiClient.delete(`/friends/${friendId}`);
        console.log(
            `[친구 동작] 친구 관계/요청 삭제(취소) 완료 - 응답:`,
            response.data,
        );
        return response.data;
    },

    searchUsers: async (query) => {
        const response = await apiClient.get("/friends/search", {
            params: { q: query },
        });
        return response.data;
    },
};
