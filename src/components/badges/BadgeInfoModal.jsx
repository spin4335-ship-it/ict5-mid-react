import React, { useState, useEffect } from "react";
import {
    X,
    BookOpen,
    Target,
    Sparkles,
    Loader2,
    Trophy,
    HelpCircle,
} from "lucide-react";
import { badgeService } from "@/api/badgeService";

export default function BadgeInfoModal({ isOpen, onClose }) {
    const [badgeTypes, setBadgeTypes] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setIsLoading(true);
        badgeService
            .getAllTypes()
            .then((data) => {
                console.log("[badgeTypes] 불러오기:", data?.length, "개");
                setBadgeTypes(data);
            })
            .catch(() => setBadgeTypes([]))
            .finally(() => setIsLoading(false));
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white dark:bg-[#1c1f24] rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden border dark:border-[#292e35]">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#f3f3f3] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-black dark:text-white">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-[18px] font-black italic tracking-tighter uppercase">
                            BADGE GUIDE
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center bg-[#f3f3f3] dark:bg-[#292e35] rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto scrollbar-hide space-y-8">
                    <div className="bg-black dark:bg-white p-8 rounded-[24px] relative overflow-hidden group shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                        <div className="z-10 relative">
                            <span className="text-[11px] font-black italic tracking-widest text-white/50 dark:text-black/40 uppercase mb-2 block">
                                The Concept
                            </span>

                            <h3 className="text-2xl font-black italic tracking-tighter text-white dark:text-black uppercase mb-3">
                                마음을 잇는 장식, 달개
                            </h3>

                            <p className="text-[13px] text-white/70 dark:text-black/60 font-medium leading-relaxed bg-white/5 dark:bg-black/5 p-4 rounded-xl border border-white/10 dark:border-black/5">
                                '달개'는 배지의 순우리말입니다. 당신의 소중한
                                기록과 성장을 상징하며, MYMORY에서의 영향력을
                                증명하는 특별한 엠블럼입니다.
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-6 ml-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-[14px] font-black italic tracking-widest uppercase text-black dark:text-white">
                                Badge Categories
                            </span>
                        </div>

                        <div className="space-y-3">
                            {isLoading ? (
                                <div className="flex flex-col items-center py-12 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                    <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">
                                        Loading Catalog
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {badgeTypes?.map((type) => (
                                        <div
                                            key={type.id}
                                            className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-[#101215] rounded-2xl border border-transparent hover:border-black dark:hover:border-white transition-all group"
                                        >
                                            <div className="w-14 h-14 bg-white dark:bg-[#1c1f24] rounded-xl flex items-center justify-center shadow-sm border border-[#f3f3f3] dark:border-[#292e35] group-hover:scale-110 transition-transform overflow-hidden">
                                                <span className="text-3xl">
                                                    {type.emoji}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-black italic tracking-tighter uppercase text-black dark:text-white mb-0.5">
                                                    {type.title}
                                                </p>

                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-snug">
                                                    {type.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-yellow-400/10 dark:bg-yellow-400/5 rounded-2xl p-5 border border-yellow-400/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-yellow-600" />
                            <span className="text-[12px] font-black italic tracking-widest uppercase text-yellow-700 dark:text-yellow-400">
                                Ranking System
                            </span>
                        </div>

                        <p className="text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed font-bold">
                            수집한 달개의 총 점수에 따라{" "}
                            <span className="text-black dark:text-white border-b-2 border-black/10 dark:border-white/10 uppercase italic">
                                Global Ranking
                            </span>
                            이 산정됩니다. 꾸준히 기록하고 더 많은 달개를
                            모아보세요!
                        </p>
                    </div>
                </div>

                <div className="px-6 py-6 border-t border-[#f3f3f3] dark:border-[#292e35] bg-gray-50 dark:bg-[#1c1f24]">
                    <button
                        onClick={onClose}
                        className="w-full h-14 bg-black dark:bg-white text-white dark:text-black font-black italic tracking-[2px] uppercase text-[15px] rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
                    >
                        CONFIRM
                    </button>
                </div>
            </div>
        </div>
    );
}
