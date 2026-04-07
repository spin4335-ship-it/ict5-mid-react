import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { userService } from "@/api/userService";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR, getImageUrl } from "@/utils/imageUtils";
import { useAlert } from "@/context/AlertContext";

export default function EditProfilePage() {
    const navigate = useNavigate();

    const { user: authUser, updateUser } = useAuth();
    const { showAlert } = useAlert();

    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [isSaving, setIsSaving] = useState(false);

    const [profileFile, setProfileFile] = useState(null);

    const [previewUrl, setPreviewUrl] = useState(null);

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        username: "",
        visibility: "PUBLIC",
    });

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);
            try {
                const data = await userService.getMyProfile();
                console.log("[profile] 불러오기:", data);
                setUser(data);
                setFormData({
                    username: data.username,
                    visibility: data.visibility,
                });
            } catch (error) {
                console.warn("[profile] 불러오기 실패, fallback 사용:", error);
                const fallbackUser = {
                    ...authUser,
                    profileImage: authUser?.profileImageUrl || DEFAULT_AVATAR,
                };
                setUser(fallbackUser);
                setFormData({
                    username: fallbackUser.username,
                    visibility: fallbackUser.visibility,
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, [authUser]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        console.log("[profileImage] 선택:", file.name);
        setProfileFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (profileFile) {
                try {
                    const formDataImg = new FormData();
                    formDataImg.append("file", profileFile);
                    if (authUser?.id || authUser?.userId) {
                        formDataImg.append(
                            "userId",
                            String(authUser?.id || authUser?.userId),
                        );
                    }
                    const data =
                        await userService.uploadProfileImage(formDataImg);
                    console.log("[profileImage] 업로드 응답:", data);
                    const newImageUrl =
                        data?.result?.profileImageUrl ||
                        data?.profileImageUrl ||
                        data?.result;
                    if (newImageUrl) {
                        updateUser({ profileImageUrl: newImageUrl });
                    }
                } catch (imgError) {
                    console.warn("이미지 업로드 실패:", imgError);
                    showAlert(
                        "프로필 사진 변경에 실패했습니다. 나머지 정보는 저장됩니다.",
                    );
                }
            }

            await userService.updateProfile({
                username: formData.username,
                visibility: formData.visibility,
            });
            console.log("[profile] 수정 성공");
            updateUser({
                username: formData.username,
                visibility: formData.visibility,
            });
            showAlert("프로필이 수정되었습니다.", "프로필", "success");
            setTimeout(() => navigate("/profile"), 1000);
        } catch (error) {
            console.error(error);
            showAlert(error.message || "프로필 수정에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const currentImage =
        previewUrl ||
        getImageUrl(user?.profileImageUrl || user?.profileImage) ||
        DEFAULT_AVATAR;

    if (isLoading || !user) {
        console.log(
            "[profile] 로딩 중 - isLoading:",
            isLoading,
            "/ user:",
            user,
        );
        return (
            <ResponsiveLayout showTabs={false}>
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] gap-4">
                    <Loader2 className="animate-spin text-gray-400" size={40} />
                    <div className="text-[13px] uppercase font-black italic tracking-widest text-[#ccd3db] animate-pulse">
                        Loading SNAP...
                    </div>
                </div>
            </ResponsiveLayout>
        );
    }

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center justify-between h-14 px-4 border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 bg-white dark:bg-[#1c1f24] z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-black hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-black italic text-[16px] tracking-widest uppercase">
                        EDIT PROFILE
                    </h1>

                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-4 py-1.5 bg-black text-white rounded-full font-bold text-[13px] disabled:opacity-50 hover:bg-gray-800 transition-colors"
                    >
                        {isSaving ? "저장 중..." : "완료"}
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col items-center mb-10">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <img
                                src={currentImage}
                                alt="profile"
                                className="w-24 h-24 rounded-[28px] object-cover border-2 border-[#f3f3f3] shadow-sm"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = DEFAULT_AVATAR;
                                }}
                            />

                            <div className="absolute inset-0 bg-black/40 rounded-[28px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-3 text-[12px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-[#292e35] dark:text-[#e5e5e5] px-4 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#424a54] transition-colors"
                        >
                            {profileFile ? "사진 변경됨 ✓" : "프로필 사진 변경"}
                        </button>
                    </div>

                    <form className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-500 dark:text-[#a3b0c1] ml-1">
                                이름
                            </label>
                            <input
                                type="text"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                maxLength={20}
                            />
                            <p className="text-[11px] text-gray-400 dark:text-[#6b7a90] ml-1 mt-1">
                                1~20자 이내로 입력해주세요 (
                                {formData.username?.length || 0}/20)
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-500 dark:text-[#a3b0c1] ml-1">
                                계정 공개 여부
                            </label>
                            <select
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors bg-white dark:bg-[#1c1f24] dark:text-[#e5e5e5]"
                                value={formData.visibility}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        visibility: e.target.value,
                                    })
                                }
                            >
                                <option value="PUBLIC">공개</option>
                                <option value="PRIVATE">비공개</option>
                            </select>

                            <p className="text-[11px] text-[#a3b0c1] mt-1 ml-1 leading-relaxed">
                                비공개 계정이 되면 회원님의 허락 없이 다른
                                사람이 회원님의 사진이나 동영상을 볼 수
                                없습니다.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
