import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "@/api/apiClient";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const isVerifying = useRef(false);

    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = !!user;
    const [notiRefreshTag, setNotiRefreshTag] = useState(0);

    const refreshNotifications = useCallback(() => {
        setNotiRefreshTag((prev) => prev + 1);
    }, []);

    const login = useCallback((userData) => {
        if (!userData) {
            console.error("로그인 데이터가 부족합니다:", userData);
            return;
        }

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
    }, []);

    const handleLogoutCleanUp = useCallback(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("notificationEnabled");
        setUser(null);
    }, []);

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout", {}, { withCredentials: true });
        } catch (err) {
            console.error(
                "서버 로그아웃 처리 실패 (무시하고 클라이언트 정리 진행):",
                err,
            );
        } finally {
            localStorage.removeItem("user");
            localStorage.removeItem("notificationEnabled");
            handleLogoutCleanUp();
            window.location.replace("/login");
        }
    };

    const updateUser = useCallback((data) => {
        setUser((prev) => {
            if (!prev) return null;
            const updatedData = { ...prev, ...data };
            localStorage.setItem("user", JSON.stringify(updatedData));
            return updatedData;
        });
    }, []);

    const checkAuth = useCallback(async () => {
        if (isVerifying.current) {
            console.log("이미 인증 확인 중입니다. 중복 요청을 차단합니다.");
            return;
        }

        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
            setIsLoading(false);
            return;
        }

        try {
            isVerifying.current = true;

            await apiClient.post(
                "/auth/refresh",
                {},
                { withCredentials: true },
            );

            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData) {
                setUser(userData);
                console.log("✅ 세션 복구 성공");
            } else {
                throw new Error("유저 정보가 없습니다.");
            }
        } catch (error) {
            console.error("인증 확인 중 오류 발생:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 400
            ) {
                handleLogoutCleanUp();
                if (
                    location.pathname !== "/login" &&
                    location.pathname !== "/signup"
                ) {
                    navigate("/login", { replace: true });
                }
            } else {
                const savedUser = localStorage.getItem("user");
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            }
        } finally {
            isVerifying.current = false;
            setIsLoading(false);
        }
    }, [navigate, location.pathname, handleLogoutCleanUp]);

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        login,
        logout,
        checkAuth,
        updateUser,
        notiRefreshTag,
        triggerNotiRefresh: refreshNotifications,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium text-sm">
                        인증 정보를 확인 중입니다...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(
            "useAuth는 반드시 AuthProvider 안에서 사용해야 합니다.",
        );
    }
    return context;
};
