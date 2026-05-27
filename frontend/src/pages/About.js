import "./Pages.css";

function About() {
  return (
    <div className="page-container">
      <div className="page-card">
        <div className="page-icon">🏢</div>
        <h1 className="page-title">About Company</h1>
        <p className="page-subtitle">We're working on something exciting!</p>
        <div className="page-coming-soon">
          <span className="coming-soon-badge">Coming Soon</span>
        </div>
        <p className="page-description">
          This page will showcase our company story, mission, and the team behind TeamTask. Stay tuned!
        </p>
      </div>
    </div>
  );
}

export default About;
