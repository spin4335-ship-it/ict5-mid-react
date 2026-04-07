import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import {
    MoreHorizontal,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Award,
    Plus,
    Edit2,
    Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { albumService } from "@/api/albumService";
import { userService } from "@/api/userService";
import { badgeService } from "@/api/badgeService";
import { friendService } from "@/api/friendService";
import {
    DEFAULT_AVATAR,
    DEFAULT_POST_IMAGE,
    getImageUrl,
} from "@/utils/imageUtils";
import AlbumPhotoLayout, {
    sortAlbumPhotos,
} from "@/components/feed/AlbumPhotoLayout";
import { getSavedAlbumLayout } from "@/utils/albumLayoutStore";

export default function SnapDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const { showAlert, showConfirm } = useAlert();

    console.log("[SnapDetailPage] route id =", id);
    console.log("[SnapDetailPage] authUser =", authUser);

    const [rawSnap, setRawSnap] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgIndex, setImgIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    const [badgeTypes, setBadgeTypes] = useState([]);
    const [badges, setBadges] = useState([]);
    const [myBadges, setMyBadges] = useState([]);
    const [togglingBadge, setTogglingBadge] = useState(null);

    const [friendStatus, setFriendStatus] = useState("none");
    const [isRequesting, setIsRequesting] = useState(false);

    console.log("[SnapDetailPage] rawSnap =", rawSnap);
    console.log("[SnapDetailPage] isLoading =", isLoading);
    console.log("[SnapDetailPage] error =", error);
    console.log("[SnapDetailPage] showMenu =", showMenu);
    console.log("[SnapDetailPage] badgeTypes =", badgeTypes);
    console.log("[SnapDetailPage] badges =", badges);
    console.log("[SnapDetailPage] myBadges =", myBadges);
    console.log("[SnapDetailPage] togglingBadge =", togglingBadge);
    console.log("[SnapDetailPage] friendStatus =", friendStatus);
    console.log("[SnapDetailPage] isRequesting =", isRequesting);

    useEffect(() => {
        console.log("[useEffect #1] 스냅 상세 조회 시작, id =", id);

        setIsLoading(true);
        setError(null);
        setImgIndex(0);
        albumService
            .getAlbumDetail(id)
            .then(async (res) => {
                console.log(
                    "[useEffect #1] albumService.getAlbumDetail 성공, res =",
                    res,
                );
                setError(null);

                if (res?.userId && !res.profileImageUrl) {
                    try {
                        const userProfile = await userService.getUserProfile(
                            res.userId,
                        );
                        res.profileImageUrl =
                            userProfile.profileImageUrl ?? null;
                    } catch (e) {
                        console.log(
                            "[useEffect #1] 프로필 이미지 조회 실패",
                            e,
                        );
                    }
                }
                setRawSnap(res);
            })
            .catch((err) => {
                console.log(
                    "[useEffect #1] albumService.getAlbumDetail 실패, err =",
                    err,
                );
                setError(err);
            })
            .finally(() => {
                console.log("[useEffect #1] 스냅 상세 조회 종료");
                setIsLoading(false);
            });
    }, [id]);

    useEffect(() => {
        console.log("[useEffect #2] 달개 유형 목록 조회 시작");

        badgeService
            .getAllTypes()
            .then((res) => {
                console.log("[useEffect #2] getAllTypes 성공, res =", res);
                setBadgeTypes(res);
            })
            .catch((err) => {
                console.log("[useEffect #2] getAllTypes 실패, err =", err);
                setBadgeTypes([]);
            });
    }, []);

    useEffect(() => {
        if (!rawSnap) return;

        console.log("[useEffect #3] rawSnap 로드됨, rawSnap =", rawSnap);
        console.log(
            "[useEffect #3] rawSnap.badges 초기 세팅 =",
            rawSnap.badges,
        );

        setBadges(rawSnap.badges || []);

        console.log("[useEffect #3] getAlbumDalgae 호출, id =", id);

        badgeService
            .getAlbumDalgae(id)
            .then((res) => {
                console.log("[useEffect #3] getAlbumDalgae 성공, res =", res);
                setBadges(res.badges || []);
                setMyBadges(res.myBadges || []);
            })
            .catch((err) => {
                console.log("[useEffect #3] getAlbumDalgae 실패, err =", err);
            });
    }, [rawSnap, id]);

    useEffect(() => {
        if (!rawSnap || !authUser?.id) return;
        const authorId = rawSnap.userId;
        if (authUser.id === authorId) return;

        console.log("[useEffect #4] 친구 관계 확인 시작");
        console.log("[useEffect #4] authorId =", authorId);
        console.log("[useEffect #4] rawSnap.username =", rawSnap.username);

        const checkFriendship = async () => {
            try {
                const friends = await friendService.listFriends();
                console.log("[useEffect #4] listFriends 결과 =", friends);

                const isFriend =
                    Array.isArray(friends) &&
                    friends.some(
                        (f) => String(f.friendId) === String(authorId),
                    );
                console.log("[useEffect #4] isFriend =", isFriend);

                if (isFriend) {
                    console.log("[useEffect #4] 이미 글벗 상태");
                    setFriendStatus("accepted");
                    return;
                }

                const results = await friendService.searchUsers(
                    rawSnap.username,
                );
                console.log("[useEffect #4] searchUsers 결과 =", results);

                const target =
                    Array.isArray(results) &&
                    results.find((u) => String(u.userId) === String(authorId));
                console.log("[useEffect #4] target 사용자 =", target);

                if (target?.isPending) {
                    console.log("[useEffect #4] 친구 요청 대기중 상태");
                    setFriendStatus("pending");
                } else if (target?.isFriend) {
                    console.log("[useEffect #4] 친구 수락 상태");
                    setFriendStatus("accepted");
                } else {
                    console.log("[useEffect #4] 친구 아님");
                    setFriendStatus("none");
                }
            } catch (err) {
                console.log("[useEffect #4] 친구 관계 확인 실패, err =", err);
                setFriendStatus("none");
            }
        };
        checkFriendship();
    }, [rawSnap, authUser?.id]);

    const handleFriendRequest = async () => {
        console.log("[handleFriendRequest] 호출");
        console.log("[handleFriendRequest] isRequesting =", isRequesting);
        console.log("[handleFriendRequest] friendStatus =", friendStatus);
        console.log("[handleFriendRequest] rawSnap.userId =", rawSnap?.userId);

        if (isRequesting || friendStatus !== "none") return;
        setIsRequesting(true);
        try {
            await friendService.sendRequest(rawSnap.userId);
            console.log("[handleFriendRequest] sendRequest 성공");
            setFriendStatus("pending");
            showAlert("글벗 요청을 보냈습니다.", "완료", "success");
        } catch (e) {
            console.log("[handleFriendRequest] sendRequest 실패, e =", e);
            if (e?.response?.status === 409) {
                showAlert("이미 요청했거나 글벗입니다.", "알림", "alert");
                setFriendStatus("pending");
            } else {
                showAlert("글벗 요청에 실패했습니다.", "알림", "alert");
            }
        } finally {
            console.log("[handleFriendRequest] 요청 종료");
            setIsRequesting(false);
        }
    };

    const savedLayoutType = getSavedAlbumLayout(id);

    const snap = rawSnap
        ? {
              ...rawSnap,
              layoutType: savedLayoutType ?? rawSnap.layoutType,
              photos: sortAlbumPhotos(rawSnap.photos || []),
              images: sortAlbumPhotos(rawSnap.photos || []).map((photo) =>
                  getImageUrl(photo.photoUrl || photo.thumbUrl),
              ),
              user: {
                  id: rawSnap.userId,
                  userId: rawSnap.userId,
                  username: rawSnap.username,
                  profileImage: getImageUrl(rawSnap.profileImageUrl) ?? null,
                  info: rawSnap.recordDate ?? "",
              },
              description: rawSnap.bodyText ?? "",
          }
        : null;

    console.log("[SnapDetailPage] 파생 snap =", snap);

    const handleGiveBadge = useCallback(
        async (badgeTypeId) => {
            console.log("[handleGiveBadge] 클릭된 badgeTypeId =", badgeTypeId);
            console.log(
                "[handleGiveBadge] 현재 togglingBadge =",
                togglingBadge,
            );
            console.log("[handleGiveBadge] 현재 id =", id);

            if (togglingBadge === badgeTypeId) {
                console.log(
                    "[handleGiveBadge] 이미 해당 달개 토글 중이라 return",
                );
                return;
            }
            setTogglingBadge(badgeTypeId);
            console.log("[handleGiveBadge] togglingBadge 세팅 =", badgeTypeId);
            try {
                const result = await badgeService.toggleAlbumDalgae(
                    id,
                    badgeTypeId,
                );
                console.log(
                    "[handleGiveBadge] toggleAlbumDalgae 성공, result =",
                    result,
                );

                setBadges(result.badges || []);
                setMyBadges(result.myBadges || []);
            } catch (e) {
                console.log("[handleGiveBadge] toggleAlbumDalgae 실패, e =", e);
                showAlert("달개 전달에 실패했습니다.", "알림", "alert");
            } finally {
                console.log(
                    "[handleGiveBadge] 토글 종료, togglingBadge 초기화",
                );
                setTogglingBadge(null);
            }
        },
        [id, togglingBadge, showAlert],
    );

    const handleDelete = () => {
        console.log("[handleDelete] 삭제 버튼 클릭, id =", id);
        showConfirm({
            message:
                "정말로 이 게시글을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.",
            title: "게시글 삭제",
            type: "alert",
            confirmText: "삭제",
            cancelText: "취소",
            onConfirm: async () => {
                try {
                    await albumService.deleteAlbum(id);
                    console.log("[handleDelete] deletePost 성공");
                    showAlert("게시글이 삭제되었습니다.", "완료", "success");
                    navigate("/");
                } catch (e) {
                    console.log("[handleDelete] deletePost 실패, e =", e);
                    showAlert("게시글 삭제에 실패했습니다.", "오류", "alert");
                }
            },
        });
    };

    if (isLoading)
        return (
            <ResponsiveLayout showTabs={false}>
                <div className="p-20 text-center font-bold italic opacity-20 animate-pulse uppercase tracking-widest">
                    Loading Snap...
                </div>
            </ResponsiveLayout>
        );

    if (error || !snap)
        return (
            <ResponsiveLayout showTabs={false}>
                <div className="p-20 text-center">
                    <p className="text-[#a3b0c1] font-black italic tracking-widest uppercase mb-4">
                        해당 스토리를 찾지 못했습니다.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="h-10 px-6 bg-black text-white rounded-full text-[12px] font-black italic tracking-widest uppercase"
                    >
                        이전 페이지로....
                    </button>
                </div>
            </ResponsiveLayout>
        );

    const isAuthor = String(authUser?.id) === String(snap?.user?.id);

    const totalBadges = badges.reduce(
        (acc, curr) => acc + (curr.count || 0),
        0,
    );

    console.log("[SnapDetailPage] isAuthor =", isAuthor);
    console.log("[SnapDetailPage] totalBadges =", totalBadges);

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="bg-white dark:bg-[#101215] min-h-screen">
                <div className="flex justify-between items-center px-4 py-4 sticky top-[60px] bg-white dark:bg-[#1c1f24] z-20 border-b border-[#f3f3f3] dark:border-[#292e35]">
                    <Link
                        to={`/friend/${snap?.user?.id || snap?.user?.userId}`}
                        className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#f3f3f3]">
                            <img
                                src={
                                    getImageUrl(snap?.user?.profileImage) ||
                                    DEFAULT_AVATAR
                                }
                                alt="u"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = DEFAULT_AVATAR;
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black italic tracking-tighter text-[15px] uppercase">
                                {snap?.user?.username}
                            </span>
                            <span className="text-[11px] font-bold text-[#a3b0c1] uppercase tracking-widest">
                                {snap?.user?.info}
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        {isAuthor ? (
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        console.log(
                                            "[UI] 더보기 메뉴 클릭, 현재 showMenu =",
                                            showMenu,
                                        );
                                        setShowMenu(!showMenu);
                                    }}
                                    className="p-2 text-[#ccd3db] h-8 w-8 flex items-center justify-center bg-[#f3f3f3] rounded-full hover:text-black transition-colors"
                                >
                                    <MoreHorizontal size={20} />
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#1c1f24] border border-[#f3f3f3] dark:border-[#292e35] shadow-xl rounded-lg z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <button
                                            onClick={() => {
                                                console.log(
                                                    "[UI] EDIT 클릭, 이동 경로 =",
                                                    `/snap/${id}/edit`,
                                                );
                                                navigate(`/snap/${id}/edit`);
                                            }}
                                            className="w-full px-4 py-3 text-[13px] font-bold flex items-center gap-2 hover:bg-[#fafafa] dark:hover:bg-[#292e35]"
                                        >
                                            <Edit2 size={14} /> 수정
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full px-4 py-3 text-[13px] font-bold flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 size={14} /> 삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : friendStatus === "accepted" ? (
                            <button
                                disabled
                                className="h-8 px-4 bg-gray-200 text-gray-600 rounded-full text-[12px] font-black italic tracking-widest uppercase flex items-center gap-1 cursor-default"
                            >
                                글벗
                            </button>
                        ) : friendStatus === "pending" ? (
                            <button
                                disabled
                                className="h-8 px-4 bg-gray-400 text-white rounded-full text-[12px] font-black italic tracking-widest uppercase flex items-center gap-1 opacity-60 cursor-not-allowed"
                            >
                                요청 대기중
                            </button>
                        ) : (
                            <button
                                onClick={handleFriendRequest}
                                disabled={isRequesting}
                                className="h-8 px-4 bg-black text-white rounded-full text-[12px] font-black italic tracking-widest uppercase flex items-center gap-1 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Plus size={12} /> ADD글벗
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-[#f9f9f9] dark:bg-[#101215] p-3 md:p-4">
                    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-[#1c1f24] shadow-sm">
                        <div className="aspect-[4/5] md:aspect-[16/10]">
                            <AlbumPhotoLayout
                                photos={snap.photos}
                                layoutType={snap.layoutType}
                                fallbackImageUrl={DEFAULT_POST_IMAGE}
                                imageClassName="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {false && (
                    <>
                        <div
                            className="relative w-full bg-[#f9f9f9] dark:bg-[#101215]"
                            style={{ height: "60vh" }}
                        >
                            <img
                                src={
                                    snap.images[imgIndex] || DEFAULT_POST_IMAGE
                                }
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = DEFAULT_POST_IMAGE;
                                }}
                            />
                            {snap.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => {
                                            console.log(
                                                "[UI] 이전 이미지 클릭, 현재 imgIndex =",
                                                imgIndex,
                                            );
                                            setImgIndex((i) =>
                                                Math.max(0, i - 1),
                                            );
                                        }}
                                        disabled={imgIndex === 0}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log(
                                                "[UI] 다음 이미지 클릭, 현재 imgIndex =",
                                                imgIndex,
                                            );
                                            setImgIndex((i) =>
                                                Math.min(
                                                    snap.images.length - 1,
                                                    i + 1,
                                                ),
                                            );
                                        }}
                                        disabled={
                                            imgIndex === snap.images.length - 1
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                    <div className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-black italic tracking-widest uppercase">
                                        {imgIndex + 1} / {snap.images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
                <div className="flex overflow-x-auto gap-4 px-4 py-6 scrollbar-hide border-b border-[#f3f3f3] dark:border-[#292e35]">
                    {snap?.products?.map((p) => (
                        <div
                            key={p.id}
                            className="shrink-0 w-[260px] flex gap-4 bg-[#fafafa] dark:bg-[#1c1f24] p-3 rounded-xl border border-[#f3f3f3] dark:border-[#292e35] relative group cursor-pointer hover:border-black dark:hover:border-[#e5e5e5] transition-all"
                        >
                            <img
                                src={p.image}
                                className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex flex-col justify-center">
                                <span className="text-[11px] font-black italic tracking-widest uppercase text-black">
                                    {p.brand}
                                </span>
                                <span className="text-[13px] font-medium text-[#424a54] line-clamp-1">
                                    {p.name}
                                </span>
                                <span className="text-[14px] font-black italic tracking-tighter mt-1 text-black">
                                    BUY NOW
                                </span>
                            </div>
                            <ChevronDown
                                size={14}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccd3db]"
                            />
                        </div>
                    ))}
                </div>

                <div className="p-6">
                    <p className="text-[15px] leading-relaxed mb-6 font-medium text-[#424a54]">
                        {snap?.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-10">
                        {snap?.tags?.map((t) => (
                            <span
                                key={t}
                                className="text-[#0078ff] text-[15px] font-bold"
                            >
                                #{t}
                            </span>
                        ))}
                    </div>

                    <div className="bg-[#fafafa] dark:bg-[#1c1f24] rounded-2xl p-6 border border-[#f3f3f3] dark:border-[#292e35]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Award
                                    className="text-black dark:text-white"
                                    size={20}
                                />
                                <h3 className="text-[15px] font-black italic tracking-widest uppercase">
                                    달개 부여하기
                                </h3>
                            </div>
                            <span className="text-[13px] font-black italic tracking-tighter text-black dark:text-white">
                                총계 {totalBadges}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-8">
                            {badges.length > 0 ? (
                                badges.map((b) => (
                                    <div
                                        key={b.emoji}
                                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#292e35] rounded-lg border border-[#f3f3f3] dark:border-[#424a54] shadow-sm"
                                    >
                                        <span className="text-xl">
                                            {b.emoji}
                                        </span>
                                        <span className="text-[12px] font-black italic tracking-tighter">
                                            {b.count}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[12px] text-[#ccd3db] font-bold italic tracking-widest text-center w-full py-4 uppercase">
                                    No Badges Yet
                                </p>
                            )}
                        </div>

                        <div
                            className={`relative ${isAuthor ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            {isAuthor && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center">
                                    <span className="text-[11px] font-black italic tracking-widest uppercase text-[#424a54] dark:text-[#a3b0c1] bg-white/80 dark:bg-[#1c1f24]/80 px-4 py-2 rounded-full border border-[#f3f3f3] dark:border-[#292e35]">
                                        본인 게시글에는 달개를 부여할 수
                                        없습니다
                                    </span>
                                </div>
                            )}

                            <p className="text-[12px] font-black italic tracking-widest uppercase text-[#ccd3db] mb-4 text-center">
                                부여할 달개를 선택하세요
                            </p>

                            <div className="grid grid-cols-4 gap-3 max-w-[360px] mx-auto">
                                {badgeTypes.map((bt) => {
                                    const isSelected =
                                        !isAuthor &&
                                        myBadges.includes(bt.emoji);
                                    return (
                                        <button
                                            key={bt.id}
                                            onClick={() => {
                                                if (isAuthor) return;
                                                handleGiveBadge(bt.id);
                                            }}
                                            disabled={
                                                togglingBadge === bt.id ||
                                                isAuthor
                                            }
                                            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                                                isSelected
                                                    ? "bg-black text-[#e5e5e5] shadow-xl scale-110"
                                                    : "bg-white dark:bg-[#292e35] border border-[#f3f3f3] dark:border-[#424a54] text-[#ccd3db]"
                                            } ${
                                                !isAuthor
                                                    ? "hover:border-black dark:hover:border-[#e5e5e5] hover:text-black dark:hover:text-[#e5e5e5]"
                                                    : ""
                                            } ${togglingBadge === bt.id ? "opacity-50" : ""}`}
                                        >
                                            <span className="text-2xl">
                                                {bt.emoji}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                                                {bt.title || bt.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-20"></div>
            </div>
        </ResponsiveLayout>
    );
}
