import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../api/axios';
import { Plane, Calendar, MapPin, Clock, Trash2, ArrowRight, User, Hash, Ticket, Download, CheckCircle, Star, Award, X, ShieldCheck } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import CoinAnimation from '../components/CoinAnimation';
import './Dashboard.css';

const StatCard = ({ label, value, icon: Icon, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const end = parseInt(value) || 0;
    if (end === 0) return;
    
    let start = 0;
    const duration = 800;
    const incrementTime = duration / end;
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      className="stat-card glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, backgroundColor: 'var(--surface-hover)' }}
    >
      <div className="stat-icon-wrap">
        <Icon size={20} className="text-primary" />
      </div>
      <div className="stat-info">
        <span className="stat-value">{displayValue}</span>
        <span className="stat-label">{label}</span>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const hasCelebrated = React.useRef(false); // Fix double trigger
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCentralBank, setShowCentralBank] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const justBooked = location.state?.justBooked;

    // Celebration for new booking — fires ONCE before fetch
    if (justBooked && !hasCelebrated.current) {
      const { destination, passengerName } = location.state;
      hasCelebrated.current = true;
      
      toast.success(`Trip to ${destination} Confirmed!`, { duration: 5000 });
      addNotification(`New trip to ${destination} added to your dashboard.`);
      
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Stop any previous speech
          const msg = new SpeechSynthesisUtterance();
          msg.text = `Welcome back ${passengerName}! Your journey to ${destination} is confirmed. Enjoy AeroCloud luxury!`;
          msg.rate = 0.95;
          window.speechSynthesis.speak(msg);
      }
      window.history.replaceState({}, document.title);
    }

    // Fetch with delay if just booked so DB has time to commit
    fetchBookings(justBooked);
  }, [user, navigate]);

  const fetchBookings = async (isAfterBooking = false) => {
    try {
      setLoading(true);
      // Increase delay to 2s after booking so DB has time to fully commit
      if (isAfterBooking) {
          await new Promise(r => setTimeout(r, 2000));
      }
      const res = await api.get('/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      console.error('fetchBookings error:', err.response?.data || err.message);
      toast.error('Could not load bookings. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const validBookings = (bookings || []).filter(b => b && b.flight);
  const now = new Date();
  
  // Create a copy for comparison that starts at 00:00:00
  // This ensures flights from today don't disappear immediately after departure time
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const upcomingBookings = validBookings.filter(b => {
    const depTime = new Date(b.flight.departureTime);
    return depTime >= startOfToday;
  });
  const pastBookings = validBookings.filter(b => {
    const depTime = new Date(b.flight.departureTime);
    return depTime < startOfToday;
  });
  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCheckIn = async (id) => {
    try {
      await api.put(`/bookings/${id}/checkin`);
      const booking = bookings.find(b => b._id === id);
      if ('speechSynthesis' in window && booking) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = `Check-in successful for passenger ${booking.passengerName}. Your boarding pass is now ready for download. Have a pleasant flight.`;
        msg.rate = 0.95;
        window.speechSynthesis.speak(msg);
      }
      toast.success('Check-in Successful! Boarding Pass is now available.', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#10b981',
          color: '#fff',
        },
      });
      fetchBookings(); // refresh list
    } catch (err) {
      toast.error('Check-in failed.');
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  const openCentralBank = () => {
    setShowCentralBank(true);
  };

  const handleClaimPoints = () => {
    setIsMinting(true);
    // Animation will auto-complete via its internal timer
  };

  const handleMintComplete = () => {
    setIsMinting(false);
    toast.success('1,500 AeroPoints added to your Central Bank!');
    // Ideally we would call an API here to update points
  };

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  const handleDownloadTicket = async (booking) => {
    const element = document.getElementById(`ticket-pdf-${booking._id}`);
    const opt = {
      margin:       0.5,
      filename:     `AeroCloud_BoardingPass_${booking.flight.flightNumber}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    
    // Add temporary class to make it visible strictly for html2pdf rendering
    element.style.display = 'block';
    await html2pdf().set(opt).from(element).save();
    element.style.display = 'none';
  };

  return (
    <div className="dashboard-container container section animate-fade-in">
      <header className="dashboard-header">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="welcome-tag">Traveler Dashboard</span>
          <h1 className="title">Welcome, <span className="text-gradient">{user?.name}</span></h1>
        </motion.div>
        
        <div className="stats-grid">
          <StatCard label="Upcoming Trips" value={upcomingBookings.length} icon={Plane} delay={0.1} />
          <motion.div 
            className="stat-card glass-panel central-bank-card"
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={openCentralBank}
            style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)', border: '1px solid rgba(251, 191, 36, 0.2)' }}
          >
            <div className="stat-icon-wrap" style={{ background: '#fbbf24' }}>
               <Award size={20} color="#000" />
            </div>
            <div className="stat-info">
               <span className="stat-value">{user?.loyaltyPoints || '1,250'}</span>
               <span className="stat-label">Central Bank Points</span>
            </div>
            <div className="card-shine"></div>
          </motion.div>
          
          <div className="stat-card glass-panel" style={{ minWidth: '150px' }}>
            <div className="stat-icon-wrap" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
               <Award size={20} className="text-warning" style={{ color: '#fbbf24' }} />
            </div>
            <div className="stat-info">
               <span className="stat-value">{user?.loyaltyTier || 'Gold'}</span>
               <span className="stat-label">Member Tier</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        <div className="tabs-header flex-between mb-4">
          <div className="tab-group glass-panel p-1">
            <button 
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Trips
            </button>
            <button 
              className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past Travels
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              className="flex-center py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loader"></div>
            </motion.div>
          ) : displayedBookings.length > 0 ? (
            <motion.div 
              key={activeTab}
              className="ticket-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {displayedBookings.map((booking, idx) => (
                <motion.div 
                  key={booking._id} 
                  className="airline-ticket glass-panel"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="ticket-main">
                    <div className="ticket-header">
                      <div className="airline-info">
                        <div className="airline-logo-small"><Plane size={14}/></div>
                        <span className="airline-name">{booking.flight.airline}</span>
                        <span className="flight-num">{booking.flight.flightNumber}</span>
                      </div>
                      <div className={`ticket-status ${booking.status}`}>{booking.status}</div>
                    </div>

                    <div className="ticket-route">
                      <div className="route-point origin">
                        <span className="city-code">{booking.flight.origin.substring(0, 3).toUpperCase()}</span>
                        <span className="city-name">{booking.flight.origin}</span>
                        <span className="time">{formatTime(booking.flight.departureTime)}</span>
                      </div>
                      
                      <div className="route-path">
                        <div className="path-line"></div>
                        <Plane className="path-plane" size={16} />
                        <span className="duration">Direct</span>
                      </div>

                      <div className="route-point destination">
                        <span className="city-code">{booking.flight.destination.substring(0, 3).toUpperCase()}</span>
                        <span className="city-name">{booking.flight.destination}</span>
                        <span className="time">{formatTime(booking.flight.arrivalTime)}</span>
                      </div>
                    </div>

                    <div className="ticket-footer">
                      <div className="info-item">
                        <Calendar size={14} />
                        <span>{formatDate(booking.flight.departureTime)}</span>
                      </div>
                      <div className="info-item">
                        <User size={14} />
                        <span>{booking.passengerName}</span>
                      </div>
                      <div className="info-item">
                        <Hash size={14} />
                        <span>Seat {booking.seatNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ticket-stub">
                    <div className="stub-info">
                      <span className="stub-label">Price Paid</span>
                      <span className="stub-value">{formatPrice(booking.totalPrice)}</span>
                    </div>
                    <div className="stub-actions">
                      {activeTab === 'upcoming' && (
                        <>
                          {booking.hasCheckedIn ? (
                            <button 
                              className="btn-download-ticket"
                              onClick={() => handleDownloadTicket(booking)}
                              title="Download E-Ticket"
                              style={{ background: 'transparent', color: 'var(--primary)', border: 'none', cursor: 'pointer', padding: '0.4rem', transition: '0.3s' }}
                            >
                              <Download size={18}/>
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleCheckIn(booking._id)}
                              style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}
                            >
                              <CheckCircle size={14}/> Check-in
                            </button>
                          )}
                          <button 
                            className="btn-cancel-ticket"
                            onClick={() => handleCancel(booking._id)}
                            title="Cancel Booking"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </>
                      )}
                    </div>
                    <div className="barcode"></div>
                  </div>

                  {/* Hidden PDF Boarding Pass Template */}
                  <div 
                    id={`ticket-pdf-${booking._id}`} 
                    style={{
                      display: 'none',
                      width: '850px',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      padding: '40px',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #0f172a', paddingBottom: '20px' }}>
                      <div>
                        <h1 style={{ color: '#0f172a', margin: 0, fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>AEROCLOUD</h1>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Premium Air Services</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '900', letterSpacing: '1px' }}>BOARDING PASS</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>CONFIRMATION: <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{booking._id.substring(0, 8).toUpperCase()}</span></p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                      <div style={{ flex: 1.5 }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>PASSENGER NAME</p>
                        <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>{booking.passengerName}</p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>FLIGHT</p>
                        <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{booking.flight.airline} {booking.flight.flightNumber}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '35px', background: '#f8fafc', padding: '25px 35px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ width: '200px' }}>
                        <h2 style={{ margin: 0, fontSize: '48px', color: '#0f172a', fontWeight: '900' }}>{booking.flight.origin.substring(0, 3).toUpperCase()}</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{booking.flight.origin}</p>
                        <div style={{ marginTop: '15px' }}>
                            <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>DEPARTURE</p>
                            <p style={{ margin: 0, fontWeight: '900', fontSize: '20px', color: '#0f172a' }}>{formatTime(booking.flight.departureTime)}</p>
                        </div>
                      </div>
                      
                      <div style={{ flex: 1, textAlign: 'center', padding: '0 40px', opacity: 0.4 }}>
                        <div style={{ borderBottom: '2px dashed #94a3b8', position: 'relative', top: '12px' }}></div>
                        <div style={{ background: '#f8fafc', display: 'inline-block', padding: '0 15px', position: 'relative' }}>
                            <Plane color="#0f172a" size={28} />
                        </div>
                        <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>NON-STOP</p>
                      </div>

                      <div style={{ textAlign: 'right', width: '200px' }}>
                         <h2 style={{ margin: 0, fontSize: '48px', color: '#0f172a', fontWeight: '900' }}>{booking.flight.destination.substring(0, 3).toUpperCase()}</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{booking.flight.destination}</p>
                        <div style={{ marginTop: '15px' }}>
                            <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>ARRIVAL</p>
                            <p style={{ margin: 0, fontWeight: '900', fontSize: '20px', color: '#0f172a' }}>{formatTime(booking.flight.arrivalTime)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', marginTop: '35px', paddingTop: '25px', justifyContent: 'space-between' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>DATE</p>
                        <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{formatDate(booking.flight.departureTime)}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>GATE</p>
                        <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>B-12</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>SEAT</p>
                        <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{booking.seatNumber}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>GROUP</p>
                        <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>A</p>
                      </div>
                    </div>
                    
                    <div style={{ borderTop: '2px dashed #e2e8f0', marginTop: '30px', paddingTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div style={{ opacity: 0.6 }}>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>FLIGHT INFORMATION</p>
                        <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                            <p style={{ margin: 0 }}>Gate closes 20 minutes before departure.</p>
                            <p style={{ margin: 0 }}>Please have your ID ready at the gate.</p>
                        </div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        <QRCodeCanvas 
                            value={`PASSENGER: ${booking.passengerName} | FLIGHT: ${booking.flight.flightNumber} | SEAT: ${booking.seatNumber} | REF: ${booking._id}`} 
                            size={100}
                            level={"H"}
                            includeMargin={false}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              className="empty-state glass-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon"><Calendar size={48} /></div>
              <h3>No {activeTab} trips found</h3>
              <p>Your adventures are waiting to be booked.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={() => navigate('/')}>Explore Flights</button>
                <button 
                  className="btn-secondary" 
                  onClick={() => fetchBookings(false)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '10px', cursor: 'pointer' }}
                >
                  Refresh
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
             <motion.div 
                key="map-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-4"
             >
                <div className="glass-panel p-4 mb-4">
                    <div className="flex-between mb-3">
                        <div>
                            <h3 className="m-0" style={{ fontSize: '1.2rem' }}>Live Journey Visualization</h3>
                            <p className="text-muted small">Tracking {upcomingBookings.length} upcoming destinations across the globe.</p>
                        </div>
                        <div className="map-badge">
                            <MapPin size={16} /> Beta
                        </div>
                    </div>
                    <FlightRouteMap flights={upcomingBookings.map(b => b.flight)} />
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Central Bank Modal */}
      {showCentralBank && (
        <div className="central-bank-overlay">
          <motion.div 
             className="central-bank-modal glass-panel"
             initial={{ opacity: 0, scale: 0.9, y: 50 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
          >
             <button className="close-bank" onClick={() => setShowCentralBank(false)}><X size={20}/></button>
             
             <div className="bank-header">
                <div className="bank-logo">
                   <Award size={60} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.5))' }} />
                </div>
                <h2>AeroCloud Central Bank</h2>
                <p>Your premium digital vault for travel assets</p>
             </div>

             <div className="bank-balance-card">
                <div className="balance-info">
                   <span className="balance-label">Available Balance</span>
                   <div className="balance-value">
                      <span className="coin-symbol">₹</span>
                      {user?.loyaltyPoints || '1,250'}
                   </div>
                </div>
                <button className="claim-btn" onClick={handleClaimPoints}>
                  <Download size={18} /> Claim Daily Reward
                </button>
             </div>

             <div className="bank-grid">
                <div className="bank-item">
                   <Clock size={18} />
                   <span>History</span>
                </div>
                <div className="bank-item">
                   <ShieldCheck size={18} />
                   <span>Security</span>
                </div>
                <div className="bank-item">
                   <Star size={18} />
                   <span>Benefits</span>
                </div>
             </div>
          </motion.div>
        </div>
      )}

      {/* Minting Animation Overlay */}
      {isMinting && (
        <CoinAnimation 
          type="rewards" 
          onComplete={handleMintComplete} 
          onCancel={() => setIsMinting(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
