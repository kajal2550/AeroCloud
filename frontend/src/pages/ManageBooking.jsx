import React, { useState } from 'react';
import { Search, Ticket, Mail, AlertCircle, CalendarClock, Armchair, Luggage } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './ManageBooking.css';

const featureCards = [
  { icon: <CalendarClock size={22} />, title: 'Change Flights', desc: 'Need to reschedule? Modify your travel dates online with ease.' },
  { icon: <Armchair size={22} />, title: 'Select Seats', desc: 'Choose your preferred seat before your check-in window opens.' },
  { icon: <Luggage size={22} />, title: 'Add Baggage', desc: 'Avoid last-minute airport fees by adding extra baggage now.' },
];

const ManageBooking = () => {
    const [pnr, setPnr] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            setLoading(false);
            toast.error('Booking not found. Please check your PNR or email.', {
                icon: <AlertCircle size={18} color="#f85149" />,
                style: {
                    borderRadius: '12px',
                    background: '#161b22',
                    color: '#fff',
                    border: '1px solid rgba(248, 81, 73, 0.2)'
                }
            });
        }, 1500);
    };

    return (
        <div className="manage-booking-page animate-fade-in">
            <Toaster position="bottom-right" />
            <div className="container">
                <motion.div
                    className="manage-header text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="manage-tag">Self-Service Portal</span>
                    <h1 className="title text-gradient">Manage Your Journey</h1>
                    <p className="text-muted">Retrieve your itinerary, select seats, or make changes to your booking.</p>
                </motion.div>

                <motion.div
                    className="manage-card glass-panel"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <form onSubmit={handleSearch} className="manage-form">
                        <div className="form-sections">
                            <div className="form-group">
                                <label className="input-label">Booking Reference (PNR)</label>
                                <div className="p-input-wrap">
                                    <Ticket size={18} className="p-icon" />
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="e.g. ABC123" 
                                        maxLength={6}
                                        value={pnr}
                                        onChange={(e) => setPnr(e.target.value.toUpperCase())}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="input-label">Email Address</label>
                                <div className="p-input-wrap">
                                    <Mail size={18} className="p-icon" />
                                    <input 
                                        type="email" 
                                        className="input-field" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full flex-center gap-2" disabled={loading}>
                            {loading ? <div className="loader sm"></div> : <><Search size={18} /> Find My Booking</>}
                        </button>
                    </form>
                </motion.div>

                <div className="manage-info mt-5">
                    <div className="info-grid">
                        {featureCards.map((card, i) => (
                            <motion.div
                                key={i}
                                className="info-item glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <div className="info-icon">{card.icon}</div>
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageBooking;
