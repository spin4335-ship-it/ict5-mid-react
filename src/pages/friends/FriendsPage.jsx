import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { UserMinus, Search, Users, ShieldCheck, Mail } from "lucide-react";
import { friendService } from "@/api/friendService";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR, getImageUrl } from "@/utils/imageUtils";

export default function FriendsPage() {
    const navigate = useNavigate();
    const { showAlert, showConfirm } = useAlert();
    const { triggerNotiRefresh } = useAuth();

    const [friends, setFriends] = useState([]);

    const [pending, setPending] = useState([]);

    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("LIST");

    const [searchQuery, setSearchQuery] = useState("");

    const [searchResults, setSearchResults] = useState([]);

    const [isSearching, setIsSearching] = useState(false);
    const { user, triggerNotiRefresh: refreshNotifications } = useAuth();

    const fetchAllData = async () => {
        try {
            const [friendsData, receiveData, sentData] = await Promise.all([
                friendService.listFriends(),
                friendService.listPendingRequests(),
                friendService.listSentPendingRequests(),
            ]);
            setFriends(friendsData || []);
            setReceivedRequests(receiveData || []);
            setSentRequests(sentData || []);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    };
    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        const trimmed = searchQuery.trim();
        if (!trimmed) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await friendService.searchUsers(trimmed);
                setSearchResults(results || []);
            } catch (error) {
                console.error("검색 실패:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleRemoveFriend = (friendshipId) => {
        showConfirm({
            message: "정말로 이 글벗을 삭제하시겠습니까?",
            onConfirm: async () => {
                try {
                    await friendService.removeFriend(friendshipId);

                    setFriends((prev) =>
                        prev.filter((f) => f.friendshipId !== friendshipId),
                    );

                    showAlert("글벗이 삭제되었습니다.", "완료", "success");

                    triggerNotiRefresh();
                } catch (error) {
                    console.error("삭제 오류:", error);
                    showAlert("삭제에 실패했습니다.", "오류", "alert");
                }
            },
        });
    };

    const handleCancelSentRequest = async (friendshipId) => {
        showConfirm({
            message: "보낸 요청을 취소하시겠습니까?",
            onConfirm: async () => {
                try {
                    await friendService.removeFriend(friendshipId);
                    setSentRequests((prev) =>
                        prev.filter((req) => req.friendshipId !== friendshipId),
                    );

                    triggerNotiRefresh();
                    showAlert("요청이 취소되었습니다.", "완료", "success");
                } catch (error) {
                    showAlert("취소 중 오류가 발생했습니다.", "오류", "alert");
                }
            },
        });
    };

    const handleAcceptRequest = async (friendshipId) => {
        const acceptedRequest = receivedRequests.find(
            (req) => req.friendshipId === friendshipId,
        );

        if (!acceptedRequest) {
            showAlert("해당 요청을 찾을 수 없습니다.", "오류", "alert");
            return;
        }
        try {
            await friendService.acceptRequest(friendshipId);

            refreshNotifications();

            setReceivedRequests((prev) =>
                prev.filter((req) => req.friendshipId !== friendshipId),
            );

            setFriends((prev) => [...prev, acceptedRequest]);

            showAlert(
                `${acceptedRequest.username || "사용자"}님과 글벗이 되었습니다!`,
                "완료",
                "success",
            );
        } catch (error) {
            console.error("요청 수락 오류:", error);
            showAlert("요청 승인 중 오류가 발생했습니다.", "오류", "alert");
        }
    };

    const handleDeclineRequest = async (friendshipId) => {
        showConfirm({
            message: "받은 요청을 거절하시겠습니까?",
            onConfirm: async () => {
                try {
                    await friendService.rejectRequest(friendshipId);

                    setReceivedRequests((prev) =>
                        prev.filter((req) => req.friendshipId !== friendshipId),
                    );

                    triggerNotiRefresh();
                } catch (error) {
                    console.error("요청 거절 중 오류 발생:", error);
                }
            },
        });
    };

    return (
        <ResponsiveLayout showTabs={true}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="px-6 py-10 flex flex-col items-center border-b border-[#f3f3f3] dark:border-[#292e35] bg-[#fafafa] dark:bg-[#1c1f24]">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl transform -rotate-3 hover:rotate-0 transition-all">
                        <Users size={32} />
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                        나의 글벗들
                    </h2>
                    <p className="text-[14px] text-[#a3b0c1] font-bold tracking-widest uppercase">
                        나의 스토리를 공유할 글벗들을 찾아보세요
                    </p>
                </div>

                <div className="px-4 py-6 flex flex-col gap-3 sticky top-[110px] bg-white dark:bg-[#1c1f24] z-10 border-b border-[#f3f3f3] dark:border-[#292e35]">
                    <div className="flex gap-3">
                        <div className="relative flex-1 group">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ccd3db] group-hover:text-black transition-colors"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="글벗 찾기"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-[#f3f3f3] dark:bg-[#292e35] rounded-[8px] text-[13px] font-black italic tracking-widest outline-none focus:ring-1 focus:ring-black transition-all"
                            />
                        </div>
                    </div>

                    {searchQuery && searchResults.length > 0 && (
                        <div className="bg-white dark:bg-[#1c1f24] border border-[#f3f3f3] dark:border-[#292e35] rounded-xl shadow-2xl mt-1 overflow-hidden">
                            {searchResults.map((user) => (
                                <div
                                    key={user.userId}
                                    onClick={() =>
                                        navigate(`/friend/${user.userId}`)
                                    }
                                    className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
                                >
                                    <img
                                        src={
                                            getImageUrl(user.profileImageUrl) ||
                                            DEFAULT_AVATAR
                                        }
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold">
                                            {user.username}
                                        </span>
                                        <span className="text-[11px] text-[#7b8b9e]">
                                            #{user.userId}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex px-4 bg-white dark:bg-[#1c1f24] sticky top-[154px] z-10 border-b border-[#f3f3f3] dark:border-[#292e35]">
                    {[
                        {
                            id: "LIST",
                            label: "모든 글벗들",
                            count: friends.length,
                        },
                        {
                            id: "받은 요청",
                            label: "글벗 요청 현황",
                            count:
                                receivedRequests.length + sentRequests.length,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-4 text-[12px] font-black tracking-[1px] relative transition-colors ${activeTab === tab.id ? "text-black" : "text-[#ccd3db]"}`}
                        >
                            {tab.label}{" "}
                            <span className="ml-1 opacity-50">
                                [{tab.count}]
                            </span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col flex-1">
                    {activeTab === "LIST" ? (
                        friends.length > 0 ? (
                            friends.map((friend) => (
                                <div
                                    key={friend.friendshipId}
                                    className="flex items-center justify-between px-6 py-5 group hover:bg-[#fafafa] cursor-pointer"
                                    onClick={() =>
                                        navigate(`/friend/${friend.userId}`)
                                    }
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <img
                                                src={
                                                    getImageUrl(
                                                        friend.profileImageUrl,
                                                    ) || DEFAULT_AVATAR
                                                }
                                                className="w-14 h-14 rounded-2xl object-cover"
                                            />
                                            {friend.isCertified && (
                                                <div className="absolute -bottom-1 -right-1 bg-black text-[#e5e5e5] rounded-full p-1 border-2 border-white">
                                                    <ShieldCheck size={10} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black italic text-[16px] tracking-tighter uppercase">
                                                {friend.username}
                                            </span>
                                            <span className="text-[13px] text-[#7b8b9e] font-bold">
                                                #{friend.userId}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFriend(
                                                friend.friendshipId,
                                            );
                                        }}
                                        className="w-10 h-10 text-[#ccd3db] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <UserMinus size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-32 opacity-20">
                                <Users size={64} className="mb-4" />
                                <p>글벗이 없어요</p>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col divide-y divide-[#f3f3f3]">
                            <div className="bg-[#fafafa] dark:bg-[#1c1f24] px-6 py-3">
                                <span className="text-[11px] font-black text-[#a3b0c1] uppercase tracking-widest">
                                    받은 요청 ({receivedRequests.length})
                                </span>
                            </div>
                            {receivedRequests.length > 0 ? (
                                receivedRequests.map((req) => (
                                    <div
                                        key={req.friendshipId}
                                        className="flex items-center justify-between px-6 py-6 bg-white dark:bg-[#101215]"
                                    >
                                        <div
                                            className="flex items-center gap-5 cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/friend/${req.userId}`,
                                                )
                                            }
                                        >
                                            <img
                                                src={
                                                    getImageUrl(
                                                        req.profileImageUrl,
                                                    ) || DEFAULT_AVATAR
                                                }
                                                className="w-12 h-12 rounded-2xl object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-black italic text-[15px] tracking-tighter uppercase">
                                                    {req.username}
                                                </span>
                                                <span className="text-[11px] text-[#a3b0c1]">
                                                    받은 요청...
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleAcceptRequest(
                                                        req.friendshipId,
                                                    )
                                                }
                                                className="h-9 px-4 bg-black text-white text-[11px] font-black rounded"
                                            >
                                                수락
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeclineRequest(
                                                        req.friendshipId,
                                                    )
                                                }
                                                className="h-9 px-4 border border-[#e5e5e5] text-[11px] font-black rounded"
                                            >
                                                거절
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center text-[#ccd3db] text-[12px] italic">
                                    받은 요청이 없어요...
                                </div>
                            )}

                            <div className="bg-[#fafafa] dark:bg-[#1c1f24] px-6 py-3 border-t">
                                <span className="text-[11px] font-black text-[#a3b0c1] uppercase tracking-widest">
                                    보낸 요청 ({sentRequests.length})
                                </span>
                            </div>
                            {sentRequests.length > 0 ? (
                                sentRequests.map((req) => (
                                    <div
                                        key={req.friendshipId}
                                        className="flex items-center justify-between px-6 py-6 bg-white dark:bg-[#101215]"
                                    >
                                        <div
                                            className="flex items-center gap-5 cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/friend/${req.userId}`,
                                                )
                                            }
                                        >
                                            <img
                                                src={
                                                    getImageUrl(
                                                        req.profileImageUrl,
                                                    ) || DEFAULT_AVATAR
                                                }
                                                className="w-12 h-12 rounded-2xl object-cover opacity-60"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-black italic text-[15px] tracking-tighter uppercase text-[#a3b0c1]">
                                                    {req.username}
                                                </span>
                                                <span className="text-[11px] text-[#ccd3db]">
                                                    수락을 기다리는 중...
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleCancelSentRequest(
                                                    req.friendshipId,
                                                )
                                            }
                                            className="h-9 px-4 border border-red-100 text-red-400 text-[11px] font-black rounded hover:bg-red-50 transition-colors"
                                        >
                                            취소
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center text-[#ccd3db] text-[12px] italic">
                                    보낸 요청이 없습니다
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-10 text-center bg-[#fafafa] dark:bg-[#1c1f24]">
                    <p className="text-[11px] font-bold text-[#ccd3db] tracking-[2px] uppercase">
                        내 스토리를 공유하는 새로운 문화
                    </p>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
