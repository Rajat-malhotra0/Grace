import React from "react";
import "./Banner.css";
import Leaf1 from "../assets/Leaf7_.svg";
import Leaf2 from "../assets/Leaf2_.svg";
import Leaf3 from "../assets/Leaf6_.svg";
import Leaf4 from "../assets/Leaf4_.svg";
import Leaf5 from "../assets/Leaf5_.svg";
import Flower1 from "../assets/flower1_.svg";
import Sparkle from "../assets/Sparkle_.svg";

const Banner = () => {
  return (
    <div className="banner">
        <img src={Leaf1} alt="leaf" className="leaf leaf-1" />
        <img src={Leaf2} alt="leaf" className="leaf leaf-2" />
        <img src={Leaf3} alt="leaf" className="leaf leaf-3" />
        <img src={Leaf4} alt="leaf" className="leaf leaf-4" />
        <img src={Leaf5} alt="leaf" className="leaf leaf-5" />
        <img src={Flower1} alt="flower" className="leaf flower-1" />
        <img src={Sparkle} alt="sparkle" className="leaf sparkle-1" />
        <img src={Sparkle} alt="sparkle" className="leaf sparkle-2" />
      <h1 className="banner-text">
      HI ADITI, <em className="banner-italic">it's so good</em> TO SEE YOU HERE!<br />
            <em className="banner-italic">We hope you're having a gentle and fulfilling day.</em> <br />
            <em className="banner-italic">Let's take on today together</em><br />
             WITH GRACE.

      </h1>
    </div>
  );
};

export default Banner;
