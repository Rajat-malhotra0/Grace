import React, { useState } from "react";
import "./FaqSection.css";

const faqs = [
  {
    question: "How can an NGO register on Grace?",
    answer:
      "NGOs can register by clicking the 'Join as NGO' button on the homepage, filling out the organization details, and submitting required documentation. Our team will review and verify before approval.",
  },
  {
    question: "Is there a fee for NGOs to use Grace?",
    answer:
      "No, registering and listing on Grace is completely free for NGOs. We believe in empowering change-makers without financial barriers.",
  },
  {
    question: "How do I volunteer with an NGO on Grace?",
    answer:
      "Explore the list of causes or NGOs you're passionate about. Each listing has a 'Volunteer' button to express your interest and connect directly.",
  },
  {
    question: "Can I donate to a specific NGO?",
    answer:
      "Yes. You can browse NGOs or events, and each one has a dedicated donation button with secure payment options.",
  },
  {
    question: "Is my donation tax deductible?",
    answer:
      "That depends on the NGO's tax status. NGOs that are registered under relevant charitable provisions will issue a donation receipt for tax benefits.",
  },
  {
    question: "How does Grace ensure authenticity of listed NGOs?",
    answer:
      "We manually verify all NGO documents and conduct periodic audits to ensure legitimacy and compliance with our platform standards.",
  },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-heading">Frequently asked questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span className={`faq-icon ${openIndex === index ? "open" : ""}`}>
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
