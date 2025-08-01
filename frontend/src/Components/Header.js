import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import "./Header.css";
import "./Header2.css"; // Import the second CSS file
import { AuthContext } from "../Context/AuthContext";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, ngo } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we should use dark text (black)
  // Dark text when: scrolled OR not on homepage
  const useDarkText = scrolled || location.pathname !== "/";

  // Determine user type and dashboard route
  const getUserDashboardRoute = () => {
    // If NGO data exists, it's an NGO
    if (ngo) {
      return "/dashboard/ngo-team"; // Updated path for NGO Team Dashboard
    }

    // Check user role from the user object with proper type checking
    if (user?.role && typeof user.role === "string") {
      switch (user.role.toLowerCase()) {
        case "volunteer":
          return "/dashboard/volunteer";
        case "donor":
          return "/dashboard/donor";
        case "ngo":
          return "/dashboard/ngo-team"; // Updated path for NGO Team Dashboard
        default:
          return "/profile";
      }
    }

    // Fallback to profile if no role is found
    return "/profile";
  };

  const getUserDisplayName = () => {
    // If it's an NGO, show the organization name
    if (ngo) {
      return ngo.organizationName || ngo.name || "NGO";
    }

    // For regular users, show their name
    return user?.userName || user?.name || "User";
  };

  const getUserWelcomeText = () => {
    // If it's an NGO, show organization name
    if (ngo) {
      return `Welcome, ${ngo.organizationName || ngo.name || "NGO"}`;
    }

    // For other users, show their name with role
    const userName = user?.userName || user?.name || "User";
    const userRole =
      user?.role && typeof user.role === "string"
        ? ` (${user.role.charAt(0).toUpperCase() + user.role.slice(1)})`
        : "";

    return `Welcome, ${userName}${userRole}`;
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const servicesSection = document.querySelector(".service-section");
      if (servicesSection) {
        servicesSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const servicesSection = document.querySelector(".service-section");
        if (servicesSection) {
          servicesSection.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debug: Log user data to console (remove in production)
  console.log("User data:", user);
  console.log("NGO data:", ngo);
  console.log("Dashboard route:", getUserDashboardRoute());

  return (
    <header
      className={`grace-header ${scrolled ? "scrolled" : ""} ${
        useDarkText ? "dark-text" : ""
      }`}
    >
      <div className="header-container">
        <div className="logo">Grace</div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">Who are we?</Link>
          <Link id="services-link" to="#" onClick={handleServicesClick}>
            Services
          </Link>
          <Link to="/feed">Feed</Link>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <Link to={getUserDashboardRoute()} className="user-menu">
              <Button text={getUserWelcomeText()} />
            </Link>
          ) : (
            <Link to="/register" className="nav-button">
              <Button text="Get Started" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
