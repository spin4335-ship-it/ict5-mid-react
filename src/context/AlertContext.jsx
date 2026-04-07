import React, { createContext, useContext, useState, useCallback } from "react";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
    const [alert, setAlert] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "alert",
        onConfirm: null,
        onCancel: null,
        confirmText: "확인",
        cancelText: "취소",
    });

    const closeAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, isOpen: false, onConfirm: null }));

        setTimeout(() => {
            setAlert((prev) => ({ ...prev, onConfirm: null, onCancel: null }));
        }, 200);
    }, []);

    const showAlert = useCallback((message, title = "알림", type = "alert") => {
        setAlert({
            isOpen: true,
            message,
            title: title || "알림",
            type: type || "info",
            onConfirm: null,
            onCancel: null,
            confirmText: "확인",
        });
    }, []);

    const showConfirm = useCallback(
        ({
            message,
            onConfirm,
            onCancel,
            title = "확인",
            type = "info",
            confirmText = "확인",
            cancelText = "취소",
        }) => {
            setAlert({
                isOpen: true,
                message,
                title: title || "확인",
                type: type || "info",
                onConfirm,
                onCancel,
                confirmText,
                cancelText,
            });
        },
        [],
    );

    const handleConfirm = () => {
        if (alert.onConfirm) {
            alert.onConfirm();
        }

        closeAlert();
    };

    const handleonCancel = () => {
        if (alert.onCancel) {
            alert.onCancel();
        }

        closeAlert();
    };

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm, closeAlert }}>
            {children}

            {alert.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeAlert}
                    />

                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-[320px] rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4">
                                {alert.type === "success" && (
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                )}

                                {alert.type === "info" && (
                                    <Info className="w-12 h-12 text-blue-500" />
                                )}

                                {alert.type === "alert" && (
                                    <AlertCircle className="w-12 h-12 text-red-500" />
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {alert.title}
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 text-sm break-keep mb-6 whitespace-pre-line leading-relaxed">
                                {alert.message}
                            </p>

                            <div className="flex w-full gap-3">
                                {alert.onConfirm && (
                                    <button
                                        type="button"
                                        onClick={handleonCancel}
                                        className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl active:scale-95 transition-transform"
                                    >
                                        {alert.cancelText || "취소"}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl active:scale-95 transition-transform"
                                >
                                    {alert.confirmText || "확인"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
}

export const useAlert = () => {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
