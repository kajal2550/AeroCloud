import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, MapPin, Calendar, Plane, Sliders, ChevronDown, CheckCircle, Mic } from 'lucide-react';
import FlightCard from '../components/FlightCard';
import FlightSkeleton from '../components/FlightSkeleton';
import SeatSelection from '../components/SeatSelection';
import PassengerForm from '../components/PassengerForm';
import PaymentModal from '../components/PaymentModal';
import CoinAnimation from '../components/CoinAnimation';
import SuccessBooking from '../components/SuccessBooking';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { SocketContext } from '../context/SocketContext';
import { NotificationContext } from '../context/NotificationContext';
import './Home.css';

const Home = () => {
  const [flights, setFlights] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [searchParams, setSearchParams] = useState({ 
    origin: '', 
    destination: '', 
    date: '',
    minPrice: '',
    maxPrice: '',
    sort: 'departureTime',
    tripType: 'one-way',
    passengers: 1,
    travelClass: 'Economy',
    returnDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [bookingFlight, setBookingFlight] = useState(null);
  const [bookingStep, setBookingStep] = useState('none'); // none, passengers, seats, payment
  const [passengerData, setPassengerData] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [confirmedSeat, setConfirmedSeat] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const socket = useContext(SocketContext);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await api.get('/destinations');
      setDestinations(res.data.data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('seatsUpdated', (data) => {
      setFlights(prevFlights => 
        prevFlights.map(flight => 
          flight._id === data.flightId 
            ? { ...flight, availableSeats: data.availableSeats }
            : flight
        )
      );
    });

    socket.on('flightUpdated', (updatedFlight) => {
      setFlights(prevFlights => 
        prevFlights.map(flight => 
          flight._id === updatedFlight._id ? updatedFlight : flight
        )
      );
      if (updatedFlight.status && updatedFlight.status !== 'On Time') {
        toast((t) => (
          <span>
            <b>Flight Update:</b> {updatedFlight.airline} {updatedFlight.flightNumber} to {updatedFlight.destination} is now <b>{updatedFlight.status}</b>.
          </span>
        ), { icon: '⚠️' });
      }
    });

    return () => {
      socket.off('seatsUpdated');
      socket.off('flightUpdated');
    };
  }, [socket]);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await api.get('/flights');
      setFlights(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      let query = '?';
      if (searchParams.origin) query += `origin=${searchParams.origin}&`;
      if (searchParams.destination) query += `destination=${searchParams.destination}&`;
      if (searchParams.date) query += `date=${searchParams.date}&`;
      if (searchParams.minPrice) query += `minPrice=${searchParams.minPrice}&`;
      if (searchParams.maxPrice) query += `maxPrice=${searchParams.maxPrice}&`;
      if (searchParams.sort) query += `sort=${searchParams.sort}`;
      
      const res = await api.get(`/flights${query}`);
      setFlights(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser doesn't support Voice Search");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Listening... Speak your destination!");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchParams({...searchParams, destination: transcript});
      toast.success(`Heard: "${transcript}"`);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      toast.error("Voice search failed");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleBook = (flight) => {
    if (!user) {
      toast.error('✈️ Please login to book a flight', {
        duration: 4000,
        style: {
          background: 'rgba(13,17,23,0.97)',
          border: '1px solid rgba(248,81,73,0.4)',
          color: '#e6edf3',
          borderRadius: '14px',
          fontSize: '0.9rem',
          fontWeight: '600',
          padding: '14px 20px',
        }
      });

      navigate('/login');
      return;
    }
    const loadingToast = toast.loading('Securing your seat...', {
      style: {
        background: 'rgba(13,17,23,0.95)',
        color: '#e6edf3',
        border: '1px solid rgba(88,166,255,0.3)',
      }
    });

    setTimeout(() => {
      toast.dismiss(loadingToast);
      setBookingFlight(flight);
      setBookingStep('passengers');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Ready to collect passenger details!', { icon: '📝' });
    }, 600);
  };

  const handlePassengerConfirm = (data) => {
    setPassengerData(data);
    setBookingStep('seats');
  };

  const handleSeatConfirm = (seatNumber) => {
    setSelectedSeat(seatNumber);
    // Navigate to our new ServiceGo-style Checkout page
    navigate('/checkout', { 
        state: { 
            flight: bookingFlight, 
            passengerData, 
            passengerCount: searchParams.passengers,
            selectedSeat: seatNumber
        } 
    });
    // Reset local booking state as we are moving to a new page
    setBookingFlight(null);
    setBookingStep('none');
  };

  const closeBooking = () => {
    setBookingFlight(null);
    setBookingStep('none');
    setPassengerData([]);
    setSelectedSeat(null);
  };

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container">
          <motion.div 
            className="hero-content text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="title">
              Elevate Your Journey<br/>
              With <motion.span 
                className="text-gradient text-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                AeroCloud
              </motion.span>
            </h1>
            <p className="hero-subtitle">Experience seamless booking and premium travel across the globe.</p>
          </motion.div>
          
          <motion.div 
            className="search-glass-panel glass-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-top-row">
                <div className="trip-type-toggle">
                  <button 
                    type="button" 
                    className={`type-btn ${searchParams.tripType === 'one-way' ? 'active' : ''}`}
                    onClick={() => setSearchParams({...searchParams, tripType: 'one-way'})}
                  >
                    One-way
                  </button>
                  <button 
                    type="button" 
                    className={`type-btn ${searchParams.tripType === 'round-trip' ? 'active' : ''}`}
                    onClick={() => setSearchParams({...searchParams, tripType: 'round-trip'})}
                  >
                    Round-trip
                  </button>
                </div>
                
                <div className="search-meta-inputs">
                  <div className="mini-input-group">
                    <select 
                      value={searchParams.passengers}
                      onChange={(e) => setSearchParams({...searchParams, passengers: e.target.value})}
                      className="mini-select"
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div className="mini-input-group">
                    <select 
                      value={searchParams.travelClass}
                      onChange={(e) => setSearchParams({...searchParams, travelClass: e.target.value})}
                      className="mini-select"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First Class</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-main-row">
                <div className="input-group">
                  <label className="input-label"><MapPin size={14}/> From</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Origin City" 
                    value={searchParams.origin}
                    onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label"><Plane size={14}/> To</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Destination City" 
                      value={searchParams.destination}
                      onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                      style={{ paddingRight: '40px', width: '100%' }}
                    />
                    <button 
                      type="button"
                      onClick={handleVoiceSearch}
                      title="Voice Search"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: isListening ? '#f87171' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%'
                      }}
                    >
                      {isListening ? <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}><Mic size={18} color="#f87171" /></motion.div> : <Mic size={18} />}
                    </button>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label"><Calendar size={14}/> {searchParams.tripType === 'round-trip' ? 'Departure' : 'Date'}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={searchParams.date}
                    onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                  />
                </div>
                {searchParams.tripType === 'round-trip' && (
                    <motion.div 
                        className="input-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <label className="input-label"><Calendar size={14}/> Return</label>
                        <input 
                            type="date" 
                            className="input-field" 
                            value={searchParams.returnDate}
                            onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
                        />
                    </motion.div>
                )}
                <div className="input-group form-submit">
                  <button type="submit" className="btn-primary search-btn"><Search size={18} /> Search</button>
                </div>
              </div>

              <div className="form-actions-row">
                <button 
                  type="button" 
                  className={`btn-filter-toggle ${showFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Sliders size={14} /> {showFilters ? 'Hide Filters' : 'More Filters'}
                </button>
                
                {showFilters && (
                  <div className="extra-filters animate-slide-down">
                    <div className="input-group">
                      <label className="input-label">Min Price ($)</label>
                      <input 
                        type="number" 
                        className="input-field sm" 
                        placeholder="0"
                        value={searchParams.minPrice}
                        onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Max Price ($)</label>
                      <input 
                        type="number" 
                        className="input-field sm" 
                        placeholder="Max"
                        value={searchParams.maxPrice}
                        onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Sort By</label>
                      <div className="select-wrapper">
                        <select 
                          className="input-field sm"
                          value={searchParams.sort}
                          onChange={(e) => {
                            setSearchParams({...searchParams, sort: e.target.value});
                            // Trigger search automatically on sort change
                            setTimeout(() => handleSearch(), 0);
                          }}
                        >
                          <option value="departureTime">Time (Earliest)</option>
                          <option value="price">Price (Low to High)</option>
                          <option value="-price">Price (High to Low)</option>
                          <option value="airline">Airline (A-Z)</option>
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
          
          <motion.div 
            className="flight-status-widget glass-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="status-widget-inner">
               <span className="text-sm text-muted">Quick Status Check: </span>
               <div className="status-input-group">
                 <input type="text" placeholder="Flight # (e.g. AC101)" className="input-field sm" />
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="btn-secondary sm" 
                   onClick={() => alert('Flight is On Time!')}
                 >
                   Check Status
                 </motion.button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section container section mb-5">
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="title">Popular <span className="text-gradient">Destinations</span></h2>
          <p className="text-muted">Discover our most frequent routes at exclusive prices.</p>
        </motion.div>
        <div className="destinations-grid">
          {destinations.length > 0 ? (
            destinations.map((dest, idx) => (
              <motion.div 
                key={dest._id || dest.id}
                className="dest-card" 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                onClick={() => { setSearchParams({...searchParams, destination: dest.id}); handleSearch(); window.scrollTo(0, 800); }}
              >
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="dest-img" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="https://images.unsplash.com/photo-1436491865332-7a61a109c05d?auto=format&fit=crop&w=1200"; // Fallback airport/travel image
                  }}
                />
                <div className="dest-content">
                  <h3>{dest.name}</h3>
                  <p className="text-sm text-gradient">Flights available</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-muted text-center w-full">Loading premium destinations...</div>
          )}
        </div>
      </section>

      {/* AeroCloud Experience Section */}
      <section className="experience-section container section mb-5">
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="title">Experience the <span className="text-gradient">AeroCloud</span> Difference</h2>
          <p className="text-muted">Why travelers trust us with their most important journeys.</p>
        </motion.div>
        <div className="experience-grid">
          {[
            { icon: <Plane size={32}/>, title: 'Premium Fleet', text: "Fly on the world's most modern and comfortable aircraft." },
            { icon: <MapPin size={32}/>, title: 'Global Destinations', text: "Connect to over 150+ cities across all six continents." },
            { icon: <Calendar size={32}/>, title: 'Easy Booking', text: "Fast, intuitive, and secure booking in just a few clicks." }
          ].map((item, idx) => (
            <motion.div 
              key={item.title}
              className="experience-card glass-panel text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -10, backgroundColor: "var(--surface-overlay-dark)", borderColor: "var(--primary)" }}
            >
              <motion.div 
                className="exp-icon-wrap"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                {item.icon}
              </motion.div>
              <h3>{item.title}</h3>
              <p className="text-muted">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Flight Results */}
      <section ref={resultsRef} className="results-section container section">
        <div className="results-header">
          <h2 className="title">Available Flights</h2>
          <p className="text-muted">Choose from our premium selection of flights curated just for you.</p>
        </div>
        
        {loading ? (
          <div className="flights-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <FlightSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div 
            className="flights-grid"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {flights.length > 0 ? (
              flights.map(flight => (
                <motion.div 
                  key={flight._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <FlightCard flight={flight} onBook={handleBook} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="glass-panel no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Plane size={48} className="text-muted mb-3" style={{opacity: 0.5}} />
                <h3>No flights found</h3>
                <p className="text-muted">Try adjusting your search criteria.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>

      {/* Booking Modal */}

      {bookingFlight && bookingStep === 'passengers' && (
        <PassengerForm 
          passengerCount={searchParams.passengers}
          onConfirm={handlePassengerConfirm}
          onCancel={closeBooking}
        />
      )}

      {bookingFlight && bookingStep === 'seats' && (
        <SeatSelection 
          flight={bookingFlight} 
          onConfirm={handleSeatConfirm}
          onCancel={() => setBookingStep('passengers')}
        />
      )}

      {/* Success Modal */}
      {confirmedSeat && (
        <SuccessBooking 
          seatNumber={confirmedSeat} 
          onClose={() => setConfirmedSeat(null)}
        />
      )}
    </div>
  );
};

export default Home;
