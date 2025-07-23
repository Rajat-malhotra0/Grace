import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Components/Header";
import Content from "./Content";
import Footer from "./Components/Footer";
import ChatBot from "./Components/Chatbot";
import AuthProvider from "./Context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Content />
                <Footer />
                <ChatBot />
            </Router>
        </AuthProvider>
    );
}

export default App;
