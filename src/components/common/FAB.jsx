import React from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAB() {
    return (
        <div className="fixed bottom-[90px] right-6 z-50">
            <Link
                to="/create"
                className="w-[56px] h-[56px] rounded-full bg-black text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                aria-label="Add Snap"
            >
                <Plus size={28} strokeWidth={2.5} />
            </Link>
        </div>
    );
}
