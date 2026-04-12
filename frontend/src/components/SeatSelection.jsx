import React, { useState, useEffect, useContext, useRef } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../context/SocketContext';
import './SeatSelection.css';

const SeatSelection = ({ flight, onConfirm, onCancel }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [lockedSeats, setLockedSeats] = useState([]); // Array of seat IDs locked by others
  const socket = useContext(SocketContext);
  const prevSelectedRef = useRef(null);
  
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const rowCount = 10;
  
  // ============================================================
  // 🔑 UNSPLASH API KEY — Paste your key below after getting it
  //    from: https://unsplash.com/developers
  // ============================================================
  const UNSPLASH_KEY = 'k-lu_GONBCXkGuFmfh6mYeLB6DienFd9eDM0Km3QJLg';

  // Image cache so we don't refetch same seat twice
  const [imgCache, setImgCache] = useState({});
  const [previewImg, setPreviewImg] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Get search query per seat
  const getSeatQuery = (seatId) => {
    const col = seatId.slice(-1);
    const row = parseInt(seatId);
    if (row <= 3) return 'airplane business class luxury interior';
    if (row >= 8) return 'airplane rear cabin economy interior';
    if (col === 'A' || col === 'F') return 'airplane window view clouds sky';
    if (col === 'B' || col === 'E') return 'airplane middle seat cabin interior';
    return 'airplane aisle seat cabin flight attendant';
  };

  const getSeatLabel = (seatId) => {
    const col = seatId.slice(-1);
    const row = parseInt(seatId);
    if (row <= 3) return { label: '⭐ Business Zone', desc: 'Premium business class experience.' };
    if (row >= 8) return { label: '🔚 Rear Cabin', desc: 'Rear cabin with easy crew access.' };
    if (col === 'A' || col === 'F') return { label: '🪟 Window Seat', desc: 'Amazing sky & cloud views!' };
    if (col === 'B' || col === 'E') return { label: '💺 Middle Seat', desc: 'Comfortable middle seat.' };
    return { label: '🚶 Aisle Seat', desc: 'Stretch your legs anytime!' };
  };

  const fetchSeatImage = async (seatId) => {
    // Return cached image if available
    if (imgCache[seatId]) {
      setPreviewImg(imgCache[seatId]);
      return;
    }

    // Fallback to local images if no API key set
    if (!UNSPLASH_KEY || UNSPLASH_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
      const col = seatId.slice(-1);
      const row = parseInt(seatId);
      let fallback = '/images/cabin_interior.png';
      if (row <= 3) fallback = '/images/business_class.png';
      else if (row >= 8) fallback = '/images/rear_cabin.png';
      else if (col === 'A' || col === 'F') fallback = '/images/window_view.png';
      else if (col === 'C' || col === 'D') fallback = '/images/cabin_aisle.png';
      setPreviewImg(fallback);
      return;
    }

    try {
      setPreviewLoading(true);
      const query = getSeatQuery(seatId);
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_KEY}`
      );
      const data = await res.json();
      const url = data?.urls?.small || '/images/cabin_interior.png';
      setImgCache(prev => ({ ...prev, [seatId]: url }));
      setPreviewImg(url);
    } catch {
      setPreviewImg('/images/cabin_interior.png');
    } finally {
      setPreviewLoading(false);
    }
  };


  useEffect(() => {
    fetchOccupiedSeats();

    // Socket.io real-time connection
    if (socket && flight._id) {
       socket.emit('joinFlightRoom', flight._id);

       // When someone else locks a seat
       socket.on('seatLockedByAnother', ({ seatId }) => {
          setLockedSeats(prev => {
             if (!prev.includes(seatId)) return [...prev, seatId];
             return prev;
          });
          // If the seat we selected just got locked (race condition)
          if (selectedSeat === seatId) {
             setSelectedSeat(null);
          }
       });

       // When someone else unlocks a seat
       socket.on('seatUnlocked', ({ seatId }) => {
          setLockedSeats(prev => prev.filter(s => s !== seatId));
       });

       // When a booking completes
       socket.on('seatsUpdated', ({ flightId, availableSeats }) => {
          if (flightId === flight._id) {
              fetchOccupiedSeats();
          }
       });

       return () => {
          socket.off('seatLockedByAnother');
          socket.off('seatUnlocked');
          socket.off('seatsUpdated');
       };
    }
  }, [flight._id, socket]);

  // Clean-up locked seat if unmounting
  useEffect(() => {
    return () => {
      if (prevSelectedRef.current && socket) {
         socket.emit('unlockSeat', { flightId: flight._id, seatId: prevSelectedRef.current });
      }
    };
  }, [socket, flight._id]);

  const fetchOccupiedSeats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/flights/${flight._id}/occupied-seats`);
      setOccupiedSeats(res.data.data);
    } catch (err) {
      console.error('Error fetching occupied seats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.isOccupied || lockedSeats.includes(seat.id)) return;
    
    // Unlock previously selected seat if any
    if (selectedSeat) {
       socket?.emit('unlockSeat', { flightId: flight._id, seatId: selectedSeat });
    }

    if (seat.id === selectedSeat) {
       setSelectedSeat(null);
       prevSelectedRef.current = null;
    } else {
       setSelectedSeat(seat.id);
       prevSelectedRef.current = seat.id;
       socket?.emit('lockSeat', { flightId: flight._id, seatId: seat.id });
    }
  };

  const isSeatOccupied = (id) => occupiedSeats.includes(id) || lockedSeats.includes(id);

  return (
    <div className="modal-overlay flex-center">
      <motion.div 
        className="seat-selection-card glass-panel shadow-2xl"
        style={{ position: 'relative' }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Seat Preview Window (Hover Effect) - INSIDE card for correct positioning */}
        <AnimatePresence>
          {hoveredSeat && previewImg && (() => {
            const { label, desc } = getSeatLabel(hoveredSeat);
            return (
              <motion.div 
                key={hoveredSeat}
                className="seat-view-preview"
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
              >
                <div className="preview-label">{label}: {hoveredSeat}</div>
                <div className="preview-image-wrap">
                  {previewLoading ? (
                    <div className="preview-img-loader">
                      <div className="loader sm"></div>
                    </div>
                  ) : (
                    <img src={previewImg} alt={label} />
                  )}
                  <div className="preview-overlay"></div>
                </div>
                <p className="preview-desc">{desc}</p>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <div className="modal-header flex-between mb-4">
          <div>
            <h2 className="title-sm text-gradient">Cabin Selection</h2>
            <p className="text-muted text-xs uppercase tracking-widest">{flight.airline} • {flight.flightNumber}</p>
          </div>
          <button className="close-btn-circle" onClick={onCancel}><X size={18}/></button>
        </div>

        <div className="plane-cabin-container">
          <div className="cabin-glow"></div>
          <div className="plane-cabin">
            <div className="cabin-nose">
              <div className="cockpit-window"></div>
            </div>
            
            <div className="seats-layout">
              <div className="row-headers">
                 {Array.from({length: rowCount}).map((_, i) => (
                   <div key={i} className="row-num-tag">{i + 1}</div>
                 ))}
              </div>
              
              <div className="seats-area">
                {rows.map((letter, colIndex) => (
                  <React.Fragment key={letter}>
                    <div className="seat-column">
                      {Array.from({length: rowCount}).map((_, rowIndex) => {
                        const id = `${rowIndex + 1}${letter}`;
                        const isOccupied = isSeatOccupied(id);
                        const isSelected = selectedSeat === id;
                        const isLockedByAnother = lockedSeats.includes(id);
                        
                        return (
                          <motion.div 
                            key={id}
                            className={`seat-pod ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''} ${isLockedByAnother ? 'locked-pulse' : ''}`}
                            onClick={() => handleSeatClick({id, isOccupied: isOccupied || isLockedByAnother})}
                            onMouseEnter={() => { if (!isOccupied) { setHoveredSeat(id); fetchSeatImage(id); } }}
                            onMouseLeave={() => { setHoveredSeat(null); setPreviewImg(null); }}
                            whileHover={!isOccupied ? { scale: 1.1, zIndex: 10 } : {}}
                            whileTap={!isOccupied ? { scale: 0.9 } : {}}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (rowIndex * 0.05) + (colIndex * 0.02) }}
                          >
                            <div className="seat-cushion"></div>
                            <div className="seat-headrest"></div>
                            <span className="seat-id-label">{id}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                    {colIndex === 2 && <div className="cabin-aisle"><span>AISLE</span></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="cabin-legend flex-center gap-5 mt-6">
          <div className="legend-item"><div className="seat-mini"></div> <span>Available</span></div>
          <div className="legend-item"><div className="seat-mini occupied"></div> <span>Occupied</span></div>
          <div className="legend-item"><div className="seat-mini locked-pulse"></div> <span>Being Booked</span></div>
          <div className="legend-item"><div className="seat-mini selected"></div> <span>Selected</span></div>
        </div>

        <div className="selection-footer mt-6">
          <div className="footer-stats flex-between mb-4">
            <div className="stat-box">
              <span className="label">Assignment</span>
              <span className="value text-gradient">{selectedSeat || '--'}</span>
            </div>
            <div className="stat-box text-right">
              <span className="label">Class Total</span>
              <span className="value">${flight.price}</span>
            </div>
          </div>
          
          <button 
            className={`btn-confirm-selection ${(!selectedSeat || loading) ? 'disabled' : ''}`}
            disabled={!selectedSeat || loading}
            onClick={() => onConfirm(selectedSeat)}
          >
            {loading ? <div className="loader xs"></div> : <CheckCircle size={18} />}
            {loading ? 'Syncing...' : 'Confirm Seat Selection'}
          </button>
          
          <div className="footer-tip">
            <Info size={12}/> Select your preferred seat for the {flight.origin} to {flight.destination} journey.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SeatSelection;
