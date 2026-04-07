export const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e5e5e5"/><circle cx="50" cy="37" r="19" fill="#a3b0c1"/><ellipse cx="50" cy="84" rx="30" ry="20" fill="#a3b0c1"/></svg>',
)}`;

export const DEFAULT_POST_IMAGE = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="#f3f3f3"/><rect x="110" y="160" width="80" height="60" rx="4" fill="#ccd3db"/><circle cx="130" cy="175" r="7" fill="#e5e5e5"/><polygon points="110,220 150,185 180,205 200,190 200,220" fill="#dde2e8"/></svg>',
)}`;

const isCapacitorEnv = () => {
    if (window.Capacitor?.isNativePlatform?.()) return true;
    const { hostname, port, protocol } = window.location;
    if (protocol === "capacitor:") return true;
    if (hostname === "localhost" && port === "") return true;
    return false;
};

const CAP_BACKEND = "http://10.0.2.2:8080";

export const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("data:")) return url;
    if (url.startsWith("blob:")) return url;

    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    if (isCapacitorEnv()) {
        if (url.startsWith("/uploads/")) {
            return CAP_BACKEND + "/api" + url;
        }
        if (url.startsWith("/")) return CAP_BACKEND + url;
        if (url.startsWith("uploads/")) {
            return CAP_BACKEND + "/api/" + url;
        }
        return CAP_BACKEND + "/" + url;
    }

    if (url.startsWith("/")) return url;
    return "/" + url;
};
