import React from 'react';
import './FlightSkeleton.css';

const FlightSkeleton = () => {
  return (
    <div className="flight-skeleton glass-panel animate-pulse">
      <div className="sk-header flex-between mb-4">
        <div className="sk-airline"></div>
        <div className="sk-number"></div>
      </div>
      <div className="sk-route flex-between mb-4">
        <div className="sk-point"></div>
        <div className="sk-line"></div>
        <div className="sk-point"></div>
      </div>
      <div className="sk-footer flex-between">
        <div className="sk-price"></div>
        <div className="sk-btn"></div>
      </div>
    </div>
  );
};

export default FlightSkeleton;
