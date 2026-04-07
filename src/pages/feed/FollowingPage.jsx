import React from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";

export default function FollowingPage() {
    return (
        <ResponsiveLayout>
            <div className="flex flex-col items-center justify-center pt-20">
                <div className="w-16 h-16 bg-gray-100 dark:bg-[#292e35] rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-[#424a54]">
                    <span className="text-gray-400 text-2xl">👤</span>
                </div>

                <p className="text-[#a3b0c1] font-medium text-[15px] mb-2">
                    팔로우한 유저가 없습니다.
                </p>

                <p className="text-[#a3b0c1] font-medium text-[15px] mb-4">
                    새로운 스타일을 찾아 팔로우해 보세요.
                </p>

                <button className="bg-black text-white px-6 py-3 font-semibold text-[15px] rounded hover:bg-gray-800 transition-colors">
                    추천 스냅 보기
                </button>
            </div>
        </ResponsiveLayout>
    );
}
