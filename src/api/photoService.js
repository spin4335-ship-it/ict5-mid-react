import apiClient from "./apiClient";

export const photoService = {
    uploadPhotos: async ({ files, userId }) => {
        console.log("[photoService.uploadPhotos] 호출");
        console.log("[photoService.uploadPhotos] files =", files);
        console.log("[photoService.uploadPhotos] userId =", userId);

        const formData = new FormData();
        console.log("[photoService.uploadPhotos] formData 생성 완료");

        files.forEach((file, index) => {
            console.log(
                `[photoService.uploadPhotos] files append index=${index}`,
                file,
            );
            formData.append("files", file);
        });

        formData.append("userId", String(userId));
        console.log(
            "[photoService.uploadPhotos] userId append 완료 =",
            String(userId),
        );

        const { data } = await apiClient.post("/photos/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(
            "[photoService.uploadPhotos] POST /photos/upload 성공, data =",
            data,
        );

        return data;
    },
};
