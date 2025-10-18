import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <h3>Quick Links</h3>
                <ul className="footer-links">
                    <li>
                        <Link to="/about">About Us</Link>
                    </li>
                    <li>
                        <Link to="/volunteer">Volunteer</Link>
                    </li>
                    <li>
                        <Link to="/donation">Donations</Link>
                    </li>
                    <li>
                        <Link to="/grace-app">Grace App</Link>
                    </li>
                    <li>
                        <Link to="/register-ngo">Register NGO</Link>
                    </li>
                    <li>
                        <Link to="/quiz">Quiz</Link>
                    </li>
                    <li>
                        <Link to="/impact-stories">Impact Stories</Link>
                    </li>
                    <li>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                    </li>
                </ul>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Grace. All rights reserved.</p>
                <em className="footer-quote">"Grace, from you to the world"</em>
            </div>
        </footer>
    );
}

export default Footer;
