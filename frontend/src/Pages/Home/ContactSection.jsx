import React from "react";
import "./ContactSection.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function ContactSection() {
  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Left - Write to us */}
        <div className="contact-form">
          <h2>Write to us</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Right - Get in touch */}
        <div className="contact-info">
          <div className="contact-info-content">
            <h2>Get in touch</h2>
            <div className="contact-details">
              <p>
                Call us at: <strong>+91 98765 43210</strong>
              </p>
            </div>
            <div className="social-icons">
              <a href="#">
                <FaFacebook />
              </a>
              <a href="#">
                <FaTwitter />
              </a>
              <a href="#">
                <FaInstagram />
              </a>
              <a href="#">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
