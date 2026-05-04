import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function AboutUs() {
  const features = [
    { num: '01', title: 'Digital Certificates', desc: 'Apply online for birth, income, caste, residence, and domicile certificates with real-time status tracking.' },
    { num: '02', title: 'Tax Payment', desc: 'Calculate and pay property and water taxes online with automatic receipt generation.' },
    { num: '03', title: 'Grievance Redressal', desc: 'Register and track complaints across water, road, sanitation, health, and other categories.' },
    { num: '04', title: 'Scheme Recommendations', desc: 'Personalized government welfare scheme suggestions based on citizen profile and income.' },
    { num: '05', title: 'Fund Transparency', desc: 'Ward-wise budget allocation and expenditure tracking with visual analytics.' },
    { num: '06', title: 'Admin Dashboard', desc: 'Centralized panel for Panchayat officials to manage all applications and citizen data.' },
  ];

  const stack = [
    { label: 'Frontend',       value: 'React.js · Recharts · Socket.IO Client' },
    { label: 'Backend',        value: 'Node.js · Express.js' },
    { label: 'Database',       value: 'MongoDB · Mongoose ODM' },
    { label: 'Auth',           value: 'JWT (JSON Web Tokens) · bcryptjs' },
    { label: 'Real-time',      value: 'WebSocket via Socket.IO' },
    { label: 'File Handling',  value: 'Multer · Server Filesystem' },
  ];

  return (
    <div className="about-container">

      {/* Nav */}
      <nav className="about-nav">
        <div className="about-nav-content">
          <Link to="/dashboard" className="back-btn" title="Back to Dashboard">←</Link>
          <h1>About Us</h1>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-left">
            <span className="about-tag">Capstone Project · 2026</span>
            <h2>Gram Panchayat<br />E-Governance Portal</h2>
            <p>A digital platform built to simplify rural governance — bringing certificates, tax payments, grievances, and welfare schemes online for every citizen.</p>
            <div className="about-hero-stats">
              <div className="about-stat">
                <span>6+</span>
                <p>Services</p>
              </div>
              <div className="about-divider" />
              <div className="about-stat">
                <span>3</span>
                <p>User Roles</p>
              </div>
              <div className="about-divider" />
              <div className="about-stat">
                <span>24/7</span>
                <p>Availability</p>
              </div>
              <div className="about-divider" />
              <div className="about-stat">
                <span>100%</span>
                <p>Paperless</p>
              </div>
            </div>
          </div>
          <div className="about-hero-right">
            <div className="about-hero-card">
              <p className="ahc-label">Built With</p>
              <div className="ahc-tags">
                {['React.js','Node.js','MongoDB','Express','Socket.IO','JWT','Recharts','Multer'].map(t => (
                  <span key={t} className="ahc-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-content">

        {/* ── ABOUT ── */}
        <section className="about-section-block">
          <div className="asb-header">
            <span className="asb-tag">Overview</span>
            <h3>About the Project</h3>
          </div>
          <div className="asb-body">
            <p>The Gram Panchayat E-Governance Portal is a full-stack web application developed as a capstone project at the intersection of technology and rural governance. It digitizes core Panchayat administrative services including certificate issuance, tax collection, grievance redressal, government scheme eligibility recommendations, and financial fund transparency — eliminating manual paperwork and unnecessary office visits for rural citizens.</p>
          </div>
        </section>

        {/* ── OBJECTIVES ── */}
        <section className="about-section-block">
          <div className="asb-header">
            <span className="asb-tag">Goals</span>
            <h3>Objectives</h3>
          </div>
          <div className="asb-body">
            <div className="objectives-grid">
              {[
                'Streamline civic service delivery for rural citizens',
                'Bring transparency to fund allocation and expenditure',
                'Automate tax collection and certificate issuance',
                'Provide personalized government scheme recommendations',
                'Enable efficient grievance registration and tracking',
                'Support data-driven decision making in local governance',
              ].map((obj, i) => (
                <div key={i} className="obj-card">
                  <span className="obj-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{obj}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="about-section-block">
          <div className="asb-header">
            <span className="asb-tag">What We Built</span>
            <h3>Key Features</h3>
          </div>
          <div className="asb-body">
            <div className="features-grid">
              {features.map((f) => (
                <div key={f.num} className="feature-card">
                  <span className="feature-num">{f.num}</span>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section className="about-section-block">
          <div className="asb-header">
            <span className="asb-tag">Technology</span>
            <h3>Tech Stack</h3>
          </div>
          <div className="asb-body">
            <div className="tech-grid">
              {stack.map((s) => (
                <div key={s.label} className="tech-item">
                  <span className="label">{s.label}</span>
                  <span className="value">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="about-section-block">
          <div className="asb-header">
            <span className="asb-tag">People</span>
            <h3>Development Team</h3>
          </div>
          <div className="asb-body">
            <div className="team-grid">
              <div className="team-card">
                <img src="/images/shashi.jpeg" alt="Shashi Yadav" className="team-photo" />
                <div className="team-info">
                  <h4>Shashi</h4>
                  <p>Bachelor of Computer Applications</p>
                </div>
              </div>
              <div className="team-card">
                <img src="/images/abhishek.jpeg" alt="Abhishek Kumar" className="team-photo" />
                <div className="team-info">
                  <h4>Abhishek Kumar</h4>
                  <p>Bachelor of Computer Applications</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── IMPACT ── */}
        <div className="about-impact">
          <div className="impact-inner">
            <h3>Project Impact</h3>
            <p>By moving Panchayat services online, this portal reduces dependence on manual paperwork and office visits. Citizens can access services 24/7, track their applications in real time, and receive instant notifications — bringing faster, fairer, and more transparent local governance to rural India.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutUs;
