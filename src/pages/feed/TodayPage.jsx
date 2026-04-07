import React, { useState } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { Heart, MessageCircle } from "lucide-react";
import FAB from "@/components/common/FAB";

export default function TodayPage() {
    const [height, setHeight] = useState("");

    const [weight, setWeight] = useState("");

    const coordiData = [
        {
            id: 1,
            img: "https://picsum.photos/seed/c1/300/400",
            title: "무신사 코디",
            likes: 103,
            comments: 0,
            ai: true,
        },
        {
            id: 2,
            img: "https://picsum.photos/seed/c2/300/400",
            title: "무신사 코디",
            likes: 284,
            comments: 2,
            ai: true,
        },
        {
            id: 3,
            img: "https://picsum.photos/seed/c3/300/400",
            title: "무신사 코디",
            likes: 278,
            comments: 2,
            ai: true,
        },
        {
            id: 4,
            img: "https://picsum.photos/seed/c4/300/400",
            title: "무신사 코디",
            likes: 230,
            comments: 0,
            ai: true,
        },
    ];

    return (
        <ResponsiveLayout>
            <div className="bg-[#f9f9f9] dark:bg-[#101215] min-h-screen pb-20">
                <div className="bg-white dark:bg-[#1c1f24] pb-6 pt-4 mb-3">
                    <div className="px-4 flex justify-between items-center mb-3">
                        <h2 className="text-lg font-bold text-black dark:text-[#e5e5e5]">
                            무신사 코디
                        </h2>

                        <button className="text-[13px] text-[#7b8b9e] underline underline-offset-2">
                            더보기
                        </button>
                    </div>

                    <div className="flex overflow-x-auto gap-1 px-4 scrollbar-hide">
                        {coordiData.map((item) => (
                            <div
                                key={item.id}
                                className="min-w-[150px] w-[150px] flex flex-col relative"
                            >
                                <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-sm">
                                    <img
                                        src={item.img}
                                        alt="Coordi"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />

                                    {item.ai && (
                                        <div className="absolute bottom-2 left-2 flex items-center bg-transparent drop-shadow-md text-white text-[10px]">
                                            ✨ AI로 제작된 이미지
                                        </div>
                                    )}

                                    <button className="absolute bottom-2 right-2 text-white">
                                        <Heart
                                            size={18}
                                            fill="transparent"
                                            strokeWidth={2}
                                        />
                                    </button>

                                    <div className="absolute right-2 bottom-6 font-black italic text-md text-black mix-blend-overlay">
                                        MUSINSA
                                    </div>
                                </div>

                                <div className="py-2">
                                    <div className="flex items-center gap-1 mb-1">
                                        <div className="w-5 h-5 rounded-[4px] bg-gray-200 aspect-square overflow-hidden shrink-0 border border-gray-100">
                                            <img
                                                src="https://picsum.photos/seed/musinsa_logo/20/20"
                                                alt="logo"
                                            />
                                        </div>
                                        <span className="text-[12px] font-bold">
                                            {item.title}
                                        </span>

                                        <span className="text-[10px] bg-blue-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                                            ✔
                                        </span>
                                    </div>

                                    <div className="flex items-center text-[#7b8b9e] text-[11px] gap-2">
                                        <div className="flex items-center gap-[2px]">
                                            <Heart size={10} /> {item.likes}
                                        </div>

                                        {item.comments > 0 && (
                                            <div className="flex items-center gap-[2px]">
                                                <MessageCircle size={10} />{" "}
                                                {item.comments}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1c1f24] p-4 flex gap-4 h-[120px] mb-3">
                    <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-[15px] font-bold text-black dark:text-[#e5e5e5] mb-1">
                            나와 비슷한 체형 스냅 추천
                        </h3>
                        <p className="text-[13px] text-[#424a54] leading-tight mt-1">
                            키 ∙ 몸무게를 입력하고,
                            <br />
                            스냅을 추천 받아 보세요.
                        </p>
                    </div>

                    <div className="w-[120px] flex flex-col gap-2 justify-center bg-[#e5e5e5]/40 dark:bg-[#292e35]/40 p-2 rounded-sm shrink-0">
                        <div className="flex bg-[#f3f3f3] dark:bg-[#292e35] rounded border border-gray-200/50 dark:border-[#424a54]/50 relative">
                            <input
                                type="number"
                                placeholder="키"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full bg-transparent text-[13px] py-1.5 pl-2 pr-6 outline-none appearance-none"
                            />

                            <span className="absolute right-2 top-1.5 text-[12px] text-gray-400">
                                cm
                            </span>
                        </div>

                        <div className="flex bg-[#f3f3f3] dark:bg-[#292e35] rounded border border-gray-200/50 dark:border-[#424a54]/50 relative">
                            <input
                                type="number"
                                placeholder="몸무게"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full bg-transparent text-[13px] py-1.5 pl-2 pr-6 outline-none appearance-none"
                            />

                            <span className="absolute right-2 top-1.5 text-[12px] text-gray-400">
                                kg
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <FAB />
        </ResponsiveLayout>
    );
}
