import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gov-footer">

      {/* ── Main Footer ── */}
      <div className="footer-main">
        <div className="footer-main-inner">

          {/* Branding */}
          <div className="footer-brand">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Government of India Emblem"
              className="footer-emblem"
            />
            <div>
              <p className="footer-hindi">ग्राम पंचायत ई-गवर्नेंस पोर्टल</p>
              <p className="footer-title">Gram Panchayat E-Governance Portal</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/dashboard">Home</Link></li>
              <li><Link to="/certificates">Certificates</Link></li>
              <li><Link to="/taxes">Tax Payment</Link></li>
              <li><Link to="/complaints">Grievances</Link></li>
              <li><Link to="/schemes">Schemes</Link></li>
              <li><Link to="/funds">Fund Transparency</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact & Support</h4>
            <ul>
              <li>Helpline: <strong>1800-123-4567</strong></li>
              <li>support@grampanchayat.gov.in</li>
              <li>Mon – Fri, 9:00 AM – 6:00 PM</li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <p>© {currentYear} Gram Panchayat E-Governance Portal | Government of India | All Rights Reserved</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <span>|</span>
          <a href="#terms">Terms &amp; Conditions</a>
          <span>|</span>
          <a href="#sitemap">Site Map</a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
