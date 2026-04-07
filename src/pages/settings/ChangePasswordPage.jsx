import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, X, Check } from "lucide-react";
import { userService } from "@/api/userService";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

export default function ChangePasswordPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const password = formData.newPassword;
    const passwordRules = {
        length: password.length >= 8 && password.length <= 20,

        hasLetter: /[a-zA-Z]/.test(password),

        hasNumber: /[0-9]/.test(password),

        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const { showConfirm, showAlert } = useAlert();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            showAlert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (
            !passwordRules.length ||
            !passwordRules.hasLetter ||
            !passwordRules.hasNumber ||
            !passwordRules.hasSpecial
        ) {
            showAlert("비밀번호 규칙을 확인해주세요.", "비밀번호 오류");
            return;
        }
        setLoading(true);
        console.log("[changePassword] 요청시작");
        await userService.changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        });
        console.log("[changePassword] 성공");
        showAlert("비밀번호가 변경되었습니다.", "성공", "success");
        navigate("/settings");
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center h-14 px-4 border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 bg-white dark:bg-[#1c1f24] z-10">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="flex-1 text-center font-bold text-lg mr-8">
                        비밀번호 변경
                    </h1>
                </div>

                <div className="p-6 max-w-sm mx-auto w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-500 dark:text-[#a3b0c1] ml-1">
                                현재 비밀번호
                            </label>
                            <input
                                type="password"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                required
                                value={formData.currentPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        currentPassword: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 pt-4">
                            <label className="text-[13px] font-bold text-gray-500 dark:text-[#a3b0c1] ml-1">
                                새 비밀번호
                            </label>
                            <input
                                type="password"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                required
                                value={formData.newPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        newPassword: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-500 dark:text-[#a3b0c1] ml-1">
                                새 비밀번호 확인
                            </label>
                            <input
                                type="password"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="bg-secondary rounded-[16px] p-5 shadow-sm border border-border">
                            <p className="text-[14px] font-bold text-text-primary mb-3.5">
                                비밀번호 규칙
                            </p>
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2">
                                    {passwordRules.length ? (
                                        <Check
                                            className="w-[18px] h-[18px] text-green-500"
                                            strokeWidth={3}
                                        />
                                    ) : (
                                        <X
                                            className="w-[18px] h-[18px] text-red-500"
                                            strokeWidth={2.5}
                                        />
                                    )}

                                    <span
                                        className={`text-[13px] ${passwordRules.length ? "text-text-primary font-bold" : "text-text-tertiary font-medium"}`}
                                    >
                                        8~20자 이내
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {passwordRules.hasLetter ? (
                                        <Check
                                            className="w-[18px] h-[18px] text-green-500"
                                            strokeWidth={3}
                                        />
                                    ) : (
                                        <X
                                            className="w-[18px] h-[18px] text-red-500"
                                            strokeWidth={2.5}
                                        />
                                    )}
                                    <span
                                        className={`text-[13px] ${passwordRules.hasLetter ? "text-text-primary font-bold" : "text-text-tertiary font-medium"}`}
                                    >
                                        영문 포함
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {passwordRules.hasNumber ? (
                                        <Check
                                            className="w-[18px] h-[18px] text-green-500"
                                            strokeWidth={3}
                                        />
                                    ) : (
                                        <X
                                            className="w-[18px] h-[18px] text-red-500"
                                            strokeWidth={2.5}
                                        />
                                    )}
                                    <span
                                        className={`text-[13px] ${passwordRules.hasNumber ? "text-text-primary font-bold" : "text-text-tertiary font-medium"}`}
                                    >
                                        숫자 포함
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {passwordRules.hasSpecial ? (
                                        <Check
                                            className="w-[18px] h-[18px] text-green-500"
                                            strokeWidth={3}
                                        />
                                    ) : (
                                        <X
                                            className="w-[18px] h-[18px] text-red-500"
                                            strokeWidth={2.5}
                                        />
                                    )}
                                    <span
                                        className={`text-[13px] ${passwordRules.hasSpecial ? "text-text-primary font-bold" : "text-text-tertiary font-medium"}`}
                                    >
                                        특수문자 포함 (!@#$%^&* 등)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 mt-6 bg-black text-white font-bold text-[15px] rounded-[4px] hover:bg-gray-800 transition-colors"
                        >
                            비밀번호 변경 완료
                        </button>
                    </form>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
