import React, { useState, useContext, useEffect } from 'react';
import { Search, Plane, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../context/SocketContext';
import api from '../api/axios';
import FlightTrackerMap from '../components/FlightTrackerMap';
import './FlightStatus.css';

const FlightStatus = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket || !status) return;

    const handleFlightUpdated = (updatedFlight) => {
      if (updatedFlight._id === status._id) {
        setStatus({
          ...status,
          state: updatedFlight.status || 'On Time',
          departure: new Date(updatedFlight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          arrival: new Date(updatedFlight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    };

    socket.on('flightUpdated', handleFlightUpdated);
    return () => socket.off('flightUpdated', handleFlightUpdated);
  }, [socket, status]);

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!flightNumber) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/flights?flightNumber=${flightNumber.toUpperCase()}`);
      if (res.data.data.length > 0) {
        const flight = res.data.data[0];
        setStatus({
          _id: flight._id,
          number: flight.flightNumber,
          airline: flight.airline,
          origin: flight.origin,
          destination: flight.destination,
          departure: new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          arrival: new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          state: flight.status || 'On Time',
          gate: 'TBD',
          terminal: 'TBD'
        });
      } else {
        setStatus(null);
        alert('Flight not found');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching flight status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-container container section animate-fade-in">
      <div className="status-header text-center mb-5">
        <h1 className="title">Flight <span className="text-gradient">Status</span></h1>
        <p className="text-muted">Real-time updates on your journey</p>
      </div>

      <motion.div 
        className="status-search-box glass-panel mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <form onSubmit={handleCheckStatus} className="status-form">
          <div className="input-group">
            <label className="input-label">Flight Number</label>
            <div className="status-input-wrap">
              <Plane size={18} className="p-icon" />
              <input 
                type="text" 
                placeholder="e.g. AC101" 
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {loading ? <div className="loader sm"></div> : <><Search size={18} /> Check Status</>}
          </motion.button>
        </form>
      </motion.div>

      <AnimatePresence>
        {status && (
          <motion.div 
            className="status-result glass-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="status-res-header">
              <div className="flight-main-info">
                <h3>{status.airline} {status.number}</h3>
                <span className={`status-badge ${status.state.toLowerCase().replace(' ', '-')}`}>
                  {status.state === 'On Time' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                  {status.state}
                </span>
              </div>
              <div className="gate-info">
                <span>Terminal <strong className="text-gradient">{status.terminal}</strong></span>
                <span>Gate <strong className="text-gradient">{status.gate}</strong></span>
              </div>
            </div>

            <div className="status-route">
              <div className="route-point">
                <span className="airport-code text-gradient text-glow">{status.origin.split('(')[1].replace(')', '')}</span>
                <span className="city-name">{status.origin.split('(')[0]}</span>
                <span className="time">{status.departure}</span>
                <span className="label">Scheduled Departure</span>
              </div>
              
              <div className="route-path">
                <div className="path-line"></div>
                <motion.div 
                   className="path-plane-wrap"
                   animate={{ x: [0, 40, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Plane size={24} className="path-plane text-primary shadow-glow" />
                </motion.div>
              </div>

              <div className="route-point text-right">
                <span className="airport-code text-gradient text-glow">{status.destination.split('(')[1].replace(')', '')}</span>
                <span className="city-name">{status.destination.split('(')[0]}</span>
                <span className="time">{status.arrival}</span>
                <span className="label">Scheduled Arrival</span>
              </div>
            </div>

            <FlightTrackerMap 
               origin={status.origin} 
               destination={status.destination} 
               status={status.state} 
            />

            <div className="status-footer">
              <p className="text-muted">Last updated: Just now</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlightStatus;
