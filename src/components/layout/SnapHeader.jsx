import React, { useEffect, useState, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Bell, LogOut } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import { notificationService } from "@/api/notificationService";

import { userService } from "@/api/userService";
import { useAlert } from "@/context/AlertContext";

export default function SnapHeader() {
    const navigate = useNavigate();

    const {
        isAuthenticated,
        user,
        logout,
        notiRefreshTag,
        triggerNotiRefresh: refreshNotifications,
    } = useAuth();
    const { showAlert, showConfirm } = useAlert();

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
                    window.location.href = "/login";
                    showAlert("로그아웃되었습니다.", "성공", "success");
                } catch (error) {
                    console.error(error);
                    showAlert("오류가 발생했습니다.", "오류", "error");
                }
            },
            onCancel: () => {
                console.log("사용자가 로그아웃을 취소함");
            },
        });
    };

    const [unreadCount, setUnreadCount] = useState(0);
    const lastCountRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            lastCountRef.current = null;
            return;
        }

        let isFetching = false;

        const fetchUnread = async () => {
            if (isFetching) return;
            isFetching = true;

            try {
                let notiEnabled = localStorage.getItem("notificationEnabled");

                if (notiEnabled === null) {
                    try {
                        const settings = await userService.getSettings();

                        notiEnabled = String(
                            settings.notificationEnabled ??
                                settings.pushNotification ??
                                true,
                        );
                        localStorage.setItem(
                            "notificationEnabled",
                            notiEnabled,
                        );
                    } catch (err) {
                        console.warn("설정 로딩 실패, 기본값(true) 사용:", err);
                        notiEnabled = "true";

                        localStorage.setItem("notificationEnabled", "true");
                    }
                }

                if (notiEnabled === "false") {
                    setUnreadCount(0);
                    return;
                }

                const data = await notificationService.getAll();
                const newCount = Array.isArray(data)
                    ? data.filter((n) => !(n.isRead ?? n.read)).length
                    : 0;
                console.log(
                    "🔄 [폴링 중] 이전 알림수:",
                    lastCountRef.current,
                    " / 현재  알림수:",
                    newCount,
                );

                if (
                    lastCountRef.current !== null &&
                    newCount > lastCountRef.current
                ) {
                    console.log("🔔 알림창 띄우기 시도!");

                    refreshNotifications();

                    const diff = newCount - lastCountRef.current;
                    console.log(`🔔 알림 발생! 차이: ${diff}`);

                    showConfirm({
                        title: "글벗 알림",
                        message: `🔔 새로운 요청이 ${diff}건 도착했습니다!\n지금 친구 관리 페이지로 이동하시겠습니까?`,
                        type: "info",
                        confirmText: "이동하기",
                        cancelText: "나중에",
                        onConfirm: () => {
                            console.log("✅ 승인: 친구 페이지로 이동/새로고침");
                            if (location.pathname === "/friends") {
                                window.location.reload();
                            } else {
                                navigate("/friends");
                            }
                        },
                        onCancel: () => {
                            console.log(
                                "❌ 취소: 현재 페이지 유지 및 새로고침",
                            );

                            window.location.reload();
                        },
                    });
                }

                lastCountRef.current = newCount;
                setUnreadCount(newCount);
            } catch (e) {
                console.error("알림을 가져오는 중 오류 발생:", e);
            } finally {
                isFetching = false;
            }
        };
        fetchUnread();

        const interval = setInterval(() => {
            console.log("⏰ 30초 경과: 알림 체크를 시작합니다.");
            fetchUnread();
        }, 30000);

        return () => {
            console.log("🛑 폴링 중단");
            clearInterval(interval);
        };
    }, [isAuthenticated, notiRefreshTag]);

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1c1f24] h-[60px] border-b border-[#f3f3f3] dark:border-[#292e35]">
            {isAuthenticated ? (
                <>
                    <button
                        onClick={() => navigate("/notifications")}
                        className="sm:hidden relative w-10 h-10 flex items-center justify-center text-black dark:text-[#e5e5e5] hover:opacity-60 transition-opacity"
                    >
                        <Bell size={22} strokeWidth={2} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-black dark:bg-[#292e35] text-[#e5e5e5] text-[9px] font-black rounded-full flex items-center justify-center px-[3px]">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <div className="hidden sm:block w-10" />
                </>
            ) : (
                <div className="w-10" />
            )}

            <Link
                to="/"
                className="text-3xl font-black tracking-tighter text-black dark:text-[#e5e5e5] italic"
            >
                MYMORY
            </Link>

            {isAuthenticated ? (
                <>
                    <button
                        onClick={() => navigate("/notifications")}
                        className="hidden sm:flex relative w-10 h-10 items-center justify-center text-black dark:text-[#e5e5e5] hover:opacity-60 transition-opacity"
                    >
                        <Bell size={22} strokeWidth={2} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-black dark:bg-[#292e35] text-[#e5e5e5] text-[9px] font-black rounded-full flex items-center justify-center px-[3px]">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="sm:hidden w-10 h-10 flex items-center justify-center text-black dark:text-[#e5e5e5] hover:opacity-60 transition-opacity"
                    >
                        <LogOut size={20} strokeWidth={2} />
                    </button>
                </>
            ) : (
                <div className="w-10" />
            )}
        </div>
    );
}
