import apiClient from "./apiClient";

function transformBadgeStats(data) {
    const badgesCount = data.totalCount || data.totalBadges || 0;
    const calculatedLevel = Math.floor(badgesCount / 5) + 1;
    const recentBadges = (data.typeCounts || []).map((tc, idx) => ({
        id: idx + 1,
        name: tc.typeName || tc.name || "달개",
        emoji: tc.emoji || "🏅",
        count: tc.count || 0,
    }));
    return {
        totalBadges: badgesCount,
        recentBadges,
        level: calculatedLevel,
        typeCounts: data.typeCounts || [],
    };
}

export const badgeService = {
    getMyStats: async () => {
        try {
            const response = await apiClient.get("/badges/stats");
            const result = transformBadgeStats(response.data || {});
            console.log("[뱃지 getMyStats] 응답:", result);
            return result;
        } catch (error) {
            console.warn("[뱃지 getMyStats] 실패, 기본값 반환:", error);
            return {
                level: 1,
                totalBadges: 0,
                recentBadges: [],
                typeCounts: [],
            };
        }
    },

    getUserStats: async (userId) => {
        try {
            const response = await apiClient.get(`/badges/stats/${userId}`);
            const result = transformBadgeStats(response.data || {});
            console.log("[뱃지 getUserStats]", userId, ":", result);
            return result;
        } catch (error) {
            console.warn("[뱃지 getUserStats] 실패:", error);
            return {
                level: 1,
                totalBadges: 0,
                recentBadges: [],
                typeCounts: [],
            };
        }
    },

    getGlobalRanking: async (params) => {
        try {
            const response = await apiClient.get("/badges/ranking/global", {
                params,
            });
            console.log(
                "[뱃지 globalRanking] 응답:",
                response.data?.content?.length,
                "명",
            );
            return response.data;
        } catch (error) {
            console.warn("[뱃지 globalRanking] 실패:", error);
            return { content: [], totalPages: 0 };
        }
    },

    getFriendsRanking: async (params) => {
        try {
            const response = await apiClient.get("/badges/ranking/friends", {
                params,
            });
            console.log(
                "[friendsRanking] 응답:",
                response.data?.content?.length,
                "명",
            );
            return response.data;
        } catch (error) {
            console.warn("[friendsRanking] 실패:", error);
            return { content: [], totalPages: 0 };
        }
    },

    getAllTypes: async () => {
        try {
            const response = await apiClient.get("/badges/types");
            const mapped = response.data.map((type) => ({
                id: type.id,
                category: "BADGE",
                title: type.name || "달개",
                description: type.description || "",
                emoji: type.emoji || "🏅",
            }));
            console.log("[badgeTypes] 응답:", mapped.length, "개");
            return mapped;
        } catch (error) {
            console.warn("[badgeTypes] 실패:", error);
            return [];
        }
    },

    getGlobalStats: async () => {
        try {
            const response = await apiClient.get("/badges/stats/global");
            const result = transformBadgeStats(response.data || {});
            return result;
        } catch (error) {
            console.warn("[뱃지 getGlobalStats] 실패:", error);
            return { totalBadges: 0, recentBadges: [], typeCounts: [] };
        }
    },

    toggleAlbumDalgae: async (albumId, badgeTypeId) => {
        const response = await apiClient.post(
            `/badges/albums/${albumId}/toggle`,
            null,
            { params: { badgeTypeId } },
        );
        console.log(
            "[toggleDalgae] albumId:",
            albumId,
            "/ badgeTypeId:",
            badgeTypeId,
            "/ 응답:",
            response.data,
        );
        return response.data;
    },

    getAlbumDalgae: async (albumId) => {
        const response = await apiClient.get(`/badges/albums/${albumId}`);
        console.log(
            "[getAlbumDalgae] albumId:",
            albumId,
            "/ 응답:",
            response.data,
        );
        return response.data;
    },
};
