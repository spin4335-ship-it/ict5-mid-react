import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Search } from "lucide-react";
import { friendService } from "@/api/friendService";
import { getImageUrl, DEFAULT_AVATAR } from "@/utils/imageUtils";

export default function AddFriendPage() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();

        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        try {
            const data = await friendService.searchUsers(trimmedQuery);
            setResults(data || []);
        } catch (error) {
            alert("친구를 찾을 수 없습니다.");
            setResults([]);
        }
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center h-14 px-4 border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 bg-white dark:bg-[#1c1f24] z-10">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex-1 px-2">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="친구 검색"
                                className="w-full h-10 pl-10 pr-4 bg-[#f3f3f3] dark:bg-[#292e35] text-black dark:text-[#e5e5e5] rounded-full text-[14px] outline-none"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />

                            <Search
                                size={18}
                                className="absolute left-3 top-2.5 text-[#a3b0c1]"
                            />
                        </form>
                    </div>
                </div>

                <div className="p-6">
                    {results.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {results.map((user) => (
                                <div
                                    key={user.id || user.userId}
                                    className="flex items-center justify-between"
                                >
                                    <div
                                        className="flex items-center gap-4 cursor-pointer"
                                        onClick={() =>
                                            navigate(
                                                `/friend/${user.id || user.userId}`,
                                            )
                                        }
                                    >
                                        <img
                                            src={
                                                getImageUrl(
                                                    user.profileImage,
                                                ) || DEFAULT_AVATAR
                                            }
                                            alt="u"
                                            className="w-12 h-12 rounded-xl border border-[#f3f3f3]"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src =
                                                    DEFAULT_AVATAR;
                                            }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[14px]">
                                                {user.username}
                                            </span>
                                            <span className="text-[11px] text-[#7b8b9e]">
                                                #{user.id || user.userId}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={async () => {
                                            try {
                                                await friendService.sendRequest(
                                                    user.id || user.userId,
                                                );
                                                alert(
                                                    "친구 요청을 보냈습니다.",
                                                );
                                            } catch (error) {
                                                console.error(
                                                    "친구 요청 오류:",
                                                    error,
                                                );
                                                alert(
                                                    "친구 요청에 실패하거나 이미 요청된 상태입니다.",
                                                );
                                            }
                                        }}
                                        className="px-4 py-2 bg-black text-white text-[12px] font-bold rounded-[4px]"
                                    >
                                        친구 신청
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : query ? (
                        <div className="py-20 text-center text-[#a3b0c1] text-[14px]">
                            검색 결과가 없습니다.
                        </div>
                    ) : (
                        <div className="py-20 text-center text-[#a3b0c1] text-[14px]">
                            찾고 싶은 친구의 이름을 입력하세요.
                        </div>
                    )}
                </div>
            </div>
        </ResponsiveLayout>
    );
}
