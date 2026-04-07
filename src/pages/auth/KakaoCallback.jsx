import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useAlert } from "@/context/AlertContext";
import apiClient from "@/api/apiClient";

export default function KakaoCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const hasProcessed = useRef(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const params = new URLSearchParams(location.search);
        const isNewUser = params.get("isNewUser") === "true";

        console.log("콜백 데이터 확인:", { isNewUser });

        (async () => {
            try {
                const response = await apiClient.get("/users/me");
                const userData = { ...response.data, provider: "KAKAO" };

                localStorage.setItem("user", JSON.stringify(userData));
                login(userData);

                console.log("✅ 카카오 로그인 성공:", userData);

                if (isNewUser) {
                    showAlert(
                        "신규 회원 가입을 환영합니다.",
                        "회원 가입 성공",
                        "success",
                    );
                    navigate("/profile", { replace: true });
                } else {
                    showAlert(
                        "카카오로 로그인이되었습니다.",
                        "로그인 성공",
                        "success",
                    );
                    const destination =
                        location.state?.from?.pathname || "/feed";
                    navigate(destination, { replace: true });
                }
            } catch (err) {
                console.error("카카오 로그인 처리 중 오류:", err);
                showAlert(
                    "로그인 처리 중 오류가 발생했습니다.",
                    "오류",
                    "error",
                );
                navigate("/login?error=true", { replace: true });
            }
        })();
    }, [location.search, navigate, login]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#101215]">
            <div className="text-center animate-in fade-in duration-500">
                <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white mx-auto mb-4" />
                <p className="text-[15px] text-gray-500 dark:text-gray-400 font-bold">
                    카카오 로그인 처리 중...
                </p>
            </div>
        </div>
    );
}
