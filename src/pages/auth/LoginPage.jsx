import { Link, useNavigate, useLocation } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/api/authService";
import { useEffect, useRef, useState } from "react";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login: authLogin } = useAuth();
    const { showAlert } = useAlert();
    const hasShownAlert = useRef(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (location.state?.requireAuth && !hasShownAlert.current) {
            showAlert(
                "로그인이 필요한 서비스입니다.\n 로그인 후 이용해주세요",
                "접근 제한",
                "alert",
            );
            hasShownAlert.current = true;
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert(
                "올바른 이메일 형식을 입력해주세요.",
                "입력 오류",
                "alert",
            );
            return;
        }

        console.log("로그인 버튼 시작됨");
        setIsSubmitting(true);
        setError("");

        try {
            console.log("로그인 요청 시작!!");
            const provider = "";
            const response = await authService.login({
                email,
                password,
            });

            const result = response.data || response;
            console.log("서버 응답 실제 데이터:", response);

            const { user } = result;

            if (user) {
                authLogin(user);

                showAlert("방문을 환영합니다.", "로그인 성공", "success");

                const destination = location.state?.from?.pathname || "/";
                navigate(destination, { replace: true });
                console.log("로그인 처리 성공!!");
            } else {
                throw new Error("서버로부터 토큰을 받지 못했습니다.");
            }
        } catch (err) {
            console.log("상세 에러", err);

            const serverError = err.response?.data;
            const errorMsg =
                (typeof serverError === "string"
                    ? serverError
                    : serverError?.message) ||
                "로그인 처리 중 문제가 발생했습니다.";

            showAlert(errorMsg, "로그인 실패", "alert");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 bg-white dark:bg-[#101215]">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black tracking-tighter text-black dark:text-[#e5e5e5] mb-2">
                        MYSTORY
                    </h1>
                    <p className="text-[#a3b0c1] text-[13px] tracking-wide">
                        나만의 스토리를 만들어가는 곳
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-sm flex flex-col gap-3"
                >
                    <input
                        type="email"
                        placeholder="아이디(이메일)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 px-4 border border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-[4px] text-[14px] focus:outline-none focus:border-black dark:focus:border-[#e5e5e5] transition-colors"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-12 mt-2 bg-black dark:bg-[#e5e5e5] text-white dark:text-black font-black italic tracking-widest uppercase text-[15px] rounded-[4px] hover:bg-gray-800 dark:hover:bg-white transition-all active:scale-[0.98] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? "LOGGING IN..." : "LOGIN"}
                    </button>

                    <div className="relative my-6 flex items-center">
                        <div className="flex-grow border-t border-[#f3f3f3] dark:border-[#292e35]"></div>
                        <span className="flex-shrink mx-4 text-[11px] font-black italic tracking-widest text-[#ccd3db] uppercase">
                            OR
                        </span>
                        <div className="flex-grow border-t border-[#f3f3f3] dark:border-[#292e35]"></div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            (window.location.href =
                                "http://localhost:8080/api/oauth2/authorization/kakao")
                        }
                        className="w-full h-12 bg-[#FEE500] text-[#191919] font-bold text-[15px] rounded-[4px] flex items-center justify-center gap-3 hover:bg-[#FADA0A] transition-all active:scale-[0.98]"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9 1.5C4.029 1.5 0 4.605 0 8.438C0 10.89 1.665 13.035 4.155 14.318L3.09 18L7.14 15.345C7.74 15.42 8.37 15.465 9 15.465C13.971 15.465 18 12.36 18 8.528C18 4.695 13.971 1.59 9 1.59V1.5Z"
                                fill="black"
                            />
                        </svg>
                        카카오 로그인
                    </button>
                </form>

                <div className="flex items-center gap-5 mt-10 text-[12px] font-bold text-[#a3b0c1] uppercase tracking-wider">
                    <Link
                        to="/forgot-password"
                        title="비밀번호 찾기(재설정)"
                        className="hover:text-black dark:hover:text-[#e5e5e5] transition-colors"
                    >
                        비밀번호 찾기(재설정)
                    </Link>
                    <div className="w-[1px] h-3 bg-[#e5e5e5] dark:bg-[#292e35]"></div>
                    <Link
                        to="/verify-email"
                        title="회원가입"
                        className="hover:text-black dark:hover:text-[#e5e5e5] text-black dark:text-[#e5e5e5] font-black italic"
                    >
                        회원가입
                    </Link>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
