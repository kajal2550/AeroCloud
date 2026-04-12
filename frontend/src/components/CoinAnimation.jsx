import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './CoinAnimation.css';

const CoinAnimation = ({ onComplete, onCancel, type = 'payment' }) => {
  useEffect(() => {
    // Standard processing time for better UX
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4500); 
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="coin-anim-overlay">
      <div className="coin-anim-modal">
        {/* 3D CSS COIN - COMPLETELY SAFE & NO PACKAGES NEEDED */}
        <div className="coin-wrapper">
          <div className="css-3d-coin">
            <div className="coin-front">₹</div>
            <div className="coin-back">₹</div>
          </div>
        </div>
        
        <div className="anim-text-group">
          <h2 className="processing-title">
            {type === 'payment' ? 'Verifying Transaction...' : 'Minting Rewards...'}
          </h2>
          <p className="processing-subtitle">
            {type === 'payment' 
              ? 'Securing your seats via Razorpay Gateway' 
              : 'Adding points to your AeroBank vault'}
          </p>
        </div>
        
        <button 
          className="cancel-anim-btn" 
          onClick={onCancel || (() => window.location.reload())}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CoinAnimation;
