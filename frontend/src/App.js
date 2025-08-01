import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Header from "./Components/Header";
import Content from "./Content";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import AuthProvider from "./Context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
    const location = useLocation();

    // Define routes where header should NOT be shown
    const hideHeaderRoutes = [
        "/dashboard/ngo-team",
        "/dashboard/volunteer",
        // "/dashboard/donor",
        // "/dashboard/ngo-admin",
    ];

    // Check if current path starts with any dashboard route
    const shouldHideHeader = hideHeaderRoutes.some((route) =>
        location.pathname.startsWith(route)
    );

    return (
        <>
            {!shouldHideHeader && <Header />}
            <Content />
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
                <Footer />
                <ChatBot />
                <ToastContainer
                    position="top-right"
                    autoClose={8000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    limit={3}
                />
            </Router>
        </AuthProvider>
    );
}

export default App;
