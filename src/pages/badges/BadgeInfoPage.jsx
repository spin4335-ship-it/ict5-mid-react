import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Sparkles,
    BookOpen,
    PenTool,
    Cpu,
    Target,
    Trophy,
} from "lucide-react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";

export default function BadgeInfoPage() {
    const navigate = useNavigate();

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="min-h-screen bg-[#f9f9fa] dark:bg-[#101215] text-black dark:text-white transition-colors duration-300 pb-20">
                <div className="flex items-center justify-between h-14 px-4 bg-white dark:bg-[#1c1f24] border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 z-40">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-[16px]">달개 가이드</h1>
                    <div className="w-10"></div>
                </div>

                <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-black dark:bg-white rounded-3xl shadow-2xl mb-4 rotate-3 transform hover:rotate-0 transition-transform duration-500">
                            <Trophy className="w-10 h-10 text-yellow-400 dark:text-yellow-600" />
                        </div>

                        <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                            Decorate Your <br />
                            Digital Influence
                        </h2>

                        <p className="text-[14px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[4px]">
                            The Art of Badges
                        </p>
                    </div>

                    <section className="bg-white dark:bg-[#1c1f24] p-10 rounded-[32px] border border-[#f3f3f3] dark:border-[#292e35] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-blue-500" />
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">
                                    달개의 의미
                                </h3>
                            </div>

                            <div className="space-y-4 text-[15px] font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                                <p>
                                    '달개'는 배지의 순우리말입니다. 당신의
                                    소중한 기록과 성장을 상징하는 특별한
                                    장식이죠.
                                </p>
                                <p>
                                    무신사 SNAP에서 활동하며 얻은 모든 성과는
                                    하나의 달개가 되어 당신의 프로필을 빛나게 할
                                    것입니다.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="bg-black dark:bg-white p-8 rounded-[24px] text-white dark:text-black">
                            <PenTool className="mb-4 text-yellow-400 dark:text-yellow-600" />
                            <h4 className="text-lg font-black italic tracking-tighter uppercase mb-2">
                                Steady Action
                            </h4>
                            <p className="text-[13px] opacity-70 font-medium leading-relaxed text-gray-400 dark:text-gray-500">
                                매일 스냅을 작성하고, 다른 글벗들과 소통하세요.
                                꾸준한 활동만이 최고 등급의 달개를 얻는 유일한
                                길입니다.
                            </p>
                        </section>

                        <section className="bg-gray-100 dark:bg-gray-800 p-8 rounded-[24px]">
                            <Target className="mb-4 text-black dark:text-white" />
                            <h4 className="text-lg font-black italic tracking-tighter uppercase mb-2">
                                Special Missions
                            </h4>
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                특정 테마의 코디를 업로드하거나, 많은 관심을
                                받은 게시물은 한정적인 '레어 달개'를 획득할 수
                                있게 해줍니다.
                            </p>
                        </section>
                    </div>

                    <section className="text-center py-10">
                        <div className="bg-[#f9f9fa] dark:bg-[#101215] inline-block px-8 py-3 rounded-full border border-[#e5e5e5] dark:border-[#292e35] mb-6">
                            <span className="text-[12px] font-black italic tracking-widest uppercase">
                                The Future of Snap
                            </span>
                        </div>

                        <p className="text-[16px] font-bold text-gray-400 leading-relaxed max-w-xl mx-auto">
                            우리는 당신의 스타일과 그 속에 담긴 진정성을 높이
                            평가합니다. <br />
                            달개는 단순한 그래픽이 아닌, 당신의 패션 여정입니다.
                        </p>
                    </section>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
