import React from 'react';
import { PlaneTakeoff, Clock, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import WeatherWidget from './WeatherWidget';
import { CurrencyContext } from '../context/CurrencyContext';
import { useContext } from 'react';
import './FlightCard.css';

const FlightCard = ({ flight, onBook }) => {
  const { formatPrice } = useContext(CurrencyContext);
  
  const depTime = new Date(flight.departureTime);
  const arrTime = new Date(flight.arrivalTime);
  
  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString();

  const durationMs = arrTime - depTime;
  const hours = Math.floor(durationMs / 3600000);
  
  let badge = null;
  if (flight.price <= 250) badge = "Cheapest 💰";
  else if (hours < 6) badge = "Fastest Route ⚡";
  else if (flight.airline === 'AeroCloud') badge = "Premium ✨";


  return (
    <motion.div 
      className="flight-card glass-panel"
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="fc-header flex-between">
        <div className="airline-info">
          <div className="airline-logo">
            {flight.airline.charAt(0)}
          </div>
          <span className="airline-name">{flight.airline}</span>
        </div>
        <div className="fc-right flex-col gap-2" style={{ alignItems: 'flex-end' }}>
          {badge && <div className="card-badge-inline glass-panel">{badge}</div>}
          <div className="flight-number">{flight.flightNumber}</div>
        </div>
      </div>

      
      <div className="fc-body">
        <div className="fc-route">
          <div className="route-point origin">
            <span className="rp-time text-gradient">{formatTime(depTime)}</span>
            <span className="rp-city">{flight.origin}</span>
          </div>
          
          <div className="route-duration">
            <div className="line"></div>
            <PlaneTakeoff size={18} className="duration-icon" />
            <div className="line"></div>
          </div>
          
          <div className="route-point destination">
            <span className="rp-time text-gradient">{formatTime(arrTime)}</span>
            <span className="rp-city flex-center gap-2">
              {flight.destination}
              <WeatherWidget destination={flight.destination} />
            </span>
          </div>
        </div>
      </div>
      
      <div className="fc-footer flex-between">
        <div className="fc-details">
          <div className="detail-item">
            <CalendarDays size={14} className="dt-icon"/> 
            {formatDate(depTime)}
          </div>
          <div className="detail-item price text-gradient text-glow">
            {formatPrice(flight.price)}
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary book-btn" 
          onClick={() => onBook(flight)}
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FlightCard;
