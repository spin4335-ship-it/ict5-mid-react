import React from "react";

import { NavLink } from "react-router-dom";

export default function TabBar() {
    const tabs = [
        { name: "피드", path: "/" },
        { name: "창작", path: "/create" },
        { name: "달개", path: "/badges" },
        { name: "글벗", path: "/friends" },
        { name: "금융", path: "/finance" },
    ];

    return (
        <div className="flex px-4 border-b border-[#f3f3f3]">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.name}
                    to={tab.path}
                    className={({ isActive }) =>
                        `py-3 px-3 text-[15px] font-medium transition-all relative ${
                            isActive
                                ? "text-black"
                                : "text-[#a3b0c1] hover:text-black"
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {tab.name}

                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
}
