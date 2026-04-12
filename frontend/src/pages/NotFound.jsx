import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Home, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="not-found-page">
      {/* Ambient background orbs */}
      <div className="nf-orb nf-orb-1"></div>
      <div className="nf-orb nf-orb-2"></div>

      <div className="nf-content">
        {/* Animated radar / compass */}
        <div className="radar-wrap">
          <motion.div
            className="radar-ring ring-1"
            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
          />
          <motion.div
            className="radar-ring ring-2"
            animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.8, ease: 'easeOut' }}
          />
          <motion.div
            className="radar-core"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          >
            <Compass size={32} className="radar-icon" />
          </motion.div>
        </div>

        {/* Floating plane */}
        <motion.div
          className="floating-plane"
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
            x: [-5, 5, -5],
          }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        >
          <Plane size={64} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="error-code">404</p>
          <h1 className="nf-title">Lost in the Clouds</h1>
          <p className="nf-desc">
            This flight path doesn't exist. The page you're looking for has departed
            or was never on the manifest.
          </p>

          <div className="nf-actions">
            <Link to="/" className="btn-primary nf-btn">
              <Home size={18} /> Return to Home
            </Link>
            <Link to="/offers" className="nf-btn-outline">
              <Plane size={18} /> Browse Deals
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }
        .nf-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .nf-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(88,166,255,0.15), transparent);
          top: -200px; left: -200px;
          animation: orbFloat 12s ease-in-out infinite alternate;
        }
        .nf-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(188,140,255,0.12), transparent);
          bottom: -150px; right: -150px;
          animation: orbFloat 10s ease-in-out infinite alternate-reverse;
        }
        @keyframes orbFloat {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,40px) scale(1.1); }
        }
        .nf-content {
          position: relative;
          z-index: 2;
          max-width: 560px;
        }
        .radar-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
        }
        .radar-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(88,166,255,0.4);
        }
        .radar-core {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .radar-icon {
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
        }
        .floating-plane {
          color: rgba(255,255,255,0.1);
          margin-bottom: 1.5rem;
          display: inline-block;
          filter: drop-shadow(0 0 30px rgba(88,166,255,0.2));
        }
        .error-code {
          font-size: 7rem;
          font-weight: 900;
          line-height: 1;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(88,166,255,0.3));
          margin-bottom: 0.5rem;
        }
        .nf-title {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 1rem;
        }
        .nf-desc {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.7;
          max-width: 420px;
          margin: 0 auto 2.5rem;
        }
        .nf-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.75rem;
        }
        .nf-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.75rem;
          border: 1px solid var(--surface-border);
          border-radius: 10px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .nf-btn-outline:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(88,166,255,0.05);
        }
      `}</style>
    </div>
  );
};

export default NotFound;
