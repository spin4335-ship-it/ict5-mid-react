import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getImageUrl, DEFAULT_POST_IMAGE } from "@/utils/imageUtils";

export default function RankSnapCard({ snap, rank }) {
    const [liked, setLiked] = useState(snap.isLiked);

    return (
        <div className="relative break-inside-avoid mb-1">
            <Link
                to={`/snap/${snap.id}`}
                className="block relative w-full h-auto overflow-hidden"
            >
                <img
                    src={getImageUrl(snap.imageUrl) || DEFAULT_POST_IMAGE}
                    alt={`Snap ${snap.id}`}
                    className="w-full h-[250px] object-cover"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_POST_IMAGE;
                    }}
                />

                <div className="absolute top-2 left-2 bg-white text-black font-bold text-[12px] px-[6px] py-[2px] rounded-sm mix-blend-screen drop-shadow-sm">
                    {rank}
                </div>

                <div className="absolute bottom-2 right-2 text-white drop-shadow-md">
                    <button
                        onClick={(e) => {
                            e.preventDefault();

                            setLiked(!liked);
                        }}
                        aria-label="Like"
                        className="p-1"
                    >
                        <Heart
                            size={20}
                            fill={liked ? "white" : "transparent"}
                            stroke={liked ? "none" : "currentColor"}
                            strokeWidth={2}
                        />
                    </button>
                </div>
            </Link>
        </div>
    );
}
