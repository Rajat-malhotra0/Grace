import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({
    message,
    isVisible,
    onClose,
    duration = 8000,
    type = "success",
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case "success":
                return "✓";
            case "error":
                return "✗";
            case "info":
                return "ℹ";
            default:
                return "✓";
        }
    };

    return (
        <div className="toast-container">
            <div className={`toast toast-${type}`}>
                <div className="toast-content">
                    <div className={`toast-icon toast-icon-${type}`}>
                        {getIcon()}
                    </div>
                    <div className="toast-message">{message}</div>
                    <button className="toast-close" onClick={onClose}>
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
