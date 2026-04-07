import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft } from "lucide-react";
import { notificationService } from "@/api/notificationService";

export default function NotificationSettingsPage() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                if (typeof notificationService.getSettings === "function") {
                    const settings = await notificationService.getSettings();
                    setSettings(settings);
                } else {
                    throw new Error("getSettings not implemented");
                }
            } catch (e) {
                console.warn("getSettings failed", e);
                setSettings({
                    friendRequest: true,
                    friendAccept: true,
                    badge: true,
                    system: true,
                });
            }
        };
        load();
    }, []);

    const toggleSetting = async (key) => {
        newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        try {
            if (typeof notificationService.updateSettings === "function") {
                await notificationService.updateSettings(newSettings);
            }
        } catch (e) {
            console.warn("updateSettings failed", e);
        }
    };

    if (!settings)
        return (
            <ResponsiveLayout showTabs={false}>
                <div className="p-10 text-center uppercase font-black italic tracking-widest text-[#ccd3db] animate-pulse">
                    Loading SNAP...
                </div>
            </ResponsiveLayout>
        );

    const settingSections = [
        {
            title: "커뮤니티 알림",
            items: [
                {
                    key: "friendRequest",
                    label: "글벗 요청",
                    desc: "새로운 글벗 요청이 올 때 알림을 받습니다.",
                },
                {
                    key: "friendAccept",
                    label: "글벗 수락",
                    desc: "내 글벗 요청이 수락되었을 때 알림을 받습니다.",
                },
                {
                    key: "badge",
                    label: "달개 알림",
                    desc: "새로운 달개를 획득했을 때 알림을 받습니다.",
                },
            ],
        },
        {
            title: "시스템 및 공지",
            items: [
                {
                    key: "system",
                    label: "시스템 공지",
                    desc: "서비스 점검, 업데이트 등 주요 안내 사항을 받습니다.",
                },
            ],
        },
    ];

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-[#f9f9fa] dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center justify-between h-14 px-4 bg-white dark:bg-[#1c1f24] border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 z-40">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-[16px]">알림 설정</h1>

                    <div className="w-10"></div>
                </div>

                <div className="flex flex-col gap-8 py-8">
                    {settingSections.map((section, idx) => (
                        <div key={idx} className="flex flex-col">
                            <h2 className="px-6 mb-3 text-[12px] font-black italic tracking-widest text-[#a3b0c1] uppercase">
                                {section.title}
                            </h2>
                            <div className="bg-white dark:bg-[#1c1f24] border-y border-[#f3f3f3] dark:border-[#292e35] divide-y divide-[#f3f3f3] dark:divide-[#292e35]">
                                {section.items.map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex items-center justify-between px-6 py-5"
                                    >
                                        <div className="flex flex-col gap-1 pr-6">
                                            <span className="text-[15px] font-bold text-black dark:text-[#e5e5e5]">
                                                {item.label}
                                            </span>

                                            <span className="text-[12px] text-[#7b8b9e] font-medium leading-tight">
                                                {item.desc}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() =>
                                                toggleSetting(item.key)
                                            }
                                            className={`relative w-[50px] h-[28px] rounded-full transition-all duration-300 flex-shrink-0 ${settings[item.key] ? "bg-black dark:bg-[#e5e5e5]" : "bg-[#e5e5e5] dark:bg-[#292e35]"}`}
                                        >
                                            <div
                                                className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white dark:bg-[#101215] rounded-full shadow-md transition-all duration-300 ${settings[item.key] ? "translate-x-[22px]" : "translate-x-0"}`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="px-6 mt-4">
                        <p className="text-[11px] text-[#ccd3db] font-medium leading-relaxed">
                            * 알림 설정은 기기별로 다르게 설정될 수 있습니다.
                            <br />* 마케팅 정보 수신 동의 시 이벤트 및 맞춤 혜택
                            정보를 받으실 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
