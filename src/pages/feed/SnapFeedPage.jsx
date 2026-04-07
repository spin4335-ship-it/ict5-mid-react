import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import SnapCard from "@/components/feed/SnapCard";
import FAB from "@/components/common/FAB";
import { Search as SearchIcon, X } from "lucide-react";

export default function SnapFeedPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";

    const [filter, setFilter] = useState("all");
    const [allItems, setAllItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const sentinelRef = useRef(null);
    const isFetching = useRef(false);
    const isMounted = useRef(true);
    const hasMoreRef = useRef(true);
    const filterRef = useRef(filter);
    const searchQueryRef = useRef(searchQuery);

    const getVisibility = (currentFilter) => {
        if (currentFilter === "following") return "FRIENDS";
        if (currentFilter === "mine") return "MINE";
        return undefined;
    };

    const loadFeed = useCallback(
        async (pageNum, currentFilter, currentSearchQuery = "") => {
            if (isFetching.current) {
                console.log("[Feed] Already fetching, skipping request");
                return;
            }

            if (pageNum > 0 && !hasMoreRef.current) {
                console.log("[Feed] No more data to load");
                return;
            }

            isFetching.current = true;
            setLoading(true);

            try {
                console.log(`[Feed] Fetching page ${pageNum}...`);

                const response = await apiClient.get("/albums/feed", {
                    params: {
                        type: "photo",
                        visibility: getVisibility(currentFilter),
                        tag: currentSearchQuery || undefined,
                        page: pageNum,
                        size: 12,
                    },
                });

                if (!isMounted.current) {
                    console.log(
                        "[Feed] Component unmounted, ignoring response",
                    );
                    return;
                }

                const newItems = response.data || [];
                console.log(
                    `[Feed] Page ${pageNum} loaded: ${newItems.length} items`,
                );

                if (pageNum === 0) {
                    setAllItems(newItems);
                } else {
                    setAllItems((prev) => [...prev, ...newItems]);
                }

                const hasMoreData = newItems.length === 12;
                setHasMore(hasMoreData);
                hasMoreRef.current = hasMoreData;
            } catch (error) {
                console.error(`[Feed] Error loading page ${pageNum}:`, error);
                if (isMounted.current) {
                    if (pageNum === 0) {
                        setAllItems([]);
                    }
                    setHasMore(false);
                    hasMoreRef.current = false;
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
                isFetching.current = false;
            }
        },
        [],
    );

    useEffect(() => {
        isMounted.current = true;
        filterRef.current = filter;
        searchQueryRef.current = searchQuery;

        setAllItems([]);
        setCurrentPage(0);
        setHasMore(true);
        hasMoreRef.current = true;

        loadFeed(0, filter, searchQuery);

        return () => {
            isMounted.current = false;
        };
    }, [filter, searchQuery, loadFeed]);

    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (isFetching.current || !hasMoreRef.current) {
                        console.log(
                            "[Feed] Skipping: isFetching=",
                            isFetching.current,
                            "hasMore=",
                            hasMoreRef.current,
                        );
                        return;
                    }

                    console.log("[Feed] Sentinel visible - loading next page");

                    setCurrentPage((prev) => {
                        const nextPage = prev + 1;
                        loadFeed(
                            nextPage,
                            filterRef.current,
                            searchQueryRef.current,
                        );
                        return nextPage;
                    });
                }
            },
            {
                rootMargin: "0px 0px 100px 0px",
                threshold: 0.01,
            },
        );

        observer.observe(sentinelRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <ResponsiveLayout>
            <div className="flex justify-between items-center px-4 py-6 bg-white dark:bg-[#101215] border-b border-[#f3f3f3] dark:border-[#292e35] transition-colors">
                <div className="bg-black dark:bg-[#292e35] px-4 py-2.5 rounded-[2px] shadow-xl flex items-center gap-2">
                    <span className="text-[15px] font-black italic tracking-widest text-white dark:text-[#e5e5e5] uppercase leading-none block">
                        {searchQuery ? (
                            <div className="flex items-center gap-2">
                                <SearchIcon
                                    size={14}
                                    className="stroke-[3px]"
                                />
                                <span>"{searchQuery}"</span>
                                <button
                                    onClick={() => {
                                        searchParams.delete("q");
                                        setSearchParams(searchParams);
                                    }}
                                    className="ml-1 p-0.5 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : filter === "all" ? (
                            "전체"
                        ) : filter === "following" ? (
                            "글벗"
                        ) : (
                            "나만"
                        )}
                    </span>
                </div>

                <div className="flex bg-[#f3f3f3] dark:bg-[#1c1f24] p-1 rounded-full shrink-0 ml-4">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-300 ${
                            filter === "all"
                                ? "bg-black text-white shadow-md"
                                : "text-[#a3b0c1] hover:text-black dark:hover:text-white"
                        }`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setFilter("following")}
                        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-300 ${
                            filter === "following"
                                ? "bg-black text-white shadow-md"
                                : "text-[#a3b0c1] hover:text-black dark:hover:text-white"
                        }`}
                    >
                        글벗
                    </button>
                    <button
                        onClick={() => setFilter("mine")}
                        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all duration-300 ${
                            filter === "mine"
                                ? "bg-black text-white shadow-md"
                                : "text-[#a3b0c1] hover:text-black dark:hover:text-white"
                        }`}
                    >
                        나만
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#101215] min-h-screen pb-10">
                {allItems.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1 px-1">
                        {allItems.map((snap, idx) => (
                            <SnapCard
                                key={`${snap.albumId || snap.id}-${idx}`}
                                snap={snap}
                            />
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="p-20 text-center text-gray-400">
                            등록된 게시물이 없습니다.
                        </div>
                    )
                )}

                <div
                    ref={sentinelRef}
                    className="mt-10 py-10 w-full flex flex-col items-center justify-center border-t border-gray-100 dark:border-gray-800"
                >
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">
                                다음 게시물을 불러오는 중...
                            </p>
                        </div>
                    ) : hasMore ? (
                        <p className="text-gray-400 text-sm font-medium animate-pulse">
                            스크롤하여 더보기
                        </p>
                    ) : allItems.length > 0 ? (
                        <p className="text-gray-300 text-xs">
                            모든 게시물을 확인했습니다.
                        </p>
                    ) : null}
                </div>
            </div>

            <FAB />
        </ResponsiveLayout>
    );
}
