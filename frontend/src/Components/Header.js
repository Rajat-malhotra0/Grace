import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import "./Header.css";
import "./Header2.css";
import { AuthContext } from "../Context/AuthContext";

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, user, ngo } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const useDarkText = scrolled || location.pathname !== "/";

    const getUserDashboardRoute = () => {
        // if (ngo) {
        //     return "/dashboard/ngo-team";
        // }

        if (user?.role && Array.isArray(user.role) && user.role.length > 0) {
            if (user.role.some((role) => role.toLowerCase() === "ngomember")) {
                return "/dashboard/ngo-team";
            } else if (
                user.role.some((role) => role.toLowerCase() === "volunteer")
            ) {
                return "/dashboard/volunteer";
            } else if (
                user.role.some((role) => role.toLowerCase() === "donor")
            ) {
                return "/dashboard/donor";
            } else if (user.role.some((role) => role.toLowerCase() === "ngo")) {
                return "/dashboard/admin";
            } else if (
                user.role.some((role) => role.toLowerCase() === "admin")
            ) {
                return "/dashboard/site-admin";
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
        let userRole = "";

        if (user?.role && Array.isArray(user.role) && user.role.length > 0) {
            // Get the primary role for display (first role in array)
            const primaryRole = user.role[0];
            userRole = ` (${
                primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)
            })`;
        }

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
                const servicesSection =
                    document.querySelector(".service-section");
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
                    <Link
                        id="services-link"
                        to="#"
                        onClick={handleServicesClick}
                    >
                        Services
                    </Link>
                    <Link to="/feed">Feed</Link>
                </nav>

                <div className="nav-actions">
                    {isAuthenticated ? (
                        <Link
                            to={getUserDashboardRoute()}
                            className="user-menu"
                        >
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
