import { Link } from "react-router-dom";
import "./Pages.css";

function About() {
  const stats = [
    { number: "5+", label: "Years in Business" },
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Tasks Completed" },
    { number: "25+", label: "Team Members" }
  ];

  const values = [
    {
      icon: "🤝",
      title: "Collaboration",
      desc: "We believe the best results come from working together. Our platform is built to foster seamless teamwork."
    },
    {
      icon: "⚡",
      title: "Efficiency",
      desc: "Time is your most valuable asset. We help teams streamline workflows and focus on what truly matters."
    },
    {
      icon: "🔒",
      title: "Trust & Security",
      desc: "Your data is safe with us. We maintain the highest standards of security and privacy protection."
    },
    {
      icon: "💡",
      title: "Innovation",
      desc: "We continuously evolve our platform to bring you the latest tools and features for modern teams."
    }
  ];

  const team = [
    {
      name: "Alex Rivera",
      role: "Founder & CEO",
      avatar: "AR",
      color: "#1a237e"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      avatar: "SC",
      color: "#283593"
    },
    {
      name: "Marcus Johnson",
      role: "Lead Designer",
      avatar: "MJ",
      color: "#3949ab"
    },
    {
      name: "Priya Patel",
      role: "Head of Product",
      avatar: "PP",
      color: "#5c6bc0"
    }
  ];

  return (
    <div className="about-page">

      {/* ===== HERO SECTION ===== */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-content">
          <span className="about-hero-badge">About Us</span>
          <h1 className="about-hero-title">
            Empowering Teams to <span className="text-gradient">Achieve More</span>
          </h1>
          <p className="about-hero-subtitle">
            TeamTask was born from a simple idea: make task management effortless so teams can focus on creating, 
            building, and delivering their best work.
          </p>
          <div className="about-hero-stats-mini">
            <div className="hero-stat-item">
              <span className="hero-stat-number">10K+</span>
              <span className="hero-stat-label">Users</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-number">50K+</span>
              <span className="hero-stat-label">Tasks</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-number">99.9%</span>
              <span className="hero-stat-label">Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="about-section about-mission-vision">
        <div className="about-container">
          <div className="mv-card mv-mission">
            <div className="mv-icon">🎯</div>
            <h2 className="mv-title">Our Mission</h2>
            <p className="mv-text">
              To simplify project management and empower teams of all sizes to collaborate seamlessly, 
              stay organized, and achieve their goals with confidence.
            </p>
          </div>
          <div className="mv-card mv-vision">
            <div className="mv-icon">🔭</div>
            <h2 className="mv-title">Our Vision</h2>
            <p className="mv-text">
              A world where every team — whether in the same room or across continents — can work together 
              effortlessly, turning ideas into reality without the friction of complexity.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="about-section about-stats">
        <div className="about-container">
          <h2 className="about-section-title">Company at a Glance</h2>
          <p className="about-section-subtitle">Numbers that reflect our commitment to helping teams succeed</p>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-card-about" key={index}>
                <span className="stat-about-number">{stat.number}</span>
                <span className="stat-about-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STORY SECTION ===== */}
      <section className="about-section about-story">
        <div className="about-container">
          <div className="story-content">
            <h2 className="about-section-title story-title">Our Story</h2>
            <p className="story-text">
              Founded in 2020, TeamTask started as a side project by a small group of developers who were 
              frustrated with the complexity of existing task management tools. We believed there had to be 
              a better way — a tool that was powerful enough for professionals yet simple enough for everyone.
            </p>
            <p className="story-text">
              What began as an internal tool quickly grew into something bigger. After sharing it with friends 
              and colleagues, the demand skyrocketed. Today, TeamTask helps thousands of teams around the world 
              stay organized, collaborate effectively, and ship their projects on time.
            </p>
            <p className="story-text">
              We're proud of how far we've come, but we're just getting started. Our roadmap is packed with 
              exciting features designed to make team collaboration even more powerful and intuitive.
            </p>
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section className="about-section about-values">
        <div className="about-container">
          <h2 className="about-section-title">Our Core Values</h2>
          <p className="about-section-subtitle">The principles that guide everything we do</p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div className="value-card" key={index}>
                <span className="value-icon">{value.icon}</span>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <section className="about-section about-team">
        <div className="about-container">
          <h2 className="about-section-title">Meet the Leadership</h2>
          <p className="about-section-subtitle">The passionate people behind TeamTask</p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-avatar" style={{ background: member.color }}>
                  {member.avatar}
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="about-section about-cta">
        <div className="about-cta-bg" />
        <div className="about-container cta-container">
          <h2 className="cta-title">Ready to Transform Your Workflow?</h2>
          <p className="cta-text">
            Join thousands of teams already using TeamTask to collaborate, manage tasks, and deliver results.
          </p>
          <Link to="/dashboard" className="cta-btn">
            Go to Dashboard
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;
