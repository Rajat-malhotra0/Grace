import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import "./Header.css";
import { AuthContext } from "../Context/AuthContext";

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

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

    return (
        <header className={`grace-header ${scrolled ? "scrolled" : ""}`}>
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
                        <Link to="/profile" className="user-menu">
                            <Button
                                text={`Welcome, ${user?.userName || "User"}`}
                            />
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
