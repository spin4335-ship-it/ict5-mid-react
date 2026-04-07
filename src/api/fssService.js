import apiClient from "./apiClient";

export const fssService = {
    fetchFssData: async (startDate, endDate) => {
        const response = await apiClient.get("/fss/list", {
            params: {
                startDate: startDate.replace(/-/g, ""),
                endDate: endDate.replace(/-/g, ""),
                apiType: "json",
            },
        });
        return response.data;
    },
};
