//reusable header section
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import "./Header.css";
import { AuthContext } from "../Context/AuthContext";

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, user } = useContext(AuthContext);

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
                    <Link to="/services">Services</Link>
                </nav>

                <div className="nav-button">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <Link to="/profile">
                                <Button
                                    text={`Welcome, ${
                                        user?.userName || "User"
                                    }`}
                                />
                            </Link>
                        </div>
                    ) : (
                        <Link to="/register">
                            <Button text="Get Started" />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
