import React from "react";

import GlobalNav from "./GlobalNav";

import SnapHeader from "./SnapHeader";

import BottomNav from "./BottomNav";

export default function ResponsiveLayout({ children, showTabs = true }) {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-mw-white)] max-w-[1200px] mx-auto shadow-sm">
            <div className="hidden sm:block">
                <GlobalNav />
            </div>

            <div className="sticky top-0 z-50 bg-white dark:bg-[#1c1f24] shadow-sm sm:shadow-none">
                <SnapHeader />
            </div>

            <main className={`flex-1 ${showTabs ? "pb-24" : "pb-0"} sm:pb-0`}>
                {children}
            </main>

            {showTabs && <BottomNav />}
        </div>
    );
}
