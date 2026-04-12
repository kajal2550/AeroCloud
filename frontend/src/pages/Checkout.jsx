import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ShieldCheck, ChevronLeft, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentModal from '../components/PaymentModal';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import toast from 'react-hot-toast';
import './Checkout.css';

const paymentMethods = [
    {
        id: 'upi',
        label: 'UPI / Razorpay',
        sub: 'Pay via UPI, netbanking, cards, or wallets',
        badge: 'Recommended',
        icon: '💳',
    },
    {
        id: 'qr',
        label: 'UPI QR Scan',
        sub: 'Scan QR with GPay, PhonePe, Paytm & pay instantly',
        icon: '📱',
    },
    {
        id: 'card',
        label: 'Card (Razorpay)',
        sub: 'Credit/Debit card via Razorpay gateway',
        icon: '🏧',
    },
    {
        id: 'cash',
        label: 'Cash on Arrival',
        sub: 'Pay when you reach the airport counter',
        icon: '💵',
    }
];

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addNotification } = useContext(NotificationContext);

    const { flight, passengerData, passengerCount } = location.state || {};

    // step 1 = checkout details, step 2 = payment method selection
    const [step, setStep] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('upi');

    const handleProceedToPay = () => {
        setShowPayment(true);
    };
    const [locationLoading, setLocationLoading] = useState(true);
    const [address, setAddress] = useState({
        street: 'AeroCloud Tower, NH44',
        city: 'Phagwara',
        state: 'Punjab',
        zip: '144411'
    });

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => setTimeout(() => setLocationLoading(false), 2000),
                () => setTimeout(() => setLocationLoading(false), 3000)
            );
        } else {
            setTimeout(() => setLocationLoading(false), 3000);
        }
    }, []);

    useEffect(() => {
        if (!flight) {
            toast.error('No flight selected!');
            navigate('/');
        }
    }, [flight, navigate]);

    if (!flight) return null;

    const basePrice = flight.price * (passengerCount || 1);
    const tax = Math.round(basePrice * 0.12);
    const totalPrice = basePrice + tax;

    const handleFinalPay = async () => {
        const primaryPassenger = (passengerData && passengerData[0]) || { name: user?.name || 'Guest' };
        const loadingToast = toast.loading('Confirming your premium booking...');

        try {
            const payload = {
                flight: flight._id,
                passengerName: primaryPassenger.name,
                seats: Number(passengerCount) || 1,
                seatNumber: location.state?.selectedSeat || 'Auto',
                totalPrice: totalPrice,
                meal: primaryPassenger.meal || 'Standard',
                baggage: primaryPassenger.baggage || '15kg',
                priorityBoarding: !!primaryPassenger.priority
            };

            const response = await api.post(`/flights/${flight._id}/bookings`, payload);

            if (response.data.success) {
                toast.dismiss(loadingToast);
                toast.success('Booking Confirmed!');
                setTimeout(() => {
                    navigate('/dashboard', {
                        state: {
                            justBooked: true,
                            bookingId: response.data.data._id,
                            destination: flight.destination,
                            passengerName: primaryPassenger.name
                        }
                    });
                }, 800);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            const errMsg = err.response?.data?.error || err.message || 'Network error';
            console.error('BOOKING FAILED:', errMsg);
            toast.error(`Booking failed: ${errMsg}`);
        }
    };

    // ── STEP 2: Payment Method Page ──────────────────────────────────────────
    if (step === 2) {
        return (
            <div className="checkout-page animate-fade-in">
                <div className="container" style={{ maxWidth: '620px' }}>
                    <button className="back-btn" onClick={() => setStep(1)}>
                        <ChevronLeft size={20} /> Back to Bill - Check
                    </button>
                    <h1 className="checkout-title">Payment Method</h1>

                    <motion.div
                        className="card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Mini order summary at top */}
                        <div className="payment-page-summary">
                            <span className="flight-tag">{flight.airline} · {flight.flightNumber}</span>
                            <span className="price-tag">₹{totalPrice}</span>
                        </div>

                        <div className="section-header" style={{ marginTop: '24px' }}>
                            <span className="icon-wrap green"><CreditCard size={18} /></span>
                            <h2>Choose Payment</h2>
                        </div>

                        <div className="payment-methods-list">
                            {paymentMethods.map(method => (
                                <motion.div
                                    key={method.id}
                                    className={`payment-method-option ${selectedMethod === method.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedMethod(method.id)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="method-radio">
                                        <div className={`radio-dot ${selectedMethod === method.id ? 'active' : ''}`}></div>
                                    </div>
                                    <div className="method-icon-wrap">{method.icon}</div>
                                    <div className="method-details">
                                        <div className="method-title-row">
                                            <span className="method-name">{method.label}</span>
                                            {method.badge && <span className="method-badge">{method.badge}</span>}
                                        </div>
                                        <span className="method-sub">{method.sub}</span>
                                    </div>
                                    <ArrowRight size={16} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                                </motion.div>
                            ))}
                        </div>

                        <div className="razorpay-secure-tag">
                            <img src="https://razorpay.com/favicon.png" alt="razorpay" width="16" />
                            Secured by <strong>Razorpay</strong>
                        </div>

                        <button className="pay-book-btn" style={{ marginTop: '24px' }} onClick={handleProceedToPay}>
                            Proceed to Pay ₹{totalPrice}
                        </button>
                    </motion.div>
                </div>

                {showPayment && (
                    <PaymentModal
                        amount={totalPrice}
                        onConfirm={handleFinalPay}
                        onCancel={() => setShowPayment(false)}
                    />
                )}
            </div>
        );
    }

    // ── STEP 1: Checkout Details Page ────────────────────────────────────────
    return (
        <div className="checkout-page animate-fade-in">
            <div className="container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} /> Back
                </button>
                <h1 className="checkout-title">Bill - Check</h1>

                <div className="checkout-grid">
                    {/* Left Column */}
                    <div className="checkout-left">
                        <motion.section
                            className="checkout-section card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="section-header">
                                <span className="icon-wrap"><MapPin size={18} /></span>
                                <h2>User Address</h2>
                            </div>

                            <div className={`location-detector ${!locationLoading ? 'success-detected' : ''}`}>
                                {locationLoading ? (
                                    <>
                                        <div className="loader sm"></div>
                                        <span>Detecting your location...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        <span>Location Verified: {address.city}, {address.state}</span>
                                    </>
                                )}
                            </div>

                            <p className="manual-entry-label">or enter manually</p>

                            <div className="address-inputs">
                                <div className="input-field-group full">
                                    <label>Street Address</label>
                                    <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                                </div>
                                <div className="input-row">
                                    <div className="input-field-group">
                                        <label>City</label>
                                        <input type="text" value={address.city} readOnly />
                                    </div>
                                    <div className="input-field-group">
                                        <label>State</label>
                                        <input type="text" value={address.state} readOnly />
                                    </div>
                                </div>
                                <div className="input-row">
                                    <div className="input-field-group">
                                        <label>ZIP Code</label>
                                        <input type="text" value={address.zip} readOnly />
                                    </div>
                                    <div className="input-field-group">
                                        <label>Departure Date</label>
                                        <div className="date-input-wrap">
                                            <input type="text" value={new Date().toLocaleDateString()} readOnly />
                                            <Calendar size={18} className="input-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="checkout-right">
                        <motion.div
                            className="order-summary-card card fixed-summary"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <h2>Order Summary</h2>
                            <div className="summary-items">
                                <div className="summary-item">
                                    <span className="item-name">{flight.airline} {flight.flightNumber} x {passengerCount}</span>
                                    <span className="item-price">₹{basePrice}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="item-name">Platform Fee / GST</span>
                                    <span className="item-price">₹{tax}</span>
                                </div>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <span className="total-price">₹{totalPrice}</span>
                            </div>

                            {/* This button takes to STEP 2 */}
                            <button className="pay-book-btn" onClick={() => setStep(2)}>
                                Pay ₹{totalPrice} &amp; Book
                            </button>

                            <div className="secure-tag">
                                <ShieldCheck size={14} /> Secure &amp; Encrypted
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
