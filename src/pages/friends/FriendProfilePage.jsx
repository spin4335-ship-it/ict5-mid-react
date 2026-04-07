import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Grid, Loader2, Plus } from "lucide-react";
import { userService } from "@/api/userService";
import { friendService } from "@/api/friendService";
import apiClient from "@/api/apiClient";
import { DEFAULT_AVATAR, getImageUrl } from "@/utils/imageUtils";
import { useAlert } from "@/context/AlertContext";
import AlbumPreviewLink from "@/components/feed/AlbumPreviewLink";

export default function FriendProfilePage() {
    const { friendId } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [userPosts, setUserPosts] = useState([]);

    const [postsLoading, setPostsLoading] = useState(true);

    const [isRequesting, setIsRequesting] = useState(false);
    const getPostAuthorId = (post) =>
        String(post?.authorId ?? post?.userId ?? "");
    const getPostId = (post) => post?.albumId ?? post?.id;

    const [requestStatus, setRequestStatus] = useState("none");

    const [friendshipId, setFriendshipId] = useState(null);

    useEffect(() => {
        if (!friendId) return;

        setIsLoading(true);
        setPostsLoading(true);

        userService
            .getUserProfile(friendId)
            .then((data) => setUser(data))
            .catch(() =>
                setUser({
                    id: friendId,
                    username: `User ${friendId}`,
                    profileImageUrl: null,
                    totalBadges: 0,
                    friendCount: 0,
                }),
            )
            .finally(() => setIsLoading(false));

        apiClient
            .get("/albums/feed", { params: { type: "photo" } })
            .then((response) => {
                const filtered = (response.data || []).filter(
                    (post) => getPostAuthorId(post) === String(friendId),
                );
                setUserPosts(filtered);
            })
            .catch(() => setUserPosts([]))
            .finally(() => setPostsLoading(false));

        friendService
            .listFriends()
            .then((friends) => {
                const matched = (friends || []).find(
                    (f) => String(f.userId || f.id) === String(friendId),
                );
                if (matched) {
                    setRequestStatus("accepted");
                    setFriendshipId(matched.friendshipId);
                } else {
                    setRequestStatus("none");
                }
            })
            .catch(() => {});
    }, [friendId]);

    const handleFriendAction = async () => {
        setIsRequesting(true);
        try {
            if (requestStatus === "accepted") {
                await friendService.removeFriend(friendshipId);
                setRequestStatus("none");
                setFriendshipId(null);
                showAlert(
                    "글벗 관계가 해제되었습니다.",
                    "해제 성공",
                    "success",
                );
            } else if (requestStatus === "none") {
                await friendService.sendRequest(friendId);

                setRequestStatus("pending");
                showAlert("글벗 요청을 보냈습니다.", "요청 성공", "success");
            }
        } catch (error) {
            console.error("친구 요청 오류:", error);

            const errorData = error.response?.data;
            const errorMessage =
                typeof errorData === "string"
                    ? errorData
                    : errorData?.message || "";

            if (
                errorMessage &&
                errorMessage.includes("이미 친구이거나 요청이 진행 중")
            ) {
                showAlert(
                    errorMessage || "이미 처리된 요청입니다.",
                    "알림",
                    "info",
                );
                setRequestStatus("pending");
            } else {
                showAlert(
                    "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                    "오류",
                    "alert",
                );
            }
        } finally {
            setIsRequesting(false);
        }
    };

    if (isLoading)
        return (
            <ResponsiveLayout showTabs={false}>
                <div className="p-20 text-center font-bold animate-pulse text-gray-400 italic uppercase tracking-widest">
                    Loading Profile...
                </div>
            </ResponsiveLayout>
        );

    if (!user)
        return (
            <ResponsiveLayout showTabs={false}>
                <div className="p-20 text-center">
                    <p className="text-gray-500 font-bold mb-4">
                        사용자를 찾을 수 없습니다.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-black text-white rounded-full font-bold text-sm"
                    >
                        돌아가기
                    </button>
                </div>
            </ResponsiveLayout>
        );

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center h-14 px-4 sticky top-0 bg-white dark:bg-[#1c1f24] z-10 border-b border-[#e5e5e5] dark:border-[#292e35]">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="flex-1 text-center font-bold text-[16px] mr-8">
                        {user.username}
                    </h1>
                </div>

                <div className="px-6 py-8 flex flex-col items-center">
                    <img
                        src={
                            getImageUrl(user.profileImageUrl) || DEFAULT_AVATAR
                        }
                        alt="p"
                        className="w-24 h-24 rounded-[28px] object-cover shadow-sm border border-[#f3f3f3] mb-4"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                    />

                    <h2 className="text-[18px] font-bold mb-1">
                        {user.username}
                    </h2>
                    <p className="text-[13px] text-[#7b8b9e] mb-6">
                        #{user.id}
                    </p>

                    <div className="flex w-full gap-2 mb-8">
                        <button
                            onClick={handleFriendAction}
                            disabled={
                                isRequesting || requestStatus === "pending"
                            }
                            className={`flex-1 h-10 rounded-[4px] font-bold text-[13px] flex items-center justify-center gap-1 transition-colors ${
                                requestStatus === "pending"
                                    ? "bg-gray-200 text-gray-500 border border-gray-300"
                                    : requestStatus === "accepted"
                                      ? "bg-white text-black border border-[#e5e5e5] hover:bg-gray-50"
                                      : "bg-black text-white hover:bg-gray-800"
                            }`}
                        >
                            {isRequesting ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : null}
                            {requestStatus === "pending"
                                ? "요청 대기중"
                                : requestStatus === "accepted"
                                  ? "글벗 해제"
                                  : "글벗 요청"}
                        </button>

                        <button className="flex-1 h-10 border border-[#e5e5e5] dark:border-[#292e35] rounded-[4px] font-bold text-[13px] text-[#a3b0c1] cursor-not-allowed">
                            메시지(준비중)
                        </button>
                    </div>

                    <div className="flex w-full justify-around py-4 border-y border-[#f3f3f3] dark:border-[#292e35] mb-4">
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-[14px]">
                                {postsLoading ? "-" : userPosts.length}
                            </span>
                            <span className="text-[11px] text-[#a3b0c1]">
                                게시물
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-[14px] font-mono">
                                {user.friendCount || 0}
                            </span>
                            <span className="text-[11px] text-[#a3b0c1]">
                                글벗
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-[14px] font-mono">
                                {user.totalBadges || 0}
                            </span>
                            <span className="text-[11px] text-[#a3b0c1]">
                                달개
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col w-full py-4 px-2 bg-[#fafafa] dark:bg-[#1c1f24] rounded-[12px] border border-[#f3f3f3] dark:border-[#292e35]">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[14px]">🔥</span>

                                <span className="text-[11px] font-black italic tracking-widest text-black dark:text-[#e5e5e5] uppercase">
                                    LV.
                                    {Math.floor((user.totalBadges || 0) / 5) +
                                        1}{" "}
                                    Progress
                                </span>
                            </div>

                            <span className="text-[10px] font-bold text-[#a3b0c1] uppercase">
                                Next: LV.
                                {Math.floor((user.totalBadges || 0) / 5) + 2}
                            </span>
                        </div>

                        <div className="w-full h-[6px] bg-[#e5e5e5] dark:bg-[#292e35] rounded-full overflow-hidden mb-1.5">
                            <div
                                className="h-full bg-black transition-all duration-1000 ease-out"
                                style={{
                                    width: `${Math.min(((user.totalBadges || 0) % 5) * 20, 100)}%`,
                                }}
                            ></div>
                        </div>

                        <div className="text-right px-1">
                            <span className="text-[9px] font-bold text-[#ccd3db] uppercase tracking-widest">
                                {user.totalBadges || 0} /{" "}
                                {(Math.floor((user.totalBadges || 0) / 5) + 1) *
                                    5}{" "}
                                Badges
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-[#f3f3f3] dark:border-[#292e35]">
                    <div className="flex-1 py-3 flex justify-center text-black dark:text-[#e5e5e5] border-b-2 border-black dark:border-[#e5e5e5]">
                        <Grid size={20} />
                    </div>
                </div>

                <div className="flex flex-wrap p-0.5">
                    {postsLoading ? (
                        <div className="w-full py-20 flex items-center justify-center text-[#ccd3db] text-sm animate-pulse">
                            Loading...
                        </div>
                    ) : userPosts.length > 0 ? (
                        userPosts.map((post) => (
                            <AlbumPreviewLink
                                key={getPostId(post)}
                                album={post}
                                to={`/snap/${getPostId(post)}`}
                                containerClassName="w-1/3 p-0.5"
                                linkClassName="group block"
                                mediaClassName="aspect-[3/4]"
                                imageClassName="transition-transform duration-500 group-hover:scale-105"
                                preferThumb={true}
                            />
                        ))
                    ) : (
                        <div className="w-full py-24 flex flex-col items-center justify-center text-[#ccd3db]">
                            <Plus size={40} className="mb-3 opacity-20" />
                            <p className="text-[12px] font-black italic tracking-widest uppercase opacity-40">
                                No Snap Yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ResponsiveLayout>
    );
}
