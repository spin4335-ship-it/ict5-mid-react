import React from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { Image, BookOpen, Plus, Sparkles, LayoutGrid } from "lucide-react";

export default function CreatePage() {
    const navigate = useNavigate();

    const creationTypes = [
        {
            id: "photo",
            title: "사진첩 만들기",
            description: "최대 4장의 사진으로 당신의 스타일을 기록하세요.",
            icon: Image,
            path: "/create-photo-album",
            theme: "bg-black text-white",
            badge: "RECOMMENDED",
        },
        {
            id: "canvas",
            title: "이미지 캔버스",
            description: "나만의 디자인 스냅을 만들어 사진첩에 추가하세요.",
            icon: BookOpen,
            path: "/create-canvas",
            theme: "bg-black text-white",

            badge: "NEW STYLE",
        },
    ];

    return (
        <ResponsiveLayout showTabs={true}>
            <div className="min-h-screen bg-[#f9f9fa] dark:bg-[#101215] text-black dark:text-white transition-colors duration-300">
                <div className="flex items-center justify-between h-14 px-4 bg-white dark:bg-[#1c1f24] border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 z-40 transition-colors duration-300">
                    <div className="w-10"></div>
                    <h1 className="font-bold text-[16px]">창작 공간</h1>
                    <div className="w-10"></div>
                </div>

                <div className="max-w-2xl mx-auto px-6 py-12 space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 rounded-full">
                            <Sparkles size={14} className="text-yellow-600" />
                            <span className="text-[11px] font-black italic tracking-widest text-yellow-700 uppercase">
                                Be Creative
                            </span>
                        </div>

                        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">
                            Create Your <br />
                            Unique Style Memory
                        </h2>
                    </div>

                    <div className="grid gap-4">
                        {creationTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => type.path && navigate(type.path)}
                                disabled={type.isComingSoon}
                                className={`w-full p-8 rounded-[32px] flex items-center justify-between text-left group transition-all relative overflow-hidden ${type.theme} ${type.isComingSoon ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] shadow-xl active:scale-[0.98]"}`}
                            >
                                {type.id === "photo" && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                                )}

                                <div className="flex items-center gap-6 z-10">
                                    <div
                                        className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${type.id === "photo" ? "bg-white/10 border-white/20" : "bg-white/10 border-white/20"}`}
                                    >
                                        <type.icon size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-black italic tracking-tighter uppercase">
                                                {type.title}
                                            </h3>

                                            {type.badge && (
                                                <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded italic">
                                                    {type.badge}
                                                </span>
                                            )}
                                        </div>

                                        <p
                                            className={`text-[13px] font-medium ${type.id === "photo" ? "opacity-70" : "text-gray-400"}`}
                                        >
                                            {type.description}
                                        </p>
                                    </div>
                                </div>

                                {!type.isComingSoon && (
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all transition-colors">
                                        <Plus size={20} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-[#1c1f24] p-8 rounded-[32px] border border-[#f3f3f3] dark:border-[#292e35] shadow-sm relative overflow-hidden group">
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <LayoutGrid size={24} />
                            </div>
                            <div>
                                <h4 className="text-[15px] font-black italic tracking-widest uppercase mb-1">
                                    Style Insight
                                </h4>
                                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                                    당신의 감각적인 스냅은 이미 많은 사람들에게
                                    새로운 스타일 영감이 되고 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
