const isProduction = process.env.NODE_ENV === "production";

const rawBackendUrl = (
    process.env.REACT_APP_BACKEND_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:3001"
).trim();

// In production with Netlify rewrites, the backend is relative (same origin)
const backendUrl = isProduction ? "" : rawBackendUrl.replace(/\/$/, "");

const apiPath = (process.env.REACT_APP_API_PATH || "/api").trim();
const normalizedApiPath = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;

// API Base URL
const apiBaseUrl = (
    process.env.REACT_APP_API_URL?.trim() || `${backendUrl}${normalizedApiPath}`
).replace(/\/$/, "");

const socketUrl = (process.env.REACT_APP_SOCKET_URL || (isProduction ? window.location.origin : backendUrl)).replace(
    /\/$/,
    ""
);

export const BACKEND_URL = backendUrl;
export const API_BASE_URL = apiBaseUrl;
export const API_URL = apiBaseUrl;
export const SOCKET_URL = socketUrl;
export const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || "";

export const withApiBase = (path = "") => {
    if (!path) return API_BASE_URL;

    // If path is already a full URL, return it
    if (/^https?:\/\//i.test(path)) {
        if (!isProduction) {
            return path
                .replace(/\/$/, "")
                .replace(/^https?:\/\/localhost:3001/i, backendUrl || "http://localhost:3001");
        }
        return path;
    }

    const sanitizedPath = path.startsWith("/") ? path : `/${path}`;

    // If path starts with /api, append to backendUrl (which is empty in prod, so it becomes /api/...)
    if (sanitizedPath.startsWith("/api")) {
        return `${backendUrl}${sanitizedPath}`.replace(/\/$/, "");
    }

    return `${API_BASE_URL}${sanitizedPath}`.replace(/\/$/, "");
};
