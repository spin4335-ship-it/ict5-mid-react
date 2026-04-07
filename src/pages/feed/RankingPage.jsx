import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/api/apiClient";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import RankSnapCard from "@/components/feed/RankSnapCard";
import FAB from "@/components/common/FAB";
import { Info, ChevronDown } from "lucide-react";

export default function RankingPage() {
    const [allItems, setAllItems] = useState([]);

    const [displayCount, setDisplayCount] = useState(20);

    const [loading, setLoading] = useState(true);

    const sentinelRef = useRef(null);

    useEffect(() => {}, []);

    useEffect(() => {}, []);

    const snaps = allItems.slice(0, displayCount);

    const subTabs = ["스냅", "멤버", "브랜드"];
    const styles = [
        "전체",
        "캐주얼",
        "스트릿",
        "미니멀",
        "걸리시",
        "로맨틱",
        "시크",
    ];

    return (
        <ResponsiveLayout>
            <div className="flex px-4 border-b border-[#f3f3f3] dark:border-[#292e35] bg-white dark:bg-[#1c1f24]">
                {subTabs.map((tab, idx) => (
                    <button
                        key={tab}
                        className={`py-3 mr-4 text-[14px] ${idx === 0 ? "font-bold border-b-2 border-black" : "text-[#7b8b9e] font-medium"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex overflow-x-auto px-4 py-3 bg-white dark:bg-[#1c1f24] scrollbar-hide border-b border-[#f3f3f3] dark:border-[#292e35] gap-4">
                {styles.map((style, idx) => (
                    <button
                        key={style}
                        className={`whitespace-nowrap text-[14px] ${idx === 0 ? "font-bold text-black" : "text-[#7b8b9e]"}`}
                    >
                        {style}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-[#f9f9fa] dark:bg-[#101215]">
                <span className="flex items-center text-[13px] text-[#7b8b9e]">
                    03.03 12:00 기준 <Info size={14} className="ml-1" />
                </span>
                <button className="flex items-center text-[13px] text-[#7b8b9e]">
                    최근 1일 <ChevronDown size={14} className="ml-0.5" />
                </button>
            </div>

            <div className="bg-white dark:bg-[#101215]">
                {loading ? (
                    <div className="p-4 text-center text-gray-400">
                        Loading...
                    </div>
                ) : (
                    <div className="columns-2 gap-1 px-1">
                        {snaps.map((snap, index) => (
                            <RankSnapCard
                                key={snap.id}
                                snap={snap}
                                rank={index + 1}
                            />
                        ))}
                    </div>
                )}

                <div
                    ref={sentinelRef}
                    className="h-10 w-full flex items-center justify-center pt-4 pb-8"
                >
                    {displayCount < allItems.length && (
                        <span className="text-gray-400 text-sm">
                            Loading more...
                        </span>
                    )}
                </div>
            </div>

            <FAB />
        </ResponsiveLayout>
    );
}
