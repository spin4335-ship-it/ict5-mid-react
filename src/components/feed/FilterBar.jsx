import React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function FilterBar() {
    const filters = [
        { label: "", icon: <SlidersHorizontal size={16} /> },
        { label: "남" },
        { label: "여" },
        { label: "유형", hasDropdown: true },
        { label: "계절", hasDropdown: true },
        { label: "스타일", hasDropdown: true },
        { label: "키/몸무게", hasDropdown: true },
        { label: "TPO", hasDropdown: true },
        { label: "카테고리", hasDropdown: true },
        { label: "브랜드", hasDropdown: true },
    ];

    return (
        <div className="w-full bg-white border-b border-[#f3f3f3]">
            <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2">
                {filters.map((f, idx) => (
                    <button
                        key={idx}
                        className="flex items-center justify-center whitespace-nowrap px-3 py-1.5 border border-[#e5e5e5] rounded-[4px] text-[13px] text-[#424a54] hover:bg-gray-50 flex-shrink-0"
                    >
                        {f.icon && <span className="mr-1">{f.icon}</span>}

                        {f.label && <span>{f.label}</span>}

                        {f.hasDropdown && (
                            <ChevronDown
                                size={14}
                                className="ml-1 text-[#a3b0c1]"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
