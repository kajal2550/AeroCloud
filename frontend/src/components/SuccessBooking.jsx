import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SuccessBooking.css';

const SuccessBooking = ({ seatNumber, onClose }) => {
  return (
    <div className="modal-overlay flex-center">
      <div className="success-card glass-panel text-center animate-fade-in">
        <div className="success-icon-wrap mb-4">
          <CheckCircle size={80} className="success-icon" />
        </div>
        <div className="success-badge">Success</div>
        <h2 className="title-sm mb-2">Booking Confirmed!</h2>
        <p className="text-muted mb-4">Your journey with AeroCloud has been secured.</p>
        
        <div className="ticket-summary">
          <div className="ticket-detail-row border-b-theme">
             <span className="td-label">Seat Number</span>
             <span className="td-value text-gradient">{seatNumber}</span>
          </div>
          <div className="ticket-detail-row">
             <span className="td-label">Status</span>
             <span className="td-value text-success">Confirmed</span>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/dashboard" className="btn-primary w-full flex-center gap-2">
            Go to Dashboard <ArrowRight size={18}/>
          </Link>
          <button onClick={onClose} className="btn-secondary w-full">
            Book Another Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessBooking;
