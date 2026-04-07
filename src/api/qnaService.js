import apiClient from "./apiClient";

export const qnaService = {
    getQnas: async (page = 1, pageSize = 10) => {
        try {
            const response = await apiClient.get(
                `/qna?page=${page - 1}&size=${pageSize}&sort=createdAt,desc`,
            );
            return response.data;
        } catch (error) {
            console.error("QnA 목록 조회 실패", error);
            throw error;
        }
    },

    createQna: async (data) => {
        const response = await apiClient.post("/qna", data);
        return response.data;
    },

    updateQna: async (id, data) => {
        const response = await apiClient.put(`/qna/${id}`, data);
        return response.data;
    },

    deleteQna: async (id) => {
        const response = await apiClient.delete(`/qna/${id}`);
        return response.data;
    },

    getComments: async (qnaId) => {
        const response = await apiClient.get(`/qna/${qnaId}/comments`);
        return response.data;
    },

    createComment: async (qnaId, content) => {
        const response = await apiClient.post(`/qna/${qnaId}/comments`, {
            content,
        });
        return response.data;
    },

    deleteComment: async (commentId) => {
        const response = await apiClient.delete(`/qna/comments/${commentId}`);
        return response.data;
    },
};
