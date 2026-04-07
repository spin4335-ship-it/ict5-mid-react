import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { userService } from "@/api/userService";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

const CONFIRM_PHRASE = "계정을 삭제합니다";

export default function DeleteAccountPage() {
    const navigate = useNavigate();

    const { showAlert, showConfirm } = useAlert();

    const { logout, user } = useAuth();
    const isKakaoUser = user?.provider === "KAKAO";

    const [password, setPassword] = useState("");
    const [confirmText, setConfirmText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        showConfirm({
            message: "정말 탈퇴하시겠습니까? 관련 데이터가 모두 삭제됩니다.",
            title: "회원 탈퇴 확인",
            type: "alert",
            confirmText: "탈퇴하기",
            cancelText: "취소",
            onConfirm: async () => {
                try {
                    await userService.deleteAccount({ password });

                    showAlert(
                        "탈퇴 처리가 완료되었습니다.",
                        "탈퇴 완료",
                        "success",
                    );
                    logout();
                    navigate("/", { replace: true });
                } catch (error) {
                    console.error("탈퇴 처리 중 에러:", error);

                    let displayMessage =
                        "탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

                    if (error.code === "ECONNABORTED") {
                        displayMessage =
                            "서버 응답 시간이 초과되었습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.";
                    } else if (error.response) {
                        const serverMessage = error.response.data?.message;

                        if (
                            error.response.status === 401 ||
                            serverMessage?.includes("비밀번호")
                        ) {
                            displayMessage =
                                "비밀번호가 일치하지 않습니다. 다시 확인해주세요.";
                        } else if (serverMessage) {
                            displayMessage = serverMessage;
                        }
                    }

                    showAlert(displayMessage, "오류 발생", "alert");
                    setPassword("");
                }
            },
        });
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center h-14 px-4 border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 bg-white dark:bg-[#1c1f24] z-10">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="flex-1 text-center font-bold text-lg mr-8">
                        계정 탈퇴
                    </h1>
                </div>

                <div className="p-6 max-w-sm mx-auto w-full">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/30">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-[18px] font-bold mb-3">
                            계정을 삭제하시겠습니까?
                        </h2>
                        <p className="text-[13px] text-[#7b8b9e] leading-relaxed">
                            계정을 삭제하면 프로필, 사진, 동영상, 댓글, 좋아해
                            기록 등 모든 데이터가 영구적으로 삭제됩니다.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        {isKakaoUser ? (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-gray-500 dark:text-[#a3b0c1] ml-1">
                                    확인을 위해{" "}
                                    <span className="text-red-500">
                                        "{CONFIRM_PHRASE}"
                                    </span>
                                    를 입력해주세요
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-red-500 transition-colors"
                                    required
                                    placeholder={CONFIRM_PHRASE}
                                    value={confirmText}
                                    onChange={(e) =>
                                        setConfirmText(e.target.value)
                                    }
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-gray-500 dark:text-[#a3b0c1] ml-1">
                                    회원님의 비밀번호
                                </label>
                                <input
                                    type="password"
                                    className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-red-500 transition-colors"
                                    required
                                    placeholder="비밀번호"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={
                                isKakaoUser && confirmText !== CONFIRM_PHRASE
                            }
                            className="w-full h-12 mt-6 bg-red-500 text-white font-bold text-[15px] rounded-[4px] hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            계정 영구 삭제
                        </button>
                    </form>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
