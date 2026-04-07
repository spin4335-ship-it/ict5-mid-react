import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Check, X } from "lucide-react";
import { authService } from "@/api/authService";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

export default function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();
    const { login: authLogin } = useAuth();

    const verifiedEmail = location.state?.verifiedEmail || "";
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: verifiedEmail,
        password: "",
        confirmPassword: "",
        username: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const password = formData.password;
    const passwordRules = {
        length: password.length >= 8 && password.length <= 20,

        hasLetter: /[a-zA-Z]/.test(password),

        hasNumber: /[0-9]/.test(password),

        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    useEffect(() => {
        console.log("현재 location.state:", location.state);
        console.log("전달받은 이메일:", verifiedEmail);

        if (!location.state || !verifiedEmail) {
            showAlert("이메일 인증을 먼저 진행해 주세요", "접근 제한", "alert");
            navigate("/verify-email", { replace: true });
            return;
        }
    }, [verifiedEmail, navigate, showAlert]);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (formData.password !== formData.confirmPassword) {
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
        setIsSubmitting(true);
        console.log("회원가입 페이지 시작");
        setError("");

        try {
            await authService.signup({
                email: formData.email,
                password: formData.password,
                username: formData.username,
            });

            const loginResponse = await authService.login({
                email: formData.email,
                password: formData.password,
            });

            console.log("실제 로그인 응답:", loginResponse);

            const userData = loginResponse.user || loginResponse;

            if (userData) {
                authLogin(userData);
                showAlert(
                    "회원 가입을 환영합니다.",
                    "회원 가입 성공",
                    "success",
                );

                navigate("/", { replace: true });
            }
        } catch (err) {
            console.log("상세 에러", err);

            const serverError = err.response?.data;
            const errorMsg =
                (typeof serverError === "string"
                    ? serverError
                    : serverError?.message) ||
                "회원 가입 중 문제가 발생했습니다.";

            showAlert(errorMsg, "회원 가입 실패", "alert");
            console.log("회원 가입 에러", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215]">
                <div className="flex items-center h-14 px-4 border-b border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24]">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="flex-1 text-center font-bold text-lg mr-8">
                        회원가입
                    </h1>
                </div>

                <div className="flex flex-col items-center px-6 py-10">
                    <form
                        onSubmit={handleSignup}
                        className="w-full max-w-sm flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 dark:text-[#a3b0c1] ml-1">
                                이메일
                            </label>
                            <input
                                type="email"
                                placeholder="example@musinsa.com"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-[#f3f3f3] dark:bg-[#292e35] text-[#a3b0c1] rounded-[4px] text-[14px] outline-none cursor-not-allowed"
                                value={formData.email}
                                readOnly
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 dark:text-[#a3b0c1] ml-1">
                                사용자 이름
                            </label>
                            <input
                                type="text"
                                placeholder="활동할 이름을 입력하세요"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                maxLength={20}
                                required
                            />
                            <p className="text-[11px] text-gray-400 dark:text-[#6b7a90] ml-1 mt-1">
                                1~20자 이내로 입력해주세요 (
                                {formData.username?.length || 0}/20)
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 dark:text-[#a3b0c1] ml-1">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                placeholder="비밀번호"
                                className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 dark:text-[#a3b0c1] ml-1">
                                비밀번호 확인
                            </label>
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
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
                            disabled={isSubmitting}
                            className={`w-full h-12 mt-6 bg-black text-white font-bold text-[15px] rounded-[4px] hover:bg-gray-800 transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isSubmitting ? "가입 중..." : "가입하기"}
                        </button>
                    </form>

                    <div className="mt-8 text-[13px] text-gray-500 dark:text-[#a3b0c1] font-bold">
                        이미 아이디가 있으신가요?{" "}
                        <Link
                            to="/login"
                            className="text-black dark:text-[#e5e5e5] underline ml-1"
                        >
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
