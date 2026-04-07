import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, X, Calendar, Loader2, ImagePlus } from "lucide-react";
import { photoService } from "@/api/photoService";
import { albumService } from "@/api/albumService";
import { useAlert } from "@/context/AlertContext";
import { saveAlbumLayout } from "@/utils/albumLayoutStore";

const layouts = [
    {
        id: 1,
        name: "1장",
        grid: "grid-cols-1",
        apiValue: "single",
        label: "Solo",
        previewCells: 1,
    },
    {
        id: 2,
        name: "2장 가로",
        grid: "grid-cols-2",
        apiValue: "horizontal-two",
        label: "Twin H",
        previewCells: 2,
    },
    {
        id: 3,
        name: "2장 세로",
        grid: "grid-rows-2",
        apiValue: "vertical-two",
        label: "Twin V",
        previewCells: 2,
    },
    {
        id: 4,
        name: "4장",
        grid: "grid-cols-2 grid-rows-2",
        apiValue: "grid",
        label: "Quad",
        previewCells: 4,
    },
    {
        id: 5,
        name: "3장 좌1+우2",
        grid: "grid-cols-2 grid-rows-2",
        apiValue: "left-one-right-two",
        label: "L+R2",
        previewCells: 3,
    },
    {
        id: 6,
        name: "3장 상1+하2",
        grid: "grid-cols-2 grid-rows-2",
        apiValue: "top-one-bottom-two",
        label: "T+B2",
        previewCells: 3,
    },
    {
        id: 7,
        name: "3장 균등",
        grid: "grid-cols-3",
        apiValue: "three-column",
        label: "3 Col",
        previewCells: 3,
    },
    {
        id: 8,
        name: "4장 상1+하3",
        grid: "grid-cols-3 grid-rows-2",
        apiValue: "top-one-bottom-three",
        label: "T+B3",
        previewCells: 4,
    },
    {
        id: 9,
        name: "4장 좌1+우3",
        grid: "grid-cols-2 grid-rows-2",
        apiValue: "left-one-right-three",
        label: "L+R3",
        previewCells: 4,
    },
];

const VISIBILITY_MAP = {
    private: "PRIVATE",
    friends: "FRIENDS",
    public: "PUBLIC",
};

function dataUrlToFile(dataUrl, filename = `canvas_${Date.now()}.png`) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
}

export default function CreatePhotoAlbumPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { showConfirm, showAlert } = useAlert();

    console.log("[CreatePhotoAlbumPage] render 시작");
    console.log("[CreatePhotoAlbumPage] location.state =", location.state);

    const [photos, setPhotos] = useState([]);

    const [selectedLayout, setSelectedLayout] = useState(1);

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    const [tags, setTags] = useState([]);

    const [tagInput, setTagInput] = useState("");

    const [visibility, setVisibility] = useState("private");

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0],
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log("[CreatePhotoAlbumPage] photos =", photos);
    console.log("[CreatePhotoAlbumPage] selectedLayout =", selectedLayout);
    console.log("[CreatePhotoAlbumPage] title =", title);
    console.log("[CreatePhotoAlbumPage] content =", content);
    console.log("[CreatePhotoAlbumPage] tags =", tags);
    console.log("[CreatePhotoAlbumPage] tagInput =", tagInput);
    console.log("[CreatePhotoAlbumPage] visibility =", visibility);
    console.log("[CreatePhotoAlbumPage] selectedDate =", selectedDate);
    console.log("[CreatePhotoAlbumPage] isSubmitting =", isSubmitting);

    const handlePhotoUpload = (e) => {
        console.log("[handlePhotoUpload] 호출");
        console.log("[handlePhotoUpload] e.target.files =", e.target.files);

        const files = e.target.files;

        if (files) {
            const newPhotoObjects = Array.from(files).map((file) => ({
                url: URL.createObjectURL(file),
                file: file,
            }));

            console.log(
                "[handlePhotoUpload] newPhotoObjects =",
                newPhotoObjects,
            );

            const updatedPhotos = [...photos, ...newPhotoObjects].slice(0, 4);
            console.log("[handlePhotoUpload] updatedPhotos =", updatedPhotos);

            setPhotos(updatedPhotos);

            if (updatedPhotos.length === 1) {
                console.log("[handlePhotoUpload] selectedLayout -> 1");
                setSelectedLayout(1);
            } else if (updatedPhotos.length === 2) {
                console.log("[handlePhotoUpload] selectedLayout -> 2");
                setSelectedLayout(2);
            } else if (updatedPhotos.length === 3) {
                console.log("[handlePhotoUpload] selectedLayout -> 5");
                setSelectedLayout(5);
            } else if (updatedPhotos.length >= 4) {
                console.log("[handlePhotoUpload] selectedLayout -> 4");
                setSelectedLayout(4);
            }
        }
    };

    const removePhoto = (index) => {
        console.log("[removePhoto] 제거할 index =", index);

        const newPhotos = photos.filter((_, i) => i !== index);
        console.log("[removePhoto] newPhotos =", newPhotos);

        setPhotos(newPhotos);

        if (newPhotos.length === 1) {
            console.log("[removePhoto] selectedLayout -> 1");
            setSelectedLayout(1);
        } else if (newPhotos.length === 2) {
            console.log("[removePhoto] selectedLayout -> 2");
            setSelectedLayout(2);
        } else if (newPhotos.length === 3) {
            console.log("[removePhoto] selectedLayout -> 5");
            setSelectedLayout(5);
        } else if (newPhotos.length >= 4) {
            console.log("[removePhoto] selectedLayout -> 4");
            setSelectedLayout(4);
        }
    };

    const getAvailableLayouts = () => {
        console.log("[getAvailableLayouts] photos.length =", photos.length);

        if (photos.length === 0) return [];
        if (photos.length === 1) return layouts.filter((l) => l.id === 1);
        if (photos.length === 2)
            return layouts.filter((l) => l.id === 2 || l.id === 3);
        if (photos.length === 3)
            return layouts.filter((l) => [5, 6, 7].includes(l.id));
        return layouts.filter((l) => [4, 8, 9].includes(l.id));
    };

    const handleAddTag = () => {
        console.log("[handleAddTag] tagInput =", tagInput);
        console.log("[handleAddTag] 현재 tags =", tags);

        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            const nextTags = [...tags, tagInput.trim()];
            console.log("[handleAddTag] nextTags =", nextTags);
            setTags(nextTags);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag) => {
        console.log("[handleRemoveTag] 제거할 tag =", tag);

        const nextTags = tags.filter((t) => t !== tag);
        console.log("[handleRemoveTag] nextTags =", nextTags);

        setTags(nextTags);
    };

    const getCurrentUserId = () => {
        try {
            const raw = localStorage.getItem("user");
            console.log("[getCurrentUserId] raw =", raw);

            if (!raw) return null;

            const parsedId = JSON.parse(raw)?.id ?? null;
            console.log("[getCurrentUserId] parsedId =", parsedId);

            return parsedId;
        } catch (e) {
            console.log("[getCurrentUserId] parse 실패, e =", e);
            return null;
        }
    };

    const getLayoutType = (layoutId) => {
        const layoutType =
            layouts.find((l) => l.id === layoutId)?.apiValue ?? "single";
        console.log(
            "[getLayoutType] layoutId =",
            layoutId,
            ", layoutType =",
            layoutType,
        );
        return layoutType;
    };

    const handleComplete = async () => {
        console.log("[handleComplete] 호출");
        console.log("[handleComplete] title =", title);
        console.log("[handleComplete] content =", content);
        console.log("[handleComplete] photos =", photos);
        console.log("[handleComplete] tags =", tags);
        console.log("[handleComplete] visibility =", visibility);
        console.log("[handleComplete] selectedDate =", selectedDate);
        console.log("[handleComplete] selectedLayout =", selectedLayout);

        if (!title.trim()) {
            showAlert("제목을 입력해주세요.", "입력 오류", "alert");
            return;
        }
        if (!content.trim()) {
            showAlert("내용을 입력해주세요.", "입력 오류", "alert");
            return;
        }
        if (photos.length === 0) {
            showAlert("사진을 1장 이상 업로드해주세요.", "입력 오류", "alert");
            return;
        }

        const userId = getCurrentUserId();
        console.log("[handleComplete] userId =", userId);

        if (!userId) {
            showAlert(
                "로그인 정보가 없습니다. 다시 로그인해주세요.",
                "인증 오류",
                "alert",
            );
            navigate("/login");
            return;
        }

        setIsSubmitting(true);

        try {
            const uploadResult = await photoService.uploadPhotos({
                files: photos.map((p) => p.file),
                userId,
            });

            console.log("[handleComplete] uploadResult =", uploadResult);

            const uploadedPhotos = uploadResult?.photos ?? [];
            console.log("[handleComplete] uploadedPhotos =", uploadedPhotos);

            if (uploadedPhotos.length === 0)
                throw new Error("업로드된 사진 정보가 없습니다.");

            const photoIds = uploadedPhotos.map((p) => p.photoId);
            const slotIndexes = photoIds.map((_, i) => i);

            console.log("[handleComplete] photoIds =", photoIds);
            console.log("[handleComplete] slotIndexes =", slotIndexes);

            const result = await albumService.createAlbum({
                userId,
                title: title.trim(),
                bodyText: content.trim(),
                recordDate: selectedDate,
                visibility: VISIBILITY_MAP[visibility],
                layoutType: getLayoutType(selectedLayout),
                photoIds,
                slotIndexes,
                tags,
            });

            console.log("[handleComplete] createAlbum result =", result);

            showAlert(
                result?.message || "스냅이 게시되었습니다!",
                "게시 완료",
                "success",
            );
            saveAlbumLayout(result?.albumId, getLayoutType(selectedLayout));
            navigate(`/snap/${result.albumId}`, {
                state: { fromPage: "create" },
            });
        } catch (e) {
            console.log("[handleComplete] 실패 e =", e);
            console.error(e);
            const message =
                e.response?.data?.message ||
                e.message ||
                "글 작성에 실패했습니다.";
            showAlert(message, "업로드 실패", "alert");
        } finally {
            console.log("[handleComplete] 종료");
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        console.log("[useEffect canvas] 시작");
        console.log("[useEffect canvas] location.state =", location.state);

        const canvasData = location.state?.canvasFile;
        console.log("[useEffect canvas] canvasData =", canvasData);

        if (canvasData) {
            const resolvedFile =
                canvasData.file instanceof File
                    ? canvasData.file
                    : dataUrlToFile(canvasData.url);
            console.log("[useEffect canvas] resolvedFile =", resolvedFile);

            const newImage = {
                id: Date.now(),
                url: canvasData.url,
                file: resolvedFile,
                isCanvas: true,
            };

            console.log("[useEffect canvas] newImage =", newImage);

            setPhotos((prev) => {
                console.log("[useEffect canvas] prev photos =", prev);

                if (prev.length >= 4) {
                    console.log("[useEffect canvas] 이미 4장이라 교체 confirm");
                    showConfirm({
                        title: "사진 개수 초과",
                        message:
                            "이미 4장의 사진이 등록되어 있습니다.\n마지막 사진을 현재 제작한 이미지로 교체할까요?",
                        confirmText: "교체하기",
                        cancelText: "유지하기",
                        type: "alert",
                        onConfirm: () => {
                            console.log("[useEffect canvas] 교체 확정");
                            setPhotos((current) => [
                                ...current.slice(0, -1),
                                newImage,
                            ]);
                            showAlert(
                                "마지막 사진이 제작한 이미지로 교체되었습니다.",
                                "완료",
                                "success",
                            );
                        },
                    });
                    return prev;
                }

                const updated = [...prev, newImage];
                console.log("[useEffect canvas] updated photos =", updated);

                if (updated.length === 1) setSelectedLayout(1);
                else if (updated.length === 2) setSelectedLayout(2);
                else if (updated.length === 3) setSelectedLayout(5);
                else if (updated.length >= 4) setSelectedLayout(4);

                return updated;
            });

            window.history.replaceState({}, document.title);
            location.state.canvasFile = null;
            console.log("[useEffect canvas] state 초기화 완료");
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-[#f9f9fa] dark:bg-[#101215] text-black dark:text-white transition-colors duration-300 pb-20">
            <div className="flex items-center justify-between h-14 px-4 bg-white dark:bg-[#1c1f24] border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 z-40 transition-colors duration-300">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="font-bold text-[16px]">사진첩 창작</h1>
                <div className="w-10"></div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
                <div className="space-y-3">
                    <h3 className="text-[14px] font-bold text-gray-500 dark:text-gray-400">
                        작성 날짜
                    </h3>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                console.log(
                                    "[UI] selectedDate 변경 =",
                                    e.target.value,
                                );
                                setSelectedDate(e.target.value);
                            }}
                            className="w-full h-12 pl-12 pr-4 bg-white dark:bg-[#1c1f24] border border-[#e5e5e5] dark:border-[#292e35] rounded-xl text-[14px] font-bold outline-none focus:border-black dark:focus:border-white transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[14px] font-bold text-gray-500 dark:text-gray-400">
                        사진 등록 (최대 4장, 확장자 : "jpg", "jpeg", "png",
                        "webp" 파일만 가능합니다)
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {photos.length < 4 && (
                            <label className="flex-shrink-0 cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                <div className="w-24 h-24 border-2 border-dashed border-[#e5e5e5] dark:border-[#292e35] rounded-2xl bg-white dark:bg-[#1c1f24] flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <ImagePlus
                                        size={24}
                                        className="text-gray-400 mb-1"
                                    />
                                    <span className="text-[11px] font-bold text-gray-400">
                                        {photos.length}/4
                                    </span>
                                </div>
                            </label>
                        )}

                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm border border-[#e5e5e5] dark:border-[#292e35]"
                            >
                                <img
                                    src={photo.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-[14px] font-bold text-gray-500 dark:text-gray-400">
                            사진 등록 (최대 4장)
                        </h3>
                        <button
                            onClick={() => {
                                console.log("[UI] create-canvas 이동");
                                navigate("/create-canvas");
                            }}
                            className="text-[15px] font-bold text-indigo-500 flex items-center gap-1 hover:text-indigo-600 transition-colors"
                        >
                            🎨 캔버스에서 직접 만들기
                        </button>
                    </div>

                    {photos.length > 0 && (
                        <div className="bg-white dark:bg-[#1c1f24] border border-[#e5e5e5] dark:border-[#292e35] rounded-[32px] p-6 shadow-sm mt-6 overflow-hidden relative">
                            <div className="flex flex-col items-center gap-1 mb-6">
                                <span className="text-[11px] font-black italic tracking-[3px] text-gray-400 uppercase">
                                    Step 2
                                </span>
                                <h4 className="text-[16px] font-black italic tracking-tighter uppercase">
                                    Pick Your Grid
                                </h4>
                            </div>

                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                {getAvailableLayouts().map((layout) => {
                                    const previewGridClass = (() => {
                                        switch (layout.id) {
                                            case 1:
                                                return "grid-cols-1";
                                            case 2:
                                                return "grid-cols-2";
                                            case 3:
                                                return "grid-rows-2";
                                            case 4:
                                                return "grid-cols-2 grid-rows-2";
                                            case 5:
                                                return "grid-cols-2 grid-rows-2";
                                            case 6:
                                                return "grid-cols-2 grid-rows-2";
                                            case 7:
                                                return "grid-cols-3";
                                            case 8:
                                                return "grid-cols-3 grid-rows-2";
                                            case 9:
                                                return "grid-cols-2 grid-rows-3";
                                            default:
                                                return "grid-cols-1";
                                        }
                                    })();

                                    const previewCellClass = (i) => {
                                        switch (layout.id) {
                                            case 5:
                                                return i === 0
                                                    ? "row-span-2"
                                                    : "";
                                            case 6:
                                                return i === 0
                                                    ? "col-span-2"
                                                    : "";
                                            case 8:
                                                return i === 0
                                                    ? "col-span-3"
                                                    : "";
                                            case 9:
                                                return i === 0
                                                    ? "row-span-3"
                                                    : "";
                                            default:
                                                return "";
                                        }
                                    };

                                    return (
                                        <button
                                            key={layout.id}
                                            onClick={() => {
                                                console.log(
                                                    "[UI] 레이아웃 선택 =",
                                                    layout,
                                                );
                                                setSelectedLayout(layout.id);
                                            }}
                                            className={`relative w-[4.5rem] flex flex-col items-center gap-3 transition-all duration-300 group ${
                                                selectedLayout === layout.id
                                                    ? "scale-110"
                                                    : "opacity-60 grayscale hover:opacity-100"
                                            }`}
                                        >
                                            <div
                                                className={`w-full aspect-square rounded-2xl border-2 transition-all p-1.5 ${
                                                    selectedLayout === layout.id
                                                        ? "border-black dark:border-white shadow-xl bg-gray-50 dark:bg-gray-800"
                                                        : "border-transparent bg-gray-100 dark:bg-gray-900"
                                                }`}
                                            >
                                                <div
                                                    className={`w-full h-full ${previewGridClass} gap-0.5 p-0.5 grid`}
                                                >
                                                    {Array(layout.previewCells)
                                                        .fill(0)
                                                        .map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`rounded-[2px] ${previewCellClass(i)} ${selectedLayout === layout.id ? "bg-black dark:bg-white" : "bg-gray-400"}`}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                            <span
                                                className={`text-[9px] font-black italic tracking-wider uppercase transition-all whitespace-nowrap ${
                                                    selectedLayout === layout.id
                                                        ? "text-black dark:text-white opacity-100"
                                                        : "text-gray-400 opacity-0 group-hover:opacity-100"
                                                }`}
                                            >
                                                {layout.label}
                                            </span>
                                            {selectedLayout === layout.id && (
                                                <div className="absolute -bottom-1 w-1 h-1 bg-black dark:bg-white rounded-full transition-all"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-[14px] font-bold text-gray-500 dark:text-gray-400">
                            제목
                        </h3>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                console.log(
                                    "[UI] title 변경 =",
                                    e.target.value,
                                );
                                setTitle(e.target.value);
                            }}
                            placeholder="제목을 입력하세요"
                            className="w-full h-12 px-4 bg-white dark:bg-[#1c1f24] border border-[#e5e5e5] dark:border-[#292e35] rounded-xl text-[14px] font-bold outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[14px] font-bold text-gray-500 dark:text-gray-400">
                            내용
                        </h3>
                        <textarea
                            value={content}
                            onChange={(e) => {
                                console.log(
                                    "[UI] content 변경 =",
                                    e.target.value,
                                );
                                setContent(e.target.value);
                            }}
                            placeholder="오늘의 이야기를 들려주세요 (최대 2000자)"
                            className="w-full h-48 p-4 bg-white dark:bg-[#1c1f24] border border-[#e5e5e5] dark:border-[#292e35] rounded-2xl resize-none text-[14px] font-medium leading-relaxed outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[14px] font-bold text-gray-500 dark:text-gray-400">
                        태그
                    </h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => {
                                console.log(
                                    "[UI] tagInput 변경 =",
                                    e.target.value,
                                );
                                setTagInput(e.target.value);
                            }}
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                (e.preventDefault(), handleAddTag())
                            }
                            placeholder="# 태그 입력 후 엔터"
                            className="flex-1 h-12 px-4 bg-white dark:bg-[#1c1f24] border border-[#e5e5e5] dark:border-[#292e35] rounded-xl text-[14px] font-bold outline-none focus:border-black dark:focus:border-white transition-all"
                        />
                        <button
                            onClick={handleAddTag}
                            className="px-6 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-[14px] active:scale-95 transition-all"
                        >
                            추가
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-1.5 bg-gray-100 dark:bg-[#1c1f24] text-gray-600 dark:text-gray-300 font-bold rounded-full text-[12px] flex items-center gap-2 border border-[#e5e5e5] dark:border-[#292e35]"
                                >
                                    #{tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-[#e5e5e5] dark:border-[#292e35]">
                    <h3 className="text-[14px] font-bold text-gray-500 dark:text-gray-400 mb-4 text-center">
                        공개범위 설정
                    </h3>
                    <div className="flex gap-3 max-w-sm mx-auto">
                        {[
                            { value: "private", label: "나만보기" },
                            { value: "friends", label: "글벗만" },
                            { value: "public", label: "전체공개" },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    console.log(
                                        "[UI] visibility 변경 =",
                                        option.value,
                                    );
                                    setVisibility(option.value);
                                }}
                                className={`flex-1 py-3 rounded-xl text-center transition-all font-bold text-[13px] border ${
                                    visibility === option.value
                                        ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                                        : "border-[#e5e5e5] dark:border-[#292e35] bg-white dark:bg-[#1c1f24] text-gray-400"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleComplete}
                    disabled={!content.trim() || isSubmitting}
                    className="w-full h-14 bg-black dark:bg-white text-white dark:text-black rounded-xl disabled:opacity-50 font-black italic tracking-widest text-[16px] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all uppercase"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>올리고 있어요...</span>
                        </>
                    ) : (
                        "내 스토리 올리기"
                    )}
                </button>
            </div>
        </div>
    );
}
