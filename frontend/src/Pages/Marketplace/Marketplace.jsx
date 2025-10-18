import React from "react";
import "./Marketplace.css";
import DonationCategories from "./DonationCategories";
import banner1 from "../../assets/marketplaceBanner.jpg";
import banner2 from "../../assets/marketplaceBanner1.jpg";
import banner3 from "../../assets/marketplaceBanner2.jpg";
import banner4 from "../../assets/marketplaceBanner3.jpg";

const Marketplace = () => {
  return (
    <div className="marketplace-container">
      <div className="banner_">
        <div className="banner-image">
          <img src={banner3} alt="Banner 1" />
        </div>
        <div className="banner-image">
          <img src={banner2} alt="Banner 2" />
        </div>
        <div className="banner-image">
          <img src={banner4} alt="Banner 3" />
        </div>
        <div className="banner-image">
          <img src={banner1} alt="Banner 4" />
        </div>

        {/* Text Overlay */}
        <div className="marketplace-overlay">
          <div className="marketplace-text">
            <h1 className="marketplace-headline">
              MARKETPLACE <em>of</em> GRACE
            </h1>
            <p className="marketplace-subtext">
              Explore real-time needs from NGOs—donate, volunteer, make an
              impact where it matters most.
            </p>
          </div>
        </div>
      </div>

      {/* Add the donation categories section */}
      <DonationCategories />
    </div>
  );
};

export default Marketplace;
