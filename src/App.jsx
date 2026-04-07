import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SnapFeedPage from "@/pages/feed/SnapFeedPage";
import TodayPage from "@/pages/feed/TodayPage";
import RankingPage from "@/pages/feed/RankingPage";
import FollowingPage from "@/pages/feed/FollowingPage";
import SnapDetailPage from "@/pages/feed/SnapDetailPage";
import CanvasEditorPage from "@/pages/write/CanvasEditerPage";

import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import EditProfilePage from "@/pages/profile/EditProfilePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import ChangePasswordPage from "@/pages/settings/ChangePasswordPage";
import DeleteAccountPage from "@/pages/settings/DeleteAccountPage";
import QnaPage from "@/pages/settings/QnaPage";
import FriendsPage from "@/pages/friends/FriendsPage";
import AddFriendPage from "@/pages/friends/AddFriendPage";
import FriendProfilePage from "@/pages/friends/FriendProfilePage";
import BadgesPage from "@/pages/badges/BadgesPage";
import BadgeRankingPage from "@/pages/badges/BadgeRankingPage";
import BadgeInfoPage from "@/pages/badges/BadgeInfoPage";
import CreatePage from "@/pages/write/CreatePage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import FssPage from "@/pages/fss/FssPage";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";
import EditPostPage from "@/pages/write/EditPostPage";
import KakaoCallback from "@/pages/auth/KakaoCallback";
import CreatePhotoAlbumPage from "@/pages/write/CreatePhotoAlbumPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

export default function App() {
    useEffect(() => {
        const isDark = localStorage.getItem("darkMode") === "true";
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const ProtectedRoute = ({ children }) => {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) return null;

        return isAuthenticated ? children : <Navigate to="/login" replace />;
    };

    return (
        <Routes>
            <Route path="/" element={<SnapFeedPage />} />

            <Route path="/verify-email" element={<EmailVerificationPage />} />

            <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile/edit"
                element={
                    <ProtectedRoute>
                        <EditProfilePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings/change-password"
                element={
                    <ProtectedRoute>
                        <ChangePasswordPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings/delete-account"
                element={
                    <ProtectedRoute>
                        <DeleteAccountPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings/qna"
                element={
                    <ProtectedRoute>
                        <QnaPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/friends"
                element={
                    <ProtectedRoute>
                        <FriendsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/add-friend"
                element={
                    <ProtectedRoute>
                        <AddFriendPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/friend/:friendId"
                element={
                    <ProtectedRoute>
                        <FriendProfilePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/badges"
                element={
                    <ProtectedRoute>
                        <BadgesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/badges/info"
                element={
                    <ProtectedRoute>
                        <BadgeInfoPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/badges/ranking"
                element={
                    <ProtectedRoute>
                        <BadgeRankingPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/create"
                element={
                    <ProtectedRoute>
                        <CreatePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-photo-album"
                element={
                    <ProtectedRoute>
                        <CreatePhotoAlbumPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-canvas"
                element={
                    <ProtectedRoute>
                        <CanvasEditorPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/today"
                element={
                    <ProtectedRoute>
                        <TodayPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/ranking"
                element={
                    <ProtectedRoute>
                        <RankingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/following"
                element={
                    <ProtectedRoute>
                        <FollowingPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/snap/:id"
                element={
                    <ProtectedRoute>
                        <SnapDetailPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/snap/:id/edit"
                element={
                    <ProtectedRoute>
                        <EditPostPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <NotificationsPage />
                    </ProtectedRoute>
                }
            />

            <Route path="/finance" element={<FssPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
