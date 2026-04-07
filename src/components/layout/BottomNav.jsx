import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Home, PenTool, Award, Users, Landmark, User } from "lucide-react";

export default function BottomNav() {
    const location = useLocation();

    const navigate = useNavigate();

    const tabs = [
        { id: "feed", label: "게시글", icon: Home, path: "/" },
        { id: "create", label: "창작", icon: PenTool, path: "/create" },
        { id: "badges", label: "달개", icon: Award, path: "/badges" },
        { id: "friends", label: "글벗", icon: Users, path: "/friends" },
        { id: "finance", label: "금융", icon: Landmark, path: "/finance" },
        { id: "profile", label: "설정", icon: User, path: "/profile" },
    ];

    const currentTab =
        tabs.find((tab) => {
            if (tab.path === "/") return location.pathname === "/";
            return location.pathname.startsWith(tab.path);
        })?.id || "feed";

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1c1f24] border-t border-[#f3f3f3] dark:border-[#292e35] z-50 sm:hidden pb-safe"
            style={{
                paddingBottom: "max(env(safe-area-inset-bottom, 0px), 4px)",
            }}
        >
            <div className="flex items-center justify-around h-[66px] px-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;

                    const isActive = currentTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.path)}
                            className="flex flex-col items-center justify-center gap-1.5 flex-1 h-full relative"
                        >
                            <div
                                className={`p-2 transition-all duration-300 ${isActive ? "bg-black text-[#e5e5e5] rounded-xl" : "text-[#a3b0c1]"}`}
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                />
                            </div>

                            <span
                                className={`text-[9px] font-black italic tracking-widest uppercase truncate transition-all ${isActive ? "text-black dark:text-[#e5e5e5] opacity-100" : "text-[#ccd3db] opacity-0"}`}
                            >
                                {tab.label}
                            </span>

                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black dark:bg-[#e5e5e5]"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
