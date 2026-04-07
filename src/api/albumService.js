import apiClient from "./apiClient";

export const albumService = {
    createAlbum: async (payload) => {
        console.log("[albumService.createAlbum] 호출");
        console.log("[albumService.createAlbum] payload =", payload);

        const response = await apiClient.post("/albums", payload);
        console.log("[albumService.createAlbum] response =", response);

        const data = response.data;
        console.log("[albumService.createAlbum] data =", data);

        return data;
    },

    updateAlbum: async (albumId, updateData) => {
        const response = await apiClient.put(`/albums/${albumId}`, updateData);
        return response.data;
    },

    getAlbumDetail: async (albumId) => {
        console.log("[albumService.getAlbumDetail] 호출");
        console.log("[albumService.getAlbumDetail] albumId =", albumId);

        const response = await apiClient.get(`/albums/${albumId}`);
        console.log("[albumService.getAlbumDetail] response =", response);

        const data = response.data;
        console.log("[albumService.getAlbumDetail] data =", data);

        return data;
    },

    getAlbumFeed: async (params) => {
        const response = await apiClient.get("/albums/feed", { params });
        return response.data;
    },

    deleteAlbum: async (id) => {
        const response = await apiClient.delete(`/albums/${id}`);
        return response.data;
    },

    fetchSnaps: async ({ pageParam = 1, filter = "all", tag = "" }) => {
        try {
            const response = await apiClient.get("/albums/feed", {
                params: {
                    type: "photo",
                    friendsOnly: filter === "following",
                    tag: tag || undefined,
                },
            });

            const items = response.data || [];
            const pageSize = 20;
            const start = (pageParam - 1) * pageSize;
            const sliced = items.slice(start, start + pageSize);

            return {
                data: sliced,
                nextPage: pageParam + 1,
                hasNextPage: start + pageSize < items.length,
            };
        } catch (error) {
            console.warn("스냅 피드 로드 실패:", error);
            return { data: [], nextPage: undefined, hasNextPage: false };
        }
    },
};
