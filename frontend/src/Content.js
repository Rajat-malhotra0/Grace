import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Services from "./Pages/Service/Services";
import Quiz from "./Pages/Quiz/Quiz";
function Content() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/Quiz" element={<Quiz />} />
    </Routes>
  );
}

export default Content;
