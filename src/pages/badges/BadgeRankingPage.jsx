import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Crown } from "lucide-react";
import { badgeService } from "@/api/badgeService";
import { DEFAULT_AVATAR, getImageUrl } from "@/utils/imageUtils";
import { useAuth } from "@/context/AuthContext";

export default function BadgeRankingPage() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [ranking, setRanking] = useState([]);

    const [activeTab, setActiveTab] = useState("GLOBAL");

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                if (activeTab === "GLOBAL") {
                    const data = await badgeService.getGlobalRanking({
                        size: 30,
                    });
                    const ranking = Array.isArray(data?.content)
                        ? data.content
                        : [];
                    console.log("[ranking] GLOBAL:", ranking.length, "명");
                    setRanking(ranking);
                } else {
                    const [data, globalData] = await Promise.all([
                        badgeService.getFriendsRanking({ size: 30 }),
                        badgeService.getGlobalRanking({ size: 100 }),
                    ]);
                    let ranking = Array.isArray(data?.content)
                        ? data.content
                        : [];
                    const globalList = Array.isArray(globalData?.content)
                        ? globalData.content
                        : [];

                    const myId = currentUser?.id || currentUser?.userId;
                    const meInGlobal = globalList.find(
                        (u) => u.userId === myId,
                    );

                    const alreadyIncluded = ranking.some(
                        (u) => u.userId === myId,
                    );
                    if (!alreadyIncluded && currentUser) {
                        ranking = [
                            ...ranking,
                            meInGlobal || {
                                userId: myId,
                                username: currentUser.username,
                                profileImageUrl:
                                    currentUser.profileImageUrl ||
                                    currentUser.profileImage,
                                totalBadges: 0,
                            },
                        ];
                    }

                    ranking.sort(
                        (a, b) => (b.totalBadges || 0) - (a.totalBadges || 0),
                    );

                    console.log(
                        "[ranking] FRIENDS:",
                        ranking.length,
                        "명 (본인 포함)",
                    );
                    setRanking(ranking);
                }
            } catch (error) {
                console.error("랭킹 로드 실패:", error);
                setRanking([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [activeTab]);

    const renderContent = () => {
        if (isLoading)
            return (
                <div className="p-20 text-center font-bold italic opacity-20 animate-pulse uppercase tracking-widest">
                    Calculating Rank...
                </div>
            );

        if (ranking.length === 0)
            return (
                <div className="p-20 text-center text-gray-400 font-bold italic uppercase tracking-widest">
                    No Data Found
                </div>
            );

        return (
            <div className="flex flex-col">
                {ranking.map((user, idx) => (
                    <div
                        key={user.userId || user.id || idx}
                        className="flex items-center justify-between px-6 py-4 border-b border-[#f3f3f3] dark:border-[#292e35] cursor-pointer active:bg-gray-50 dark:active:bg-[#292e35] transition-colors"
                        onClick={() => {
                            const userId = user.userId || user.id;
                            const myId = currentUser?.id || currentUser?.userId;
                            if (userId === myId) {
                                navigate("/profile");
                            } else {
                                navigate(`/friend/${userId}`);
                            }
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-6 text-[14px] font-black italic text-[#ccd3db]">
                                {idx + 1 === 1 ? (
                                    <Crown
                                        size={18}
                                        className="text-yellow-400"
                                    />
                                ) : (
                                    idx + 1
                                )}
                            </div>

                            <img
                                src={
                                    getImageUrl(
                                        user?.profileImageUrl ||
                                            user?.profileImage,
                                    ) || DEFAULT_AVATAR
                                }
                                alt="p"
                                className="w-10 h-10 rounded-xl border border-[#f3f3f3]"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = DEFAULT_AVATAR;
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-[14px]">
                                    {user?.username}
                                </span>

                                <span className="text-[11px] text-blue-600 font-bold">
                                    LV.
                                    {user?.level ||
                                        Math.floor(
                                            (user?.totalBadges || 0) / 5,
                                        ) + 1}
                                </span>
                            </div>
                        </div>

                        <div className="text-[12px] font-bold text-[#7b8b9e]">
                            {(user?.totalBadges || 0) * 100} pts
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center h-14 px-4 border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 bg-white dark:bg-[#1c1f24] z-10">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="flex-1 text-center font-bold text-[16px] mr-8">
                        달개 랭킹
                    </h1>
                </div>

                <div className="flex border-b border-[#f3f3f3] dark:border-[#292e35]">
                    <button
                        onClick={() => setActiveTab("GLOBAL")}
                        className={`flex-1 py-3 text-[14px] font-bold relative ${activeTab === "GLOBAL" ? "text-black" : "text-[#a3b0c1]"}`}
                    >
                        전체 순위
                        {activeTab === "GLOBAL" && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("FRIENDS")}
                        className={`flex-1 py-3 text-[14px] font-bold relative ${activeTab === "FRIENDS" ? "text-black" : "text-[#a3b0c1]"}`}
                    >
                        글벗 순위위
                        {activeTab === "FRIENDS" && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                        )}
                    </button>
                </div>

                {renderContent()}
            </div>
        </ResponsiveLayout>
    );
}
