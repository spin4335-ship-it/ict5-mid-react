import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";

import {
    ArrowLeft,
    Plus,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    User,
    HelpCircle,
    Pencil,
    Trash2,
    Check,
    X,
} from "lucide-react";

import { qnaService } from "@/api/qnaService";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

export default function QnaPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showAlert, showConfirm } = useAlert();

    const [qnas, setQnas] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [isWriting, setIsWriting] = useState(false);

    const [newTitle, setNewTitle] = useState("");

    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        const loadQnas = async () => {
            try {
                const data = await qnaService.getQnas(1, 20);
                const items = (data?.content ?? data ?? []).map((q) => ({
                    id: q.id,
                    userId: q.userId ?? "",
                    userName: (q.username ?? "USER").toString().toUpperCase(),
                    title: q.title,
                    content: q.content,
                    date: q.createdAt
                        ? q.createdAt.slice(0, 10).replace(/-/g, ".")
                        : "",
                    isExpanded: false,
                    comments: [],
                }));
                setQnas(items);
                const commentsMap = {};
                await Promise.all(
                    items.map(async (q) => {
                        const data = await qnaService.getComments(q.id);
                        commentsMap[q.id] = data;
                    }),
                );
                setComments(commentsMap);
            } catch (e) {
                console.error("QnA 목록 로드 실패", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadQnas();
    }, []);

    const toggleExpand = (id) => {
        setQnas(
            qnas.map((q) =>
                q.id === id ? { ...q, isExpanded: !q.isExpanded } : q,
            ),
        );
    };

    const handleCreate = async () => {
        if (!newTitle || !newContent) return;
        try {
            const created = await qnaService.createQna({
                title: newTitle,
                content: newContent,
            });
            const newQna = {
                id: created.id,
                userId: created.userId ?? "",
                userName: (created.username ?? "ME").toString().toUpperCase(),
                title: created.title,
                content: created.content,
                date: created.createdAt
                    ? created.createdAt.slice(0, 10).replace(/-/g, ".")
                    : "",
                isExpanded: false,
            };
            setQnas([newQna, ...qnas]);
        } catch (e) {
            console.error("QnA 생성 실패", e);
            showAlert("질문 등록에 실패했습니다.", "등록실패", "alert");
        } finally {
            setNewTitle("");
            setNewContent("");
            setIsWriting(false);
        }
    };

    const [commentText, setCommentText] = useState({});

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const [comments, setComments] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");

    const handleAddComment = async (qnaId) => {
        const text = commentText[qnaId]?.trim();
        if (!text) return;

        try {
            const created = await qnaService.createComment(qnaId, text);
            setComments((prev) => ({
                ...prev,
                [qnaId]: [...(prev[qnaId] ?? []), created],
            }));
            setCommentText((prev) => ({ ...prev, [qnaId]: "" }));
        } catch (e) {
            console.error("댓글 등록 실패", e);
        }
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    const handleUpdateComment = async (qnaId, commentId) => {
        const text = editingCommentText.trim();
        if (!text) return;

        try {
            await qnaService.deleteComment(commentId);
            const created = await qnaService.createComment(qnaId, text);
            setComments((prev) => ({
                ...prev,
                [qnaId]: (prev[qnaId] ?? []).map((c) =>
                    c.id === commentId ? created : c,
                ),
            }));
            setEditingCommentId(null);
            setEditingCommentText("");
        } catch (e) {
            console.error("댓글 수정 실패", e);
            showAlert("질문 수정에 실패했습니다.", "수정실패", "alert");
        }
    };

    const handleDeleteComment = async (qnaId, commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await qnaService.deleteComment(commentId);
            setComments((prev) => ({
                ...prev,
                [qnaId]: (prev[qnaId] ?? []).filter((c) => c.id !== commentId),
            }));
        } catch (e) {
            console.error("댓글 삭제 실패", e);
            showAlert("질문 삭제에 실패했습니다.", "삭제실패", "alert");
        }
    };

    const currentUserId = user?.id;

    const startEdit = (q) => {
        setEditingId(q.id);
        setEditTitle(q.title);
        setEditContent(q.content);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
    };

    const handleUpdate = async () => {
        if (!editTitle || !editContent) return;
        try {
            const updated = await qnaService.updateQna(editingId, {
                title: editTitle,
                content: editContent,
            });
            setQnas(
                qnas.map((q) =>
                    q.id === editingId
                        ? {
                              ...q,
                              title: updated.title,
                              content: updated.content,
                          }
                        : q,
                ),
            );
            showAlert("질문이 수정되었습니다.", "완료", "success");
            cancelEdit();
        } catch (e) {
            console.error("QnA 수정 실패", e);
            showAlert("질문 수정에 실패했습니다.", "오류", "alert");
        }
    };

    const handleDelete = (id) => {
        showConfirm({
            message:
                "정말로 이 질문을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.",
            title: "질문 삭제",
            type: "alert",
            confirmText: "삭제",
            cancelText: "취소",
            onConfirm: async () => {
                try {
                    await qnaService.deleteQna(id);
                    setQnas(qnas.filter((q) => q.id !== id));
                    showAlert("질문이 삭제되었습니다.", "완료", "success");
                } catch (e) {
                    console.error("QnA 삭제 실패", e);
                    showAlert("질문 삭제에 실패했습니다.", "오류", "alert");
                }
            },
        });
    };

    return (
        <ResponsiveLayout showTabs={false}>
            <div className="flex flex-col min-h-screen bg-[#f9f9fa] dark:bg-[#101215] text-black dark:text-[#e5e5e5]">
                <div className="flex items-center justify-between h-14 px-4 bg-white dark:bg-[#1c1f24] border-b border-[#e5e5e5] dark:border-[#292e35] sticky top-0 z-40">
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-[16px]">Q&A 게시판</h1>

                    <button
                        onClick={() => setIsWriting(!isWriting)}
                        className="p-2 text-black"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-4 p-4 pb-24">
                    {isLoading && (
                        <div className="py-10 text-center text-[13px] font-bold text-[#a3b0c1] italic uppercase tracking-widest animate-pulse">
                            Loading...
                        </div>
                    )}

                    {isWriting && (
                        <div className="bg-white dark:bg-[#1c1f24] rounded-2xl p-6 border border-black dark:border-[#e5e5e5] shadow-xl animate-in fade-in slide-in-from-top-2">
                            <h2 className="text-[12px] font-black italic tracking-widest uppercase mb-4">
                                NEW QUESTION
                            </h2>

                            <input
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full mb-3 p-3 bg-[#f3f3f3] dark:bg-[#292e35] text-black dark:text-[#e5e5e5] rounded-xl text-[14px] font-bold outline-none border border-transparent focus:border-black dark:focus:border-[#e5e5e5]"
                            />

                            <textarea
                                placeholder="질문 내용을 입력하세요"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                className="w-full h-32 p-3 bg-[#f3f3f3] dark:bg-[#292e35] text-black dark:text-[#e5e5e5] rounded-xl text-[14px] font-medium outline-none border border-transparent focus:border-black dark:focus:border-[#e5e5e5] resize-none"
                            ></textarea>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setIsWriting(false)}
                                    className="flex-1 h-12 rounded-xl bg-[#f3f3f3] dark:bg-[#292e35] dark:text-[#e5e5e5] font-bold text-[14px]"
                                >
                                    취소
                                </button>

                                <button
                                    onClick={handleCreate}
                                    className="flex-1 h-12 rounded-xl bg-black text-white font-black italic tracking-widest uppercase text-[14px]"
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {qnas.map((q) => {
                            const isAuthor =
                                String(currentUserId) === String(q.userId);
                            const isEditing = editingId === q.id;

                            return (
                                <div
                                    key={q.id}
                                    className="bg-white dark:bg-[#1c1f24] rounded-2xl border border-[#f3f3f3] dark:border-[#292e35] overflow-hidden transition-all shadow-sm hover:border-[#ccd3db]"
                                >
                                    <div
                                        onClick={() => toggleExpand(q.id)}
                                        className="p-5 flex items-start gap-4 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 bg-[#f3f3f3] dark:bg-[#292e35] rounded-xl flex items-center justify-center shrink-0">
                                            <User
                                                size={20}
                                                className="text-[#a3b0c1]"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {isAuthor && (
                                                    <span className="text-[10px] font-black italic tracking-tighter text-white bg-black dark:bg-[#e5e5e5] dark:text-black px-1.5 py-0.5 rounded">
                                                        ME
                                                    </span>
                                                )}

                                                <span className="text-[11px] font-black italic tracking-tighter text-[#a3b0c1] uppercase">
                                                    {q.userName}
                                                </span>

                                                <span className="text-[10px] text-[#ccd3db]">
                                                    {q.date}
                                                </span>
                                            </div>

                                            <h3 className="text-[15px] font-bold text-black dark:text-[#e5e5e5] truncate">
                                                {q.title}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {isAuthor && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            startEdit(q);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e5e5e5] dark:border-[#292e35] text-[12px] font-bold text-black dark:text-[#e5e5e5] hover:bg-[#f3f3f3] dark:hover:bg-[#292e35] transition-colors"
                                                    >
                                                        <Pencil size={13} />
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(q.id);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e5e5e5] dark:border-[#292e35] text-[12px] font-bold text-black dark:text-[#e5e5e5] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-300 transition-colors"
                                                    >
                                                        <Trash2 size={13} />
                                                        삭제
                                                    </button>
                                                </>
                                            )}
                                            <div className="text-[#ccd3db]">
                                                {q.isExpanded ? (
                                                    <ChevronUp size={20} />
                                                ) : (
                                                    <ChevronDown size={20} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="px-5 pb-5 border-t border-[#f3f3f3] dark:border-[#292e35] animate-in fade-in duration-300">
                                            <div className="pt-4">
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) =>
                                                        setEditTitle(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full mb-3 p-3 bg-[#f3f3f3] dark:bg-[#292e35] text-black dark:text-[#e5e5e5] rounded-xl text-[14px] font-bold outline-none border border-transparent focus:border-black dark:focus:border-[#e5e5e5]"
                                                    placeholder="제목을 입력하세요"
                                                />
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) =>
                                                        setEditContent(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full h-32 p-3 bg-[#f3f3f3] dark:bg-[#292e35] text-black dark:text-[#e5e5e5] rounded-xl text-[14px] font-medium outline-none border border-transparent focus:border-black dark:focus:border-[#e5e5e5] resize-none"
                                                    placeholder="질문 내용을 입력하세요"
                                                />
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex-1 h-10 rounded-xl bg-[#f3f3f3] dark:bg-[#292e35] dark:text-[#e5e5e5] font-bold text-[13px]"
                                                    >
                                                        취소
                                                    </button>
                                                    <button
                                                        onClick={handleUpdate}
                                                        className="flex-1 h-10 rounded-xl bg-black text-white font-black italic tracking-widest uppercase text-[13px]"
                                                    >
                                                        수정
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {q.isExpanded && !isEditing && (
                                        <div className="px-5 pb-5 border-t border-[#fcfcfc] animate-in fade-in duration-300">
                                            <div className="py-4 text-[14px] leading-relaxed text-[#424a54] font-medium whitespace-pre-wrap">
                                                {q.content}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-[#f3f3f3]">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <MessageCircle
                                                        size={14}
                                                        className="text-black"
                                                    />
                                                    <span className="text-[12px] font-black italic tracking-widest uppercase">
                                                        답변 (
                                                        {
                                                            (
                                                                comments[
                                                                    q.id
                                                                ] ?? []
                                                            ).length
                                                        }
                                                        )
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-4 mb-6">
                                                    {(comments[q.id] ?? [])
                                                        .length > 0 ? (
                                                        (
                                                            comments[q.id] ?? []
                                                        ).map((c) => (
                                                            <div
                                                                key={c.id}
                                                                className="bg-[#f9f9fa] dark:bg-[#101215] p-4 rounded-xl border border-[#f3f3f3] dark:border-[#292e35]"
                                                            >
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span
                                                                        className={`text-[11px] font-black italic tracking-tighter uppercase ${c.username === "ADMIN" ? "text-blue-600" : "text-black"}`}
                                                                    >
                                                                        {
                                                                            c.username
                                                                        }
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] text-[#ccd3db] font-bold">
                                                                            {c.createdAt
                                                                                ?.slice(
                                                                                    0,
                                                                                    10,
                                                                                )
                                                                                .replace(
                                                                                    /-/g,
                                                                                    ".",
                                                                                )}
                                                                        </span>
                                                                        {editingCommentId !==
                                                                            c.id && (
                                                                            <div className="flex items-center gap-1">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleEditComment(
                                                                                            c,
                                                                                        )
                                                                                    }
                                                                                    className="p-1 text-[#a3b0c1] hover:text-black dark:hover:text-[#e5e5e5] transition-colors"
                                                                                >
                                                                                    <Pencil
                                                                                        size={
                                                                                            12
                                                                                        }
                                                                                    />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleDeleteComment(
                                                                                            q.id,
                                                                                            c.id,
                                                                                        )
                                                                                    }
                                                                                    className="p-1 text-[#a3b0c1] hover:text-red-500 transition-colors"
                                                                                >
                                                                                    <Trash2
                                                                                        size={
                                                                                            12
                                                                                        }
                                                                                    />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {editingCommentId ===
                                                                c.id ? (
                                                                    <div className="flex gap-2 mt-1">
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                editingCommentText
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setEditingCommentText(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            className="flex-1 h-9 px-3 bg-white dark:bg-[#1c1f24] text-black dark:text-[#e5e5e5] rounded-lg text-[13px] font-medium outline-none border border-[#ccd3db] dark:border-[#424a54] focus:border-black dark:focus:border-[#e5e5e5]"
                                                                        />
                                                                        <button
                                                                            onClick={() =>
                                                                                handleUpdateComment(
                                                                                    q.id,
                                                                                    c.id,
                                                                                )
                                                                            }
                                                                            className="p-1.5 text-green-600 hover:text-green-700 transition-colors"
                                                                        >
                                                                            <Check
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                        <button
                                                                            onClick={
                                                                                handleCancelEdit
                                                                            }
                                                                            className="p-1.5 text-[#a3b0c1] hover:text-red-500 transition-colors"
                                                                        >
                                                                            <X
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-[13px] font-medium text-[#424a54]">
                                                                        {
                                                                            c.content
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-[12px] text-[#ccd3db] font-bold italic text-center py-2 uppercase">
                                                            답변 대기 중
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="답변을 입력하세요..."
                                                        value={
                                                            commentText[q.id] ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setCommentText({
                                                                ...commentText,
                                                                [q.id]: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="flex-1 h-10 px-4 bg-[#f3f3f3] dark:bg-[#292e35] text-black dark:text-[#e5e5e5] rounded-xl text-[13px] font-medium outline-none border border-transparent focus:border-black dark:focus:border-[#e5e5e5]"
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            handleAddComment(
                                                                q.id,
                                                            )
                                                        }
                                                        className="px-4 h-10 bg-black text-white rounded-xl text-[11px] font-black italic tracking-widest uppercase"
                                                    >
                                                        등록
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {!isWriting && qnas.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-white dark:bg-[#1c1f24] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#f3f3f3] dark:border-[#292e35]">
                                <HelpCircle
                                    size={32}
                                    className="text-[#ccd3db]"
                                />
                            </div>
                            <p className="text-[14px] font-bold text-[#a3b0c1] uppercase italic tracking-widest">
                                No questions yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ResponsiveLayout>
    );
}
