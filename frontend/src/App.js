import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Components/Header";
import Content from "./Content";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import AuthProvider from "./Context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Content />
                <Footer />
                <ChatBot />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Router>
        </AuthProvider>
    );
}

export default App;
