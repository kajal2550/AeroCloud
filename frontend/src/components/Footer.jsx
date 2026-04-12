import React from 'react';
import { Plane, ArrowUp, Mail, Phone, MapPin, Globe, Heart, Star, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = [
    { value: '150+', label: 'Destinations' },
    { value: '1M+', label: 'Happy Travelers' },
    { value: '99.8%', label: 'On-Time Rate' },
    { value: '24/7', label: 'Support' },
  ];

  const socials = [
    { icon: <Globe size={18} />, label: 'Website', href: '#' },
    { icon: <Share2 size={18} />, label: 'Share', href: '#' },
    { icon: <Heart size={18} />, label: 'Like', href: '#' },
    { icon: <Star size={18} />, label: 'Review', href: '#' },
  ];

  return (
    <motion.footer
      className="footer-container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated top glow border */}
      <div className="footer-glow-bar" />

      <div className="container">

        {/* Stats Strip */}
        <div className="footer-stats">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="stat-val text-gradient">{s.value}</span>
              <span className="stat-lbl">{s.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="footer-divider" />

        {/* Main Grid */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <motion.div
              className="footer-logo"
              whileHover={{ scale: 1.03 }}
              onClick={scrollToTop}
            >
              <Plane className="footer-logo-icon" size={22} />
              <h2 className="text-gradient">AeroCloud</h2>
            </motion.div>
            <p className="footer-desc">
              Redefining air travel with premium experiences and seamless booking technology for the modern traveler.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={14} />
                <span>support@aerocloud.in</span>
              </div>
              <div className="contact-item">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <MapPin size={14} />
                <span>Phagwara, Punjab, India</span>
              </div>
            </div>
            <div className="social-row">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  className="social-btn"
                  title={s.label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-links">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul>
              <li><Link to="/">✈ Flights</Link></li>
              <li><Link to="/status">📡 Flight Status</Link></li>
              <li><Link to="/offers">🏷️ Offers</Link></li>
              <li><Link to="/dashboard">🗺️ My Trips</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-col-title">Support</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Baggage Policy</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-col-title">Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom flex-between">
          <p className="text-muted" style={{ fontSize: '0.82rem' }}>
            © 2026 <strong style={{ color: 'var(--primary)' }}>AeroCloud</strong> — Built with ❤️ in India
          </p>
          <motion.button
            className="back-to-top-btn"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
          >
            Back to top <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
