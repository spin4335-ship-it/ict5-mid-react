import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import {
    ArrowLeft,
    ChevronRight,
    LogOut,
    Shield,
    Trash2,
    Bell,
    Smartphone,
    FileText,
    X,
    HelpCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/api/userService";
import { useAlert } from "@/context/AlertContext";

export default function SettingsPage() {
    const navigate = useNavigate();

    const [popup, setPopup] = useState({ isOpen: false, type: null });

    const [isDarkMode, setIsDarkMode] = useState(
        () => localStorage.getItem("darkMode") === "true",
    );

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", String(newMode));
        if (newMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        console.log("[darkMode] 전환:", isDarkMode, "→", newMode);
    };

    const { showAlert, showConfirm } = useAlert();
    const { logout } = useAuth();

    const handleLogout = () => {
        showConfirm({
            title: "로그아웃",
            message: "정말 로그아웃 하시겠습니까?",
            type: "info",
            confirmText: "로그아웃",
            cancelText: "취소",
            onConfirm: async () => {
                try {
                    await logout();
                    window.location.href = "/login";

                    showAlert("로그아웃되었습니다.", "성공", "success");
                } catch (error) {
                    console.error(error);
                    showAlert("오류가 발생했습니다.", "오류", "error");
                }
            },
            onCancel: () => {
                console.log(
                    "사용자가 로그아웃을 취소함: 리렌더링 없이 현재 페이지 유지",
                );
            },
        });
    };

    const [isNotificationEnabled, setIsNotificationEnabled] = useState(null);

    useEffect(() => {
        userService
            .getSettings()
            .then((data) => {
                console.log("[settings] 불러오기:", data);
                setIsNotificationEnabled(data.notificationEnabled ?? true);
            })
            .catch(() => {});
    }, []);

    const toggleNotification = async () => {
        const newVal = !isNotificationEnabled;
        setIsNotificationEnabled(newVal);
        localStorage.setItem("notificationEnabled", String(newVal));
        try {
            await userService.updateSettings({
                notificationEnabled: newVal,
                showVisitorCount: false,
                labFeaturesEnabled: false,
                bgmUrl: null,
                themeColor: null,
            });
            console.log("[notification] 저장 성공:", newVal);
        } catch (e) {
            console.warn("알림 설정 저장 실패", e);
        }
    };
    const settingItems = [
        {
            title: "계정 설정",
            items: [
                {
                    icon: <Shield size={20} />,
                    text: "비밀번호 변경",
                    path: "/settings/change-password",
                },
                {
                    icon: <Trash2 size={20} />,
                    text: "계정 탈퇴",
                    path: "/settings/delete-account",
                },
            ],
        },
        {
            title: "알림 및 표시",
            items: [
                ...(isNotificationEnabled !== null
                    ? [
                          {
                              icon: <Bell size={20} />,
                              text: "알림",
                              isToggle: true,
                              value: isNotificationEnabled,
                              onToggle: toggleNotification,
                          },
                      ]
                    : []),
                {
                    icon: <Smartphone size={20} />,
                    text: "다크 모드",
                    isToggle: true,
                    value: isDarkMode,
                    onToggle: toggleDarkMode,
                },
            ],
        },
        {
            title: "지원 및 정책",
            items: [
                {
                    icon: <FileText size={20} />,
                    text: "서비스 이용약관",
                    onClick: () => setPopup({ isOpen: true, type: "terms" }),
                },
                {
                    icon: <Shield size={20} />,
                    text: "개인정보 처리방침",
                    onClick: () => setPopup({ isOpen: true, type: "privacy" }),
                },
                {
                    icon: <HelpCircle size={20} />,
                    text: "Q&A 게시판",
                    path: "/settings/qna",
                },
            ],
        },
    ];

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-[#f9f9fa] dark:bg-[#101215] text-black dark:text-white transition-colors duration-300">
                <div className="flex items-center justify-between h-14 px-4 bg-white dark:bg-[#1c1f24] border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 z-40 transition-colors duration-300">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-[16px]">설정</h1>

                    <div className="w-10"></div>
                </div>

                <div className="flex flex-col gap-6 py-6 pb-24">
                    {settingItems.map((group, idx) => (
                        <div key={idx} className="flex flex-col">
                            <h2 className="px-5 mb-2 text-[12px] font-bold text-[#a3b0c1] uppercase tracking-wider">
                                {group.title}
                            </h2>
                            <div className="bg-white dark:bg-[#1c1f24] border-y border-[#f3f3f3] dark:border-[#292e35] transition-colors duration-300">
                                {group.items.map((item, iIdx) => (
                                    <div
                                        key={iIdx}
                                        className="w-full flex items-center justify-between px-5 py-4 border-b last:border-b-0 border-[#f3f3f3] dark:border-[#292e35]"
                                    >
                                        <button
                                            onClick={
                                                item.isToggle
                                                    ? item.onToggle
                                                    : item.onClick ||
                                                      (() =>
                                                          navigate(item.path))
                                            }
                                            className="flex-1 flex items-center justify-between hover:opacity-70 transition-opacity"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {item.icon}
                                                </span>
                                                <span className="text-[14px] font-medium">
                                                    {item.text}
                                                </span>
                                            </div>

                                            {!item.isToggle && (
                                                <ChevronRight
                                                    size={18}
                                                    className="text-[#ccd3db] dark:text-gray-600"
                                                />
                                            )}
                                        </button>

                                        {item.isToggle && (
                                            <button
                                                onClick={item.onToggle}
                                                className={`relative w-[44px] h-[24px] rounded-full ${item.value ? "bg-black dark:bg-white" : "bg-[#e5e5e5] dark:bg-gray-700"}`}
                                            >
                                                <div
                                                    className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full ${item.value ? "translate-x-[20px] bg-white dark:bg-[#1c1f24]" : "translate-x-0 bg-white"}`}
                                                />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-4 px-4">
                        <button
                            onClick={handleLogout}
                            className="w-full h-12 bg-white dark:bg-[#1c1f24] border border-[#e5e5e5] dark:border-[#292e35] rounded-[4px] flex items-center justify-center gap-2 text-red-500 font-bold text-[14px] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            <LogOut size={18} />
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>

            {popup.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setPopup({ isOpen: false, type: null })}
                    />

                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f3f3f3] bg-white text-black">
                            <h2 className="text-[18px] font-black italic tracking-tighter uppercase">
                                {popup.type === "terms"
                                    ? "Terms of Use"
                                    : "Privacy Policy"}
                            </h2>

                            <button
                                onClick={() =>
                                    setPopup({ isOpen: false, type: null })
                                }
                                className="w-10 h-10 flex items-center justify-center bg-[#f3f3f3] rounded-full hover:bg-black hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 md:p-10 overflow-y-auto w-full scrollbar-hide">
                            <div className="prose prose-sm text-[#424a54] max-w-none">
                                <p className="font-black text-[18px] text-black mb-8 leading-tight italic tracking-tighter">
                                    {popup.type === "terms"
                                        ? "MUSINSA SNAP 서비스 이용약관"
                                        : "개인정보 처리방침 안내"}
                                </p>

                                {popup.type === "terms" ? (
                                    <div className="space-y-10 text-[14px] leading-relaxed">
                                        <div className="text-[#7b8b9e] font-medium italic underline underline-offset-4 mb-10">
                                            최종 수정일: 2026년 3월 3일
                                        </div>

                                        <section>
                                            <h3 className="text-black font-black italic tracking-widest uppercase text-[15px] mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-black rotate-45" />{" "}
                                                제 1 조 (목적)
                                            </h3>
                                            <p>
                                                본 약관은 무신사(이하 '회사')가
                                                제공하는 SNAP 서비스 및 관련
                                                제반 서비스의 이용과 관련하여
                                                회사와 회원간의 권리, 의무 및
                                                책임사항 등을 규정함을 목적으로
                                                합니다.
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="text-black font-black italic tracking-widest uppercase text-[15px] mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-black rotate-45" />{" "}
                                                제 2 조 (용어의 정의)
                                            </h3>
                                            <p>
                                                'SNAP 서비스'라 함은 회원이
                                                사진, 동영상 등 스타일 콘텐츠를
                                                게시하고 다른 회원과 공유하며
                                                소통할 수 있는 스타일링 커뮤니티
                                                서비스를 의미합니다.
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="text-black font-black italic tracking-widest uppercase text-[15px] mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-black rotate-45" />{" "}
                                                제 3 조 (회원의 의무)
                                            </h3>
                                            <p>
                                                회원은 타인의 저작권을 침해하는
                                                게시물을 게시해서는 안 되며,
                                                서비스 내 소통 에티켓을
                                                준수하여야 합니다. 부적절한
                                                게시물은 운영 정책에 따라 삭제될
                                                수 있습니다.
                                            </p>
                                        </section>
                                    </div>
                                ) : (
                                    <div className="space-y-10 text-[14px] leading-relaxed">
                                        <div className="text-[#0078ff] font-bold italic tracking-tighter mb-10">
                                            당신의 소중한 스타일과 개인정보를
                                            투명하게 관리합니다.
                                        </div>

                                        <section>
                                            <h3 className="text-black font-black italic tracking-widest uppercase text-[15px] mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-black rotate-45" />{" "}
                                                1. 수집하는 개인정보
                                            </h3>
                                            <p className="mb-3">
                                                회사는 서비스 제공을 위해
                                                최소한의 개인정보를 수집하고
                                                있습니다.
                                            </p>
                                            <ul className="list-disc pl-5 space-y-2 opacity-80 font-medium">
                                                <li>
                                                    필수항목:
                                                    미니홈피명(아이디), 이메일,
                                                    프로필 사진
                                                </li>
                                                <li>
                                                    선택항목: 신체 사이즈(키,
                                                    몸무게 - 스타일 추천용)
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h3 className="text-black font-black italic tracking-widest uppercase text-[15px] mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-black rotate-45" />{" "}
                                                2. 개인정보의 이용
                                            </h3>
                                            <p>
                                                수집된 정보는 회원 식별, 맞춤형
                                                콘텐츠 추천, 서비스 질 개선 및
                                                통계 분석을 목적으로만
                                                사용됩니다.
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="text-black font-black italic tracking-widest uppercase text-[15px] mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-black rotate-45" />{" "}
                                                3. 정보의 보유 기간
                                            </h3>
                                            <p>
                                                회원 탈퇴 시 또는 수집 목적이
                                                달성된 경우 지체 없이 파기하는
                                                것을 원칙으로 합니다. 단, 법령에
                                                의하여 보존할 필요가 있는 경우
                                                해당 기간 동안 보관합니다.
                                            </p>
                                        </section>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-6 border-t border-[#f3f3f3] bg-[#fafafa]">
                            <button
                                onClick={() =>
                                    setPopup({ isOpen: false, type: null })
                                }
                                className="w-full h-14 bg-black text-white font-black italic tracking-[2px] uppercase text-[15px] rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ResponsiveLayout>
    );
}
