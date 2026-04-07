import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Loader2, Check, X } from "lucide-react";
import { authService } from "@/api/authService";
import { useAlert } from "@/context/AlertContext";

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();
    const email = location.state?.email || "";

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
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

    useEffect(() => {
        if (!email) {
            showAlert(
                "이메일 정보가 없습니다. 메일 인증부터 다시 시도해 주세요",
                "alert",
            );
            navigate("/reset-password", { replace: true });
        }
    }, [email, navigate, showAlert]);

    const handleReset = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (formData.newPassword !== formData.confirmPassword) {
            showAlert("비밀번호가 일치하지 않습니다", "입력 오류", "alert");
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

        try {
            console.log("보내는 데이터:", email, formData.code);
            await authService.verifyResetCode(email, formData.code);
            await authService.resetPassword(email, formData.newPassword);

            showAlert("비밀번호가 변경되었습니다", "비밀번호 변경", "success");
            navigate("/login", { replace: true });
        } catch (err) {
            console.log("상세 에러", err);

            const serverError = err.response?.data;
            const errorMsg =
                (typeof serverError === "string"
                    ? serverError
                    : serverError?.message) ||
                "인증코드가 올바르지 않습니다. 다시 시도해주세요.";

            showAlert(errorMsg, "비밀번호 변경 실패", "alert");
            console.log("비밀번호 변경 에러", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center h-14 px-4 border-b border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24]">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="flex-1 text-center font-bold text-lg mr-8">
                        비밀번호 재설정
                    </h1>
                </div>

                <div className="flex flex-col items-center px-6 py-10">
                    <form
                        onSubmit={handleReset}
                        className="w-full max-w-sm flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 dark:text-[#a3b0c1] ml-1">
                                인증번호
                            </label>
                            <input
                                type="text"
                                placeholder="인증번호 6자리"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 dark:text-[#a3b0c1] ml-1">
                                새 비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="새로운 비밀번호"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                value={formData.newPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        newPassword: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 dark:text-[#a3b0c1] ml-1">
                                새 비밀번호 확인
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                placeholder="다시 한번 입력하세요"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                required
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
                            disabled={loading}
                            className="w-full h-12 mt-6 bg-black dark:bg-[#e5e5e5] text-white dark:text-black font-bold text-[15px] rounded-[4px] hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                "비밀번호 재설정 완료"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
