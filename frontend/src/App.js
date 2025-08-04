import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./Components/Header";
import Content from "./Content";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import InsightsButton from "./Components/InsightsButton";
import AuthProvider from "./Context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./Components/ScrollToTop";

function AppContent() {
    const location = useLocation();

    const hideHeaderRoutes = [
        "/dashboard/ngo-team",
        "/dashboard/volunteer",
        "/dashboard/donor",
        "/dashboard/admin",
        "/admin/inventory-log",
        "/admin/report-history",
        "/ngo/",
    ];

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
                <ScrollToTop />
                <AppContent />
                <Footer />
                <InsightsButton />
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
