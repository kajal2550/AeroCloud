import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, Edit, X, Save, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminFlights.css';

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, flightNumber }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay flex-center">
      <motion.div 
        className="glass-panel p-5 text-center max-w-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AlertTriangle size={48} className="text-error mb-3 mx-auto" />
        <h3 className="mb-2">Delete Flight?</h3>
        <p className="text-muted mb-4">Are you sure you want to delete flight <strong>{flightNumber}</strong>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={onCancel}>Cancel</button>
          <button className="btn-primary flex-1 !bg-error hover:!bg-red-600" style={{background: 'var(--error)'}} onClick={onConfirm}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminFlights = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, number: '' });
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    totalSeats: '',
    status: 'On Time'
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchFlights();
  }, [user, navigate]);

  const fetchFlights = async () => {
    try {
      const res = await api.get('/flights');
      setFlights(res.data.data);
    } catch (err) {
      toast.error('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFlightId) {
        await api.put(`/flights/${editingFlightId}`, formData);
        toast.success('Flight updated successfully! ✨');
      } else {
        await api.post('/flights', formData);
        toast.success('New flight added successfully! ✨');
      }
      
      setShowModal(false);
      setEditingFlightId(null);
      fetchFlights();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save flight');
    }
  };

  const handleEdit = (flight) => {
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    };

    setFormData({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: formatDateForInput(flight.departureTime),
      arrivalTime: formatDateForInput(flight.arrivalTime),
      price: flight.price,
      totalSeats: flight.totalSeats,
      status: flight.status || 'On Time'
    });
    setEditingFlightId(flight._id);
    setShowModal(true);
  };

  const confirmDelete = (flight) => {
    setDeleteConfirm({ open: true, id: flight._id, number: flight.flightNumber });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/flights/${deleteConfirm.id}`);
      toast.success('Flight deleted successfully');
      fetchFlights();
    } catch (err) {
      toast.error('Failed to delete flight');
    } finally {
      setDeleteConfirm({ open: false, id: null, number: '' });
    }
  };

  return (
    <div className="admin-flights container section animate-fade-in">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div className="admin-analytics grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="stat-card glass-panel p-4 flex flex-col items-center">
          <span className="text-muted text-xs uppercase tracking-widest mb-1">Total Flights</span>
          <span className="text-2xl font-bold text-gradient">{flights.length}</span>
        </div>
        <div className="stat-card glass-panel p-4 flex flex-col items-center">
          <span className="text-muted text-xs uppercase tracking-widest mb-1">Total Capacity</span>
          <span className="text-2xl font-bold text-gradient">
            {flights.reduce((acc, f) => acc + f.totalSeats, 0)}
          </span>
        </div>
        <div className="stat-card glass-panel p-4 flex flex-col items-center">
          <span className="text-muted text-xs uppercase tracking-widest mb-1">Avg Price</span>
          <span className="text-2xl font-bold text-gradient">
            ${flights.length ? (flights.reduce((acc, f) => acc + (Number(f.price) || 0), 0) / flights.length).toFixed(0) : 0}
          </span>
        </div>
      </div>

      <div className="flex-between mb-4">
        <div>
          <h1 className="title">Manage <span className="text-gradient">Flights</span></h1>
          <p className="text-muted">Control center for all active routes</p>
        </div>
        <button 
          className="btn-primary flex-center gap-2" 
          onClick={() => {
            setEditingFlightId(null);
            setFormData({
              flightNumber: '', airline: '', origin: '', destination: '',
              departureTime: '', arrivalTime: '', price: '', totalSeats: '', status: 'On Time'
            });
            setShowModal(true);
          }}
        >
          <Plus size={20} /> Add New Flight
        </button>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <div className="flex-center p-5"><div className="loader"></div></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Flight #</th>
                <th>Airline</th>
                <th>Route</th>
                <th>Price</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight._id}>
                  <td className="font-mono font-bold text-primary">{flight.flightNumber}</td>
                  <td>{flight.airline}</td>
                  <td>
                    <div className="route-cell text-sm">
                      <span className="font-semibold">{flight.origin}</span>
                      <span className="text-muted mx-2">→</span>
                      <span className="font-semibold">{flight.destination}</span>
                    </div>
                  </td>
                  <td><span className="text-gradient font-bold">${flight.price}</span></td>
                  <td>
                    <div className="flex flex-col">
                       <span className="text-xs text-muted">{flight.availableSeats}/{flight.totalSeats}</span>
                       <div className="w-16 h-1 bg-surface-border rounded-full mt-1 overflow-hidden">
                          <div 
                             className="h-full bg-primary" 
                             style={{width: `${(flight.availableSeats/flight.totalSeats)*100}%`}}
                          ></div>
                       </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${flight.status ? flight.status.toLowerCase().replace(' ', '-') : 'on-time'}`}>
                      {flight.status || 'On Time'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="text-primary hover:bg-primary/10" onClick={() => handleEdit(flight)}>
                        <Edit size={16} />
                      </button>
                      <button className="text-error hover:bg-error/10" onClick={() => confirmDelete(flight)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay flex-center">
            <motion.div 
              className="modal-content glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="modal-header flex-between mb-4">
                <h2 className="title !text-xl">{editingFlightId ? 'Update Flight Details' : 'Initialize New Entry'}</h2>
                <button className="text-muted" onClick={() => setShowModal(false)}><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Flight Number</label>
                    <input type="text" name="flightNumber" className="input-field" placeholder="AC101" required value={formData.flightNumber} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Airline</label>
                    <input type="text" name="airline" className="input-field" placeholder="AeroCloud" required value={formData.airline} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Origin</label>
                    <input type="text" name="origin" className="input-field" placeholder="London" required value={formData.origin} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Destination</label>
                    <input type="text" name="destination" className="input-field" placeholder="Tokyo" required value={formData.destination} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Departure</label>
                    <input type="datetime-local" name="departureTime" className="input-field" required value={formData.departureTime} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Arrival</label>
                    <input type="datetime-local" name="arrivalTime" className="input-field" required value={formData.arrivalTime} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Price ($)</label>
                    <input type="number" name="price" className="input-field" placeholder="299" required value={formData.price} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Total Seats</label>
                    <input type="number" name="totalSeats" className="input-field" placeholder="180" required value={formData.totalSeats} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Status</label>
                    <select name="status" className="input-field" value={formData.status} onChange={handleChange}>
                      <option value="On Time">On Time</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full mt-4 flex-center gap-2">
                  <Save size={18} /> {editingFlightId ? 'Save Changes' : 'Create Flight'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal 
        isOpen={deleteConfirm.open}
        flightNumber={deleteConfirm.number}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null, number: '' })}
      />
    </div>
  );
};

export default AdminFlights;
