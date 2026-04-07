import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Loader2 } from "lucide-react";
import { authService } from "@/api/authService";
import { useAlert } from "@/context/AlertContext";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendCode = async (e) => {
        e.preventDefault();

        if (!email || !email.trim()) return;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert(
                "올바른 이메일 형식을 입력해주세요.",
                "입력 오류",
                "alert",
            );
            return;
        }

        if (loading) return;
        setLoading(true);

        console.log("인증 시도 중인 이메일:", email);

        try {
            await authService.sendResetEmailCode(email);
            console.log("인증 성공! 이메일 데이터:", email);

            navigate("/reset-password", {
                state: { email },
                replace: true,
            });
        } catch (err) {
            console.log("상세 에러", err);

            const serverError = err.response?.data;
            const errorMsg =
                (typeof serverError === "string"
                    ? serverError
                    : serverError?.message) ||
                "이메일 발송에 실패했습니다. 가입된 이메일인지 확인해주세요.";

            showAlert(errorMsg, "메일 발송 실패", "alert");
            console.log("메일 발송 에러", err);
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
                        비밀번호 찾기
                    </h1>
                </div>

                <div className="flex flex-col items-center px-6 py-10">
                    <p className="text-[#7b8b9e] text-[14px] mb-8 text-center leading-relaxed">
                        가입한 이메일 주소를 입력해 주세요.
                        <br />
                        비밀번호 재설정을 위한 인증번호를 보내드립니다.
                    </p>

                    <form
                        onSubmit={handleSendCode}
                        className="w-full max-w-sm flex flex-col gap-4"
                    >
                        <input
                            type="email"
                            placeholder="이메일 주소"
                            className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 mt-4 bg-black dark:bg-[#e5e5e5] text-white dark:text-black font-bold text-[15px] rounded-[4px] hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                "인증번호 받기"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
