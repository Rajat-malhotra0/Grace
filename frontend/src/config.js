const rawBackendUrl = (
    process.env.REACT_APP_BACKEND_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:3001"
).trim();
const backendUrl = rawBackendUrl.replace(/\/$/, "");

const apiPath = (process.env.REACT_APP_API_PATH || "/api").trim();
const normalizedApiPath = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
const apiBaseUrl = (
    process.env.REACT_APP_API_URL?.trim() || `${backendUrl}${normalizedApiPath}`
).replace(/\/$/, "");

const socketUrl = (process.env.REACT_APP_SOCKET_URL || backendUrl).replace(
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

    if (/^https?:\/\//i.test(path)) {
        return path
            .replace(/\/$/, "")
            .replace(/^https?:\/\/localhost:3001/i, backendUrl);
    }

    const sanitizedPath = path.startsWith("/") ? path : `/${path}`;

    if (sanitizedPath.startsWith("/api")) {
        return `${backendUrl}${sanitizedPath}`.replace(/\/$/, "");
    }

    return `${API_BASE_URL}${sanitizedPath}`.replace(/\/$/, "");
};
