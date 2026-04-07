import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import {
    Settings,
    Grid,
    Bookmark,
    Heart,
    Award,
    Plus,
    Edit3,
    Loader2,
} from "lucide-react";
import { userService } from "@/api/userService";
import { albumService } from "@/api/albumService";
import { friendService } from "@/api/friendService";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR, getImageUrl } from "@/utils/imageUtils";
import AlbumPreviewLink from "@/components/feed/AlbumPreviewLink";

export default function ProfilePage() {
    console.log("ProfilePage 렌더링됨");
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    console.log("authUser:", authUser);

    const [user, setUser] = useState(() => {
        if (!authUser) {
            console.log("[user] authUser 없음 → null");
            return null;
        }
        const initialUser = {
            ...authUser,
            level: Math.floor((authUser.totalBadges || 0) / 5) + 1,
        };
        console.log("[user] 초기값:", initialUser);
        return initialUser;
    });

    const [posts, setPosts] = useState([]);

    const [friendCount, setFriendCount] = useState(0);

    const [activeTab, setActiveTab] = useState("POSTS");

    const [postsLoading, setPostsLoading] = useState(true);
    const getPostAuthorId = (post) =>
        String(post?.authorId ?? post?.userId ?? "");
    const getPostId = (post) => post?.albumId ?? post?.id;

    useEffect(() => {
        console.log("useEffect 실행, authUser?.id:", authUser?.id);
        if (!authUser?.id) {
            setPostsLoading(false);
            return;
        }

        const loadData = async () => {
            console.log("loadData 시작, authUser:", authUser);

            setPostsLoading(true);
            const withTimeout = (promise, name) =>
                Promise.race([
                    promise,
                    new Promise((_, reject) =>
                        setTimeout(
                            () => reject(new Error(`${name} timeout`)),
                            8000,
                        ),
                    ),
                ]);
            try {
                const [profileResult, postsResult, friendsResult] =
                    await Promise.allSettled([
                        withTimeout(userService.getMyProfile(), "profile"),
                        withTimeout(
                            albumService.getAlbumFeed({ type: "photo" }),
                            "posts",
                        ),
                        withTimeout(friendService.listFriends(), "friends"),
                    ]);

                console.log(
                    "[Profile]",
                    profileResult.status,
                    profileResult.status === "rejected"
                        ? profileResult.reason
                        : profileResult.value,
                );
                console.log(
                    "[Posts]",
                    postsResult.status,
                    postsResult.status === "rejected"
                        ? postsResult.reason
                        : postsResult.value,
                );
                console.log(
                    "[Friends]",
                    friendsResult.status,
                    friendsResult.status === "rejected"
                        ? friendsResult.reason
                        : friendsResult.value,
                );

                if (profileResult.status === "fulfilled") {
                    setUser(profileResult.value);
                }
                if (postsResult.status === "fulfilled") {
                    setPosts(
                        (postsResult.value || []).filter(
                            (post) =>
                                getPostAuthorId(post) === String(authUser.id),
                        ),
                    );
                }
                if (friendsResult.status === "fulfilled") {
                    setFriendCount(friendsResult.value.length);
                }
            } catch (error) {
                console.error("Error loading profile data:", error);
            } finally {
                setPostsLoading(false);
            }
        };
        loadData();
    }, [authUser?.id]);

    if (!user)
        return (
            <ResponsiveLayout showTabs={false}>
                <div className="p-20 text-center font-black animate-pulse text-gray-400 italic uppercase tracking-widest">
                    Loading SNAP...
                </div>
            </ResponsiveLayout>
        );

    return (
        <ResponsiveLayout showTabs={true}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="bg-white dark:bg-[#1c1f24] px-4 pt-10 pb-6 flex flex-col md:flex-row items-center gap-6 md:gap-10 border-b border-[#f3f3f3] dark:border-[#292e35]">
                    <div className="relative">
                        <img
                            src={
                                getImageUrl(
                                    user.profileImageUrl || user.profileImage,
                                ) || DEFAULT_AVATAR
                            }
                            alt="p"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-[28px] object-cover border border-[#eef1f4] shadow-sm"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = DEFAULT_AVATAR;
                            }}
                        />

                        <button
                            onClick={() => navigate("/profile/edit")}
                            className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-gray-800 transition-all"
                        >
                            <Edit3 size={16} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                                {user.username}
                            </h2>

                            <button
                                onClick={() => navigate("/settings")}
                                className="p-1 text-[#a3b0c1] hover:text-black"
                            >
                                <Settings size={20} />
                            </button>
                        </div>

                        <p className="text-[14px] font-medium text-[#7b8b9e] mb-5 leading-relaxed max-w-[400px]">
                            {user.statusMessage ||
                                user.bio ||
                                "나만의 스타일을 기록해보세요."}
                        </p>

                        <div className="flex items-center gap-10">
                            <div
                                className="flex flex-col items-center md:items-start cursor-pointer"
                                onClick={() => navigate("/friends")}
                            >
                                <span className="text-[18px] font-black italic tracking-tighter">
                                    {friendCount}
                                </span>
                                <span className="text-[11px] font-black text-[#ccd3db] uppercase tracking-widest">
                                    글벗
                                </span>
                            </div>

                            <div
                                className="flex flex-col items-center md:items-start cursor-pointer"
                                onClick={() => navigate("/profile")}
                            >
                                <span className="text-[18px] font-black italic tracking-tighter">
                                    {postsLoading ? "-" : posts.length}
                                </span>
                                <span className="text-[11px] font-black text-[#ccd3db] uppercase tracking-widest">
                                    게시글수
                                </span>
                            </div>

                            <div
                                className="flex flex-col items-center md:items-start cursor-pointer"
                                onClick={() => navigate("/badges")}
                            >
                                <span className="text-[18px] font-black italic tracking-tighter">
                                    LV.{user.level || 1}
                                </span>
                                <span className="text-[11px] font-black text-[#ccd3db] uppercase tracking-widest">
                                    Level
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col gap-3 w-[220px]">
                        <button
                            disabled
                            className="w-full h-12 bg-black text-white rounded-[4px] font-black italic tracking-widest uppercase text-[17px] opacity-40 cursor-not-allowed"
                        >
                            쪽지 (준비중)
                        </button>

                        <button
                            onClick={() => navigate("/friends")}
                            className="w-full h-12 border-2 border-black dark:border-[#e5e5e5] rounded-[4px] font-black italic tracking-widest uppercase text-[20px] hover:bg-black hover:text-white dark:hover:bg-[#e5e5e5] dark:hover:text-black transition-all"
                        >
                            글 벗
                        </button>
                    </div>
                </div>

                <div className="flex flex-col py-5 px-6 bg-[#fafafa] dark:bg-[#101215] border-b border-[#f3f3f3] dark:border-[#292e35]">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <Award size={16} className="text-yellow-500" />
                            <span className="text-[12px] font-black italic tracking-widest text-black dark:text-[#e5e5e5] uppercase">
                                Level Progress
                            </span>
                        </div>

                        <span className="text-[11px] font-black text-[#a3b0c1] uppercase tracking-widest">
                            Next: LV.{(user.level || 1) + 1}
                        </span>
                    </div>

                    <div className="w-full h-[6px] bg-[#e5e5e5] dark:bg-[#292e35] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black transition-all duration-1000 ease-out"
                            style={{
                                width: `${Math.min(((user.totalBadges || 0) % 5) * 20, 100)}%`,
                            }}
                        ></div>
                    </div>

                    <div className="mt-1.5 text-right">
                        <span className="text-[10px] font-black text-[#ccd3db] uppercase tracking-widest">
                            {user.totalBadges || 0} / {(user.level || 1) * 5}{" "}
                            Badges
                        </span>
                    </div>
                </div>

                <div className="flex border-b border-[#f3f3f3] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] sticky top-[60px] z-10 transition-all">
                    {[
                        { id: "POSTS", icon: Grid },
                        { id: "LIKES", icon: Heart },
                        { id: "SAVED", icon: Bookmark },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() =>
                                t.id === "POSTS" && setActiveTab(t.id)
                            }
                            disabled={t.id !== "POSTS"}
                            className={`flex-1 py-4 flex justify-center items-center gap-1 relative 
                                ${
                                    t.id === "POSTS"
                                        ? activeTab === t.id
                                            ? "text-black dark:text-[#e5e5e5]"
                                            : "text-[#ccd3db] hover:text-[#a3b0c1]"
                                        : "text-[#ccd3db] opacity-40 cursor-not-allowed"
                                }`}
                        >
                            <t.icon
                                size={22}
                                className={
                                    activeTab === t.id
                                        ? "stroke-[2.5px]"
                                        : "stroke-[1.5px]"
                                }
                            />
                            {t.id !== "POSTS" && (
                                <span className="text-[9px] font-black tracking-widest uppercase">
                                    준비중
                                </span>
                            )}
                            {activeTab === t.id && t.id === "POSTS" && (
                                <div className="absolute bottom-0 left-[20%] right-[20%] h-[2.5px] bg-black dark:bg-[#e5e5e5]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap p-0.5 bg-white dark:bg-[#101215]">
                    {postsLoading ? (
                        <div className="w-full py-20 flex items-center justify-center text-[#ccd3db]">
                            <Loader2 size={28} className="animate-spin" />
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post, i) => (
                            <AlbumPreviewLink
                                key={getPostId(post)}
                                album={post}
                                to={`/snap/${getPostId(post)}`}
                                containerClassName="w-1/3 p-0.5"
                                linkClassName="group block"
                                mediaClassName="aspect-[3/4]"
                                imageClassName="transition-transform duration-500 group-hover:scale-105"
                                preferThumb={true}
                            >
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all pointer-events-none"></div>
                            </AlbumPreviewLink>
                        ))
                    ) : (
                        <div className="w-full py-32 flex flex-col items-center justify-center text-[#ccd3db]">
                            <Plus size={48} className="mb-4 opacity-20" />
                            <p className="text-[13px] font-black italic tracking-widest uppercase opacity-40">
                                No Snap Yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ResponsiveLayout>
    );
}
