import React, { useState } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import {
    Landmark,
    Search,
    Calendar,
    ExternalLink,
    Loader2,
    Info,
    TrendingUp,
    Cpu,
} from "lucide-react";
import { fssService } from "@/api/fssService";
import { useAlert } from "@/context/AlertContext";

export default function FssPage() {
    const [loading, setLoading] = useState(false);

    const [isSearched, setIsSearched] = useState(false);

    const [data, setData] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    const aMonthAgo = new Date();
    aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
    const initialStartDate = aMonthAgo.toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(initialStartDate);

    const [endDate, setEndDate] = useState(today);
    const { showAlert } = useAlert();

    const fetchData = async () => {
        setLoading(true);
        setIsSearched(true);

        try {
            const formmatedStartDate = startDate.replace(/-/g, "");
            const formmatedEndDate = endDate.replace(/-/g, "");

            const result = await fssService.fetchFssData(
                formmatedStartDate,
                formmatedEndDate,
            );
            console.log("1. 서버 원본 응답:", result);

            const root = result && result.reponse ? result.reponse : result;
            console.log("2. 파싱된 root 데이터:", root);

            const successCode = ["1", "000", "SUCCESS"];
            const isSuccess =
                root &&
                (!root.resultCode || successCode.includes(root.resultCode));

            if (isSuccess && (root.result || Array.isArray(result))) {
                const list =
                    result?.reponse?.result ||
                    result?.result ||
                    (Array.isArray(result) ? result : []);
                console.log("3. 최종 저장될 list:", list);
                setData(list);
            } else {
                if (root?.errorMsg) {
                    console.log("FSS API error", root.errorMsg);
                }
                setData([]);
            }
        } catch (err) {
            console.log("상세 에러", err);
            setData([]);

            const serverError = err.response?.data;
            const errorMsg =
                (typeof serverError === "string"
                    ? serverError
                    : serverError?.message) ||
                "데이터 조회 중 문제가 발생했습니다.";

            showAlert(errorMsg, "데이터 조회 실패", "alert");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResponsiveLayout showTabs={true}>
            <div className="flex flex-col min-h-screen bg-white dark:bg-[#101215] text-black dark:text-[#e5e5e5] pb-20">
                <div className="px-6 py-12 flex flex-col items-center border-b border-[#f3f3f3] dark:border-[#292e35] bg-[#fafafa] dark:bg-[#1c1f24]">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl transform rotate-3 hover:rotate-0 transition-all">
                        <TrendingUp size={32} />
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                        금융감독원 뉴스레터
                    </h2>
                    <p className="text-[14px] text-[#a3b0c1] font-bold tracking-widest uppercase">
                        새로운 소식을 뉴스레터로 확인하세요
                    </p>
                </div>

                <div className="p-4">
                    <div className="bg-black text-white p-8 rounded-[24px] mb-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] opacity-10">
                            <Cpu size={180} />
                        </div>

                        <div className="flex flex-col gap-4 relative z-10 mb-6">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <Landmark size={18} />
                            </div>
                            <h2 className="text-[18px] font-black italic tracking-widest uppercase">
                                검색 기간 설정
                            </h2>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end relative z-10">
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase text-gray-500 mb-1 ml-1">
                                    시작 날짜
                                </p>
                                <input
                                    type="date"
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[13px] font-black italic tracking-widest outline-none focus:border-white/40 focus:bg-white/10 transition-all text-white"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                />
                            </div>

                            <div className="hidden sm:block text-gray-600 mb-3 font-bold">
                                ~
                            </div>

                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase text-gray-500 mb-1 ml-1">
                                    마지막 날짜
                                </p>
                                <input
                                    type="date"
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[13px] font-black italic tracking-widest outline-none focus:border-white/40 focus:bg-white/10 transition-all text-white"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className="w-full sm:w-auto sm:px-8 h-12 bg-white dark:bg-[#292e35] text-black dark:text-[#e5e5e5] font-black italic tracking-[1px] text-[14px] rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-2 sm:mt-0"
                            >
                                {loading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={18}
                                    />
                                ) : (
                                    <Search size={18} />
                                )}
                                <span>데이터 검색</span>
                            </button>
                        </div>
                    </div>

                    <div className="px-2">
                        {!isSearched ? (
                            <div className="py-24 flex flex-col items-center text-[#ccd3db] gap-4">
                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#ccd3db] flex items-center justify-center">
                                    <Search size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[14px] font-black italic tracking-widest uppercase">
                                        조회 대기중
                                    </p>
                                    <p className="text-[11px] font-bold text-[#ccd3db] uppercase mt-1">
                                        조회 시작 날짜를 선택하세요
                                    </p>
                                </div>
                            </div>
                        ) : loading ? (
                            <div className="py-24 flex flex-col items-center text-black dark:text-[#e5e5e5] gap-4">
                                <Loader2
                                    size={40}
                                    className="animate-spin text-black dark:text-[#e5e5e5]"
                                />
                                <p className="text-[13px] font-black italic tracking-widest uppercase animate-pulse">
                                    데이터 조회중...
                                </p>
                            </div>
                        ) : data.length > 0 ? (
                            <div className="flex flex-col divide-y divide-[#f3f3f3]">
                                <div className="pb-4 flex items-center justify-between border-b-2 border-black">
                                    <span className="text-[12px] font-black italic tracking-widest uppercase">
                                        뉴스레터
                                    </span>
                                    <span className="text-[10px] font-bold text-[#ccd3db] uppercase tracking-[1px]">
                                        {data.length} UPDATES
                                    </span>
                                </div>

                                {data.map((item, index) => {
                                    const id =
                                        item.contentId ||
                                        item.idx ||
                                        item.fcnNo ||
                                        index;
                                    const title =
                                        item.subject ||
                                        item.title ||
                                        item.name ||
                                        "공시 내용이 없습니다.";
                                    const date =
                                        item.regDate ||
                                        item.reg_date ||
                                        item.createdAt ||
                                        "날짜 미상";
                                    const url =
                                        item.originUrl ||
                                        item.origin_url ||
                                        item.link ||
                                        "https://www.fss.or.kr";

                                    return (
                                        <div
                                            key={id}
                                            className="py-8 flex flex-col gap-3 cursor-pointer group hover:bg-[#fafafa] dark:hover:bg-[#1c1f24] transition-all px-2 -mx-2 rounded-xl"
                                            onClick={() =>
                                                window.open(url, "_blank")
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black italic tracking-tighter uppercase rounded">
                                                    NEWSLETTER
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[#ccd3db]">
                                                    <Calendar size={12} />
                                                    <span className="text-[11px] font-bold tracking-widest uppercase">
                                                        {date}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="font-black italic text-[18px] tracking-tighter uppercase leading-[1.2] text-[#111] dark:text-[#e5e5e5] group-hover:text-blue-600 transition-colors">
                                                    {title}
                                                </h3>
                                                <div className="w-10 h-10 rounded-full border border-[#f3f3f3] flex items-center justify-center text-[#ccd3db] group-hover:border-black group-hover:text-black transition-all shrink-0 translate-y-[-5px]">
                                                    <ExternalLink size={16} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                <span className="text-[11px] font-bold text-[#a3b0c1] uppercase">
                                                    데이터 제공: FSS.GO.KR
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center text-[#ccd3db] gap-4">
                                <Info size={40} />
                                <p className="text-[14px] font-black italic tracking-widest uppercase">
                                    No Signals Found
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mx-6 p-8 bg-[#f9f9f9] dark:bg-[#1c1f24] rounded-[24px] border border-[#f3f3f3] dark:border-[#292e35] text-center mt-6">
                    <p className="text-[10px] font-black italic tracking-[3px] uppercase text-[#ccd3db] mb-2 leading-relaxed">
                        ICT5 x MYMORY x FSS
                    </p>
                    <p className="text-[12px] font-medium text-[#7b8b9e] max-w-[280px] mx-auto">
                        금융감독원 공시 데이터를 바탕으로 실시간 마켓 트렌드를
                        분석합니다.
                    </p>
                </div>
            </div>
        </ResponsiveLayout>
    );
}
