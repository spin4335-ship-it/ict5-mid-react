import React from "react";

import { Search } from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

export default function GlobalNav() {
    const location = useLocation();

    const navigate = useNavigate();

    const { isAuthenticated, logout } = useAuth();
    const { showAlert, showConfirm } = useAlert();

    const leftItems = [
        { name: "HOME", path: "/" },
        { name: "창작", path: "/create" },
        { name: "글벗", path: "/friends" },
        { name: "달개", path: "/badges" },
        { name: "금융", path: "/finance" },
        { name: "설정", path: "/profile" },
    ];

    const handleLogout = () => {
        showConfirm({
            title: "로그아웃",
            message: "정말 로그아웃 하시겠습니까?",
            type: "info",
            confirmText: "로그아웃",
            cancelText: "취소",
            onConfirm: async () => {
                try {
                    await logout();

                    showAlert("로그아웃되었습니다.", "성공", "success");

                    window.location.href = "/login";
                } catch (error) {
                    console.error(error);
                    showAlert("오류가 발생했습니다.", "오류", "error");
                }
            },
            onCancel: () => {
                console.log(
                    "사용자가 로그아웃을 취소함: 리렌더링 없이 현재 페이지 유지",
                );
            },
        });
    };

    const [searchTerm, setSearchTerm] = React.useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);

            setSearchTerm("");
        }
    };

    return (
        <div className="bg-[#111111] text-[#c4c4c4] text-[13px] font-medium h-[44px]">
            <div className="flex items-center justify-between h-full px-3 w-full">
                <div className="flex items-center flex-1 overflow-x-auto scrollbar-hide pl-4">
                    <div className="flex items-center space-x-6 flex-shrink-0 pr-4">
                        {leftItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex-shrink-0 transition-all ${isActive ? "text-white font-black italic tracking-widest underline underline-offset-4" : "hover:text-white"}`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-4 border-l border-[#333] ml-4 flex-shrink-0 pl-4">
                    <div className="hidden md:flex items-center gap-4">
                        <form
                            onSubmit={handleSearch}
                            className="relative group"
                        >
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="#태그 검색"
                                className="bg-[#222] text-white text-[11px] font-black italic tracking-widest px-4 py-1.5 rounded-full outline-none border border-transparent focus:border-white/30 w-[140px] transition-all focus:w-[200px] placeholder:text-gray-500"
                            />

                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-white"
                            >
                                <Search size={14} />
                            </button>
                        </form>
                    </div>

                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="bg-white text-black px-4 py-1.5 text-[11px] font-black italic tracking-[1px] hover:bg-gray-200 transition-all"
                        >
                            LOGOUT
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-white text-black px-4 py-1.5 text-[11px] font-black italic tracking-[1px] hover:bg-gray-200 transition-all"
                        >
                            LOGIN
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
