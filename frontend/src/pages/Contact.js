import "./Pages.css";

function Contact() {
  return (
    <div className="page-container">
      <div className="page-card">
        <div className="page-icon">📬</div>
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">We'd love to hear from you!</p>
        <div className="page-coming-soon">
          <span className="coming-soon-badge">Coming Soon</span>
        </div>
        <p className="page-description">
          Our contact form and support details are on their way. In the meantime, feel free to reach out through the channels available in the dashboard.
        </p>
      </div>
    </div>
  );
}

export default Contact;
