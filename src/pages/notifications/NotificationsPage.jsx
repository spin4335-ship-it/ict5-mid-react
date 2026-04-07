import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { notificationService } from "@/api/notificationService";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";

export default function NotificationsPage() {
    const navigate = useNavigate();

    const { showAlert, showConfirm } = useAlert();
    const { triggerNotiRefresh, notiRefreshTag } = useAuth();

    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getAll();
            const mapped = Array.isArray(data)
                ? data.map((n) => ({
                      ...n,
                      isRead: n.isRead ?? n.read ?? false,
                  }))
                : [];
            console.log("[notifications] 불러오기:", mapped.length, "개");
            setNotifications(mapped);
        } catch (error) {
            console.error("[notifications] 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [notiRefreshTag]);

    const handleReadOne = async (notiId, isRead) => {
        if (isRead) return;

        try {
            await notificationService.markAsRead(notiId);

            setNotifications((prev) =>
                prev.map((noti) =>
                    noti.id === notiId ? { ...noti, isRead: true } : noti,
                ),
            );

            if (triggerNotiRefresh) triggerNotiRefresh();
        } catch (error) {
            console.error("알림 읽음 처리 실패:", error);
        }
    };

    const handleReadAll = () => {
        showConfirm({
            message: "모든 알림을 읽음 처리하시겠습니까?",
            confirmText: "모두 읽음",
            onConfirm: async () => {
                try {
                    await notificationService.markAllRead();
                    console.log("[notifications] 전체 읽음 처리 성공");
                    await loadNotifications();
                    if (triggerNotiRefresh) triggerNotiRefresh();
                    showAlert(
                        "모든 알림이 읽음 처리되었습니다.",
                        "알림",
                        "success",
                    );
                } catch (e) {
                    showAlert("알림 처리에 실패했습니다.");
                }
            },
        });
    };

    const getIcon = (type) => {
        switch (type) {
            case "LIKE":
                return (
                    <Heart size={18} className="text-red-500 fill-red-500" />
                );
            case "COMMENT":
                return (
                    <MessageCircle
                        size={18}
                        className="text-blue-500 fill-blue-500"
                    />
                );
            case "FOLLOW":
                return <UserPlus size={18} className="text-green-500" />;
            default:
                return <Bell size={18} className="text-gray-400" />;
        }
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center justify-between h-14 px-4 border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 bg-white dark:bg-[#1c1f24] z-10">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-[16px]">알림</h1>

                    <button
                        onClick={handleReadAll}
                        className="text-[13px] font-bold text-[#7b8b9e] px-2 active:opacity-50"
                    >
                        모두 읽음
                    </button>
                </div>

                <div className="flex flex-col">
                    {notifications.length > 0 ? (
                        notifications.map((noti) => (
                            <div
                                key={noti.id}
                                onClick={() =>
                                    handleReadOne(noti.id, noti.isRead)
                                }
                                className={`flex items-start gap-4 px-6 py-5 border-b border-[#f3f3f3] dark:border-[#292e35] transition-colors ${
                                    !noti.isRead
                                        ? "bg-blue-50/30 dark:bg-blue-900/10 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                                        : "bg-transparent"
                                }`}
                            >
                                <div className="mt-1">{getIcon(noti.type)}</div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <p className="text-[14px] leading-relaxed">
                                        {noti.message}
                                    </p>
                                    <span className="text-[11px] text-[#a3b0c1] font-bold uppercase tracking-tight">
                                        {noti.createdAt}
                                    </span>
                                </div>
                                {!noti.isRead && (
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-[#a3b0c1] text-[14px]">
                            알림이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </ResponsiveLayout>
    );
}
