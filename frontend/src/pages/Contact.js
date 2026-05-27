import { useState } from "react";
import "./Pages.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", mobile: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="contact-page">

      {/* ===== HEADER ===== */}
      <section className="contact-header">
        <div className="contact-header-bg" />
        <div className="contact-header-content">
          <span className="contact-header-badge">Get in Touch</span>
          <h1 className="contact-header-title">Contact Us</h1>
          <p className="contact-header-subtitle">
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ===== CONTACT DETAILS ===== */}
      <section className="contact-details-section">
        <div className="contact-container">
          <div className="contact-info-row">
            <div className="contact-info-card">
              <div className="contact-info-icon">📞</div>
              <h3 className="contact-info-label">Phone</h3>
              <a href="tel:+1234567890" className="contact-info-value">+1 (234) 567-890</a>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">✉️</div>
              <h3 className="contact-info-label">Email</h3>
              <a href="mailto:hello@teamtask.com" className="contact-info-value">hello@teamtask.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section className="contact-form-section">
        <div className="contact-container">
          <div className="contact-form-wrapper">
            <h2 className="contact-form-title">Send Us a Message</h2>
            <p className="contact-form-subtitle">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {submitted && (
              <div className="contact-success">
                ✅ Your message has been sent! We'll reply shortly.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row-2col">
                <div className="form-field">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  className="form-control"
                  placeholder="+1 (234) 567-890"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control form-textarea"
                  placeholder="Write your message here..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Contact;
