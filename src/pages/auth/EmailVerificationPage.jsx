import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { authService } from "@/api/authService";
import { useAlert } from "@/context/AlertContext";

export default function EmailVerificationPage() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSendCode = async () => {
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
        setLoading(true);

        try {
            const checkResult = await authService.checkEmailDuplicates(email);
            if (checkResult.isDuplicate) {
                showAlert(
                    "이미 가입된 메일입니다. 다시 확인해 보세요",
                    "중복 가입 메일",
                    "alert",
                );
                console.log("메일 중복 에러");
                return;
            }

            await authService.sendEmailCode(email);

            setStep(2);
            showAlert(
                "인증번호가 발송되었습니다. 메일함을 확인해주세요.",
                "발송 완료",
                "success",
            );
        } catch (err) {
            console.log("상세 에러", err);

            const serverError = err.response?.data;
            const errorMsg =
                (typeof serverError === "string"
                    ? serverError
                    : serverError?.message) ||
                "이메일 발송이 실패했습니다. 이미 가입된 이메일일 수 있습니다";

            showAlert(errorMsg, "메일 발송 실패", "alert");
            console.log("이메일 발송 에러", err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!code || !code.trim()) return;
        setLoading(true);
        setError("");
        console.log("인증 시도 중인 이메일:", email);

        try {
            await authService.verifyEmailCode(email, code);
            console.log("가입 페이지로 넘길 이메일:", email);
            console.log("인증 성공! 이메일 데이터:", email);

            navigate("/signup", {
                state: { verifiedEmail: email },
                replace: true,
            });
        } catch (err) {
            console.log("상세 에러", err);

            const serverError = err.response?.data;
            const errorMsg =
                (typeof serverError === "string"
                    ? serverError
                    : serverError?.message) || "인증코드가 일치하지 않습니다.";

            showAlert(errorMsg, "인증 실패", "alert");
            console.log("인증 코드 검증 에러", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5] p-4">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-[20px] font-black italic tracking-tighter uppercase"></h1>
                    <div className="w-10"></div>
                </div>

                <div className="max-w-[400px] mx-auto w-full flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#f3f3f3] dark:bg-[#292e35] rounded-3xl flex items-center justify-center mb-8">
                        {step === 1 ? (
                            <Mail size={40} />
                        ) : (
                            <CheckCircle2 size={40} className="text-black" />
                        )}
                    </div>

                    <h2 className="text-2xl font-black italic mb-2 tracking-tighter">
                        {step === 1 ? "인증용 이메일 발송" : "인증 코드 입력"}
                    </h2>
                    <p className="text-[14px] text-[#a3b0c1] text-center mb-10 font-medium">
                        {step === 1
                            ? "회원가입을 위해 이메일 인증이 필요합니다."
                            : `${email}로 전송된\n6자리 인증번호를 입력해주세요.`}
                    </p>

                    <div className="w-full space-y-4">
                        {step === 1 ? (
                            <>
                                <input
                                    type="text"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 px-5 bg-[#f3f3f3] dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[12px] text-[15px] font-bold outline-none border-none focus:ring-1 focus:ring-black dark:focus:ring-[#e5e5e5]"
                                />

                                <button
                                    onClick={handleSendCode}
                                    disabled={!email || loading}
                                    className="w-full h-14 bg-black text-white rounded-[12px] font-bold text-[15px] disabled:opacity-20 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={20}
                                        />
                                    ) : (
                                        "인증번호 받기"
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-14 px-5 bg-[#f3f3f3] dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[12px] text-center text-2xl font-black tracking-[8px] outline-none border-none focus:ring-1 focus:ring-black dark:focus:ring-[#e5e5e5]"
                                />

                                <button
                                    onClick={handleVerify}
                                    disabled={code.length < 6 || loading}
                                    className="w-full h-14 bg-black text-white rounded-[12px] font-bold text-[15px] disabled:opacity-20 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={20}
                                        />
                                    ) : (
                                        "인증 완료"
                                    )}
                                </button>

                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full py-2 text-[13px] text-[#a3b0c1] font-bold"
                                >
                                    이메일 재입력
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
