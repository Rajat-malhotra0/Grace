import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Service from "./Pages/Service/Services";
import Quiz from "./Pages/Quiz/Quiz";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
function Content() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Service />} />
            <Route path="/Quiz" element={<Quiz />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default Content;
