import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Quiz from "./Pages/Quiz/Quiz";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
import GraceFeed from "./Pages/Feed/Feed";
import Marketplace from "./Pages/Marketplace/Marketplace";
import Donations from "./Pages/Donations/Donations";
import Engagement from "./Pages/Engagement/Engagement";
function Content() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/feed" element={<GraceFeed />} />
            <Route path="/Quiz" element={<Quiz />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/engagement" element={<Engagement />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default Content;
