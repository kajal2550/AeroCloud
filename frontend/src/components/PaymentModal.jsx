import React, { useState, useEffect, useContext } from 'react';
import { CreditCard, Smartphone, Banknote, Wallet, X, CheckCircle, ShieldCheck, Clock, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import CoinAnimation from './CoinAnimation';
import './PaymentModal.css';

const PaymentModal = ({ amount, onConfirm, onCancel, flightData }) => {
  const { theme } = useContext(ThemeContext);
  const [step, setStep] = useState('options'); // 'options', 'processing', 'confirming', 'success'
  const [redirectTimer, setRedirectTimer] = useState(3);
  const [activeMethod, setActiveMethod] = useState('Cards');

  const handlePay = () => {
    setStep('processing');
    // The CoinAnimation component handles its own timing (3.8s)
    // We will let it call a callback when done, or just use a timer here to match.
  };

  const handleAnimationComplete = () => {
    setStep('success');
  };

  useEffect(() => {
    let interval;
    if (step === 'success' && redirectTimer > 0) {
      interval = setInterval(() => {
        setRedirectTimer(prev => prev - 1);
      }, 1000);
    } else if (step === 'success' && redirectTimer === 0) {
      onConfirm();
    }
    return () => clearInterval(interval);
  }, [step, redirectTimer, onConfirm]);

  const renderContent = () => {
    switch (step) {
      case 'options':
        return (
          <div className={`rzp-main-panel ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
            <div className="rzp-header">
              <h3>Payment Options</h3>
              <div className="header-actions">
                <span className="dots">•••</span>
                <button onClick={onCancel} className="close-btn"><X size={18}/></button>
              </div>
            </div>
            
            <div className="rzp-split-view">
              {/* Method Sidebar */}
              <div className="method-sidebar">
                <div 
                  className={`pay-method-item ${activeMethod === 'Cards' ? 'active' : ''}`}
                  onClick={() => setActiveMethod('Cards')}
                >
                  <span className="method-name">Cards</span>
                  <div className="card-icons">
                    <div className="logo-circle"><span style={{color:'#1a1f71', fontWeight:900, fontStyle:'italic', fontSize:'10px'}}>V</span></div>
                    <div className="logo-circle">
                      <div style={{display:'flex'}}>
                        <div style={{width:8,height:8,borderRadius:4,background:'#eb001b'}}></div>
                        <div style={{width:8,height:8,borderRadius:4,background:'#f79e1b',marginLeft:-4}}></div>
                      </div>
                    </div>
                    <div className="logo-circle"><span style={{color:'#f28b00', fontWeight:900, fontStyle:'italic', fontSize:'8px'}}>Ru</span></div>
                  </div>
                </div>

                <div 
                  className={`pay-method-item ${activeMethod === 'Netbanking' ? 'active' : ''}`}
                  onClick={() => setActiveMethod('Netbanking')}
                >
                  <span className="method-name">Netbanking</span>
                  <div className="card-icons">
                    <div className="logo-circle">
                      <div style={{width:10,height:10,borderRadius:5,background:'#008df1',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <div style={{width:3,height:5,background:'white'}}></div>
                      </div>
                    </div>
                    <div className="logo-circle">
                      <div style={{width:10,height:10,background:'#004b8d',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <div style={{width:4,height:4,background:'white'}}></div>
                      </div>
                    </div>
                    <div className="logo-circle"><span style={{color:'#f26522', fontWeight:900, fontSize:'10px'}}>i</span></div>
                    <div className="logo-circle"><span style={{color:'#96283b', fontWeight:900, fontSize:'10px'}}>A</span></div>
                  </div>
                </div>

                <div 
                  className={`pay-method-item ${activeMethod === 'Wallet' ? 'active' : ''}`}
                  onClick={() => setActiveMethod('Wallet')}
                >
                  <span className="method-name">Wallet</span>
                  <div className="card-icons">
                    <div className="logo-circle"><span style={{color:'#00b9f5', fontWeight:800, fontSize:'7px'}}>Pay</span></div>
                    <div className="logo-circle"><span style={{color:'#5f259f', fontWeight:900, fontSize:'10px'}}>पे</span></div>
                    <div className="logo-circle"><span style={{color:'#127c56', fontWeight:900, fontSize:'7px'}}>UPI</span></div>
                  </div>
                </div>

                <div 
                  className={`pay-method-item ${activeMethod === 'Pay Later' ? 'active' : ''}`}
                  onClick={() => setActiveMethod('Pay Later')}
                >
                  <span className="method-name">Pay Later</span>
                  <div className="card-icons">
                    <div className="logo-circle"><span style={{color:'#111', fontWeight:900, fontSize:'11px'}}>a</span></div>
                    <div className="logo-circle" style={{background: '#f8f9fc'}}><span style={{color:'#00d2ff', fontWeight:900, fontSize:'9px'}}>Lz</span></div>
                  </div>
                </div>
              </div>

              {/* Method Content */}
              <div className="method-content">
                {activeMethod === 'Cards' && (
                    <div className="rzp-form">
                        <div className="form-group full-width">
                            <input type="text" placeholder="Card Number" />
                        </div>
                        <div className="form-row">
                            <div className="form-group half-width">
                            <input type="text" placeholder="MM / YY" />
                            </div>
                            <div className="form-group half-width">
                            <input type="text" placeholder="CVV" />
                            </div>
                        </div>
                        <div className="checkbox-group">
                            <input type="checkbox" id="save-card" />
                            <label htmlFor="save-card">Save this card as per RBI guidelines</label>
                        </div>
                        <button className="rzp-continue-btn" onClick={handlePay}>
                            Continue
                        </button>
                    </div>
                )}

                {activeMethod === 'Netbanking' && (
                    <div className="options-list-view">
                        <div className="search-bar-styled">
                            <Search size={16} color="#888" className="s-icon" />
                            <input type="text" placeholder="Search for Banks" />
                        </div>
                        <p className="section-label">Suggested Banks</p>
                        <div className="list-group-rzp">
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-img-box">
                                   <svg viewBox="0 0 32 32" fill="none">
                                     <path d="M22.5 16C22.5 20.1421 19.1421 23.5 15 23.5H8.5V8.5H15C19.1421 8.5 22.5 11.8579 22.5 16Z" fill="#F46321"/>
                                     <path d="M14 16.5H11.5V20.5H14C15.1046 20.5 16 19.6046 16 18.5C16 17.3954 15.1046 16.5 14 16.5Z" fill="#FFF"/>
                                     <path d="M14 11.5H11.5V14.5H14C14.8284 14.5 15.5 13.8284 15.5 13C15.5 12.1716 14.8284 11.5 14 11.5Z" fill="#FFF"/>
                                   </svg>
                                </div>
                                <div className="rzp-item-info">
                                    <p className="i-title">Bank of Baroda - Retail Banking</p>
                                    <p className="i-sub">For Individuals</p>
                                </div>
                                <ChevronRight size={16} color="#111" />
                            </div>
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-img-box">
                                   <svg viewBox="0 0 32 32" fill="none">
                                     <path d="M16 4 L28 26 H4 Z" stroke="#0072BC" strokeWidth="4" strokeLinejoin="round" fill="transparent" />
                                     <path d="M12 20 L16 12 L20 20 Z" fill="#FBB03B" />
                                   </svg>
                                </div>
                                <div className="rzp-item-info"><p className="i-title">Canara Bank</p></div>
                                <ChevronRight size={16} color="#111" />
                            </div>
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-img-box">
                                   <svg viewBox="0 0 32 32" fill="none">
                                     <circle cx="16" cy="16" r="14" fill="#FFC20E"/>
                                     <path d="M16 8 C 22 8, 22 16, 16 16 L 16 24 L 12 24 L 12 8 Z" fill="#FFF"/>
                                   </svg>
                                </div>
                                <div className="rzp-item-info">
                                    <p className="i-title">Punjab National Bank - Retail Banking</p>
                                    <p className="i-sub">For Individuals</p>
                                </div>
                                <ChevronRight size={16} color="#111" />
                            </div>
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-img-box">
                                   <svg viewBox="0 0 32 32" fill="none">
                                     <circle cx="16" cy="16" r="14" fill="#009639"/>
                                     <circle cx="16" cy="16" r="8" fill="#FFF"/>
                                     <circle cx="16" cy="16" r="4" fill="#009639"/>
                                   </svg>
                                </div>
                                <div className="rzp-item-info"><p className="i-title">PNB (Erstwhile-United Bank of India)</p></div>
                                <ChevronRight size={16} color="#111" />
                            </div>
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-img-box">
                                   <svg viewBox="0 0 32 32" fill="none">
                                     <rect x="4" y="4" width="24" height="24" rx="4" fill="#00703C"/>
                                     <rect x="10" y="10" width="12" height="12" fill="#FFF"/>
                                     <rect x="13" y="13" width="6" height="6" fill="#00703C"/>
                                   </svg>
                                </div>
                                <div className="rzp-item-info"><p className="i-title">IDBI</p></div>
                                <ChevronRight size={16} color="#111" />
                            </div>
                        </div>

                        <p className="section-label" style={{marginTop: '25px'}}>All Banks</p>
                        <div className="list-group-rzp">
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-img-box">
                                   <svg viewBox="0 0 32 32" fill="none">
                                     <path d="M4 26 C 4 8, 28 8, 28 26 C 28 16, 14 16, 14 26 Z" fill="#FF0000"/>
                                   </svg>
                                </div>
                                <div className="rzp-item-info"><p className="i-title">Airtel Payments Bank</p></div>
                                <ChevronRight size={16} color="#111" />
                            </div>
                        </div>
                    </div>
                )}

                {activeMethod === 'Wallet' && (
                    <div className="options-list-view">
                        <p className="section-label" style={{marginTop:0}}>Suggested Wallets</p>
                        <div className="list-group-rzp">
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-icon-box" style={{color: '#a855f7'}}>P</div>
                                <div className="rzp-item-info"><p className="i-title">PhonePe</p></div>
                                <ChevronRight size={16} color="#aaa" />
                            </div>
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-icon-box" style={{color: '#14b8a6'}}>A</div>
                                <div className="rzp-item-info"><p className="i-title">Amazon Pay</p></div>
                                <ChevronRight size={16} color="#aaa" />
                            </div>
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-icon-box" style={{color: '#f43f5e'}}>M</div>
                                <div className="rzp-item-info"><p className="i-title">MobiKwik</p></div>
                                <ChevronRight size={16} color="#aaa" />
                            </div>
                        </div>
                    </div>
                )}

                {activeMethod === 'Pay Later' && (
                    <div className="options-list-view">
                        <p className="section-label" style={{marginTop:0}}>Available Options</p>
                        <div className="list-group-rzp">
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-icon-box" style={{color: '#f97316'}}>I</div>
                                <div className="rzp-item-info">
                                    <p className="i-title">ICICI PayLater</p>
                                    <p className="i-sub">Using linked mobile</p>
                                </div>
                                <ChevronRight size={16} color="#aaa" />
                            </div>
                            <div className="list-item-rzp" onClick={handlePay}>
                                <div className="rzp-icon-box" style={{color: '#00d2ff'}}>Lz</div>
                                <div className="rzp-item-info"><p className="i-title">LazyPay</p></div>
                                <ChevronRight size={16} color="#aaa" />
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'processing':
        return (
          <CoinAnimation onComplete={handleAnimationComplete} onCancel={onCancel} />
        );

      case 'success':
        return (
          <motion.div 
            key="success"
            className="rzp-main-panel success-full-view"
            initial={{ backgroundColor: '#ffffff' }}
            animate={{ backgroundColor: '#22c55e' }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
                className="success-bg-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            />
            
            <div className="success-content-wrapper">
              <motion.div 
                className="redirect-badge"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                You will be redirected in {redirectTimer} seconds
              </motion.div>

              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                Payment Successful
              </motion.h1>

              <div className="success-lottie-mock">
                <motion.div 
                    className="tick-circle"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.2 }}
                >
                    <CheckCircle size={80} color="#fff" strokeWidth={3} />
                </motion.div>
              </div>

              <motion.div 
                className="receipt-card-premium"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", damping: 15 }}
              >
                <div className="receipt-header">
                  <span className="brand-name">AeroCloud</span>
                  <span className="price-tag">₹{amount}</span>
                </div>
                
                <div className="receipt-body">
                   <div className="r-row">
                      <span className="r-label">{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                   <div className="r-row">
                      <span className="r-label">Netbanking</span>
                      <span className="r-value">pay_{Math.random().toString(36).substr(2, 9).toUpperCase()} <CheckCircle size={14} className="inline-check"/></span>
                   </div>
                </div>

                <div className="receipt-footer">
                   <div className="support-info">
                      <div className="info-icon">i</div>
                      Visit razorpay.com/support for queries
                   </div>
                </div>
              </motion.div>

              <div className="success-footer-brand">
                 Secured by <span className="bold">Razorpay</span>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        className={`rzp-modal-container ${step === 'success' ? 'is-success' : ''}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Left Price Panel */}
        <div className="rzp-side-panel">
          <div className="rzp-brand">
             <div className="rzp-logo-box">A</div>
             <h3>AeroCloud</h3>
          </div>

          <div className="rzp-price-summary">
            <div className="summary-card">
              <p className="summary-label">Price Summary</p>
              <h1 className="summary-amount">₹{amount}</h1>
            </div>
          </div>

          <div className="user-contact-pill">
            <span className="icon"><Smartphone size={16} color="#4F46E5" /></span>
            <div className="contact-details">
              <p>Using as +91 86881 300XX</p>
            </div>
            <ChevronRight size={14} color="#aaa" />
          </div>

          <div className="rzp-illustration">
             {/* Realistic isometric 3D Airplane matching AeroCloud theme */}
             <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cloud shadow context */}
                <circle cx="90" cy="100" r="50" fill="#3730A3" opacity="0.3" transform="scale(1, 0.4)"/>
                
                {/* Back/Right Wing */}
                <path d="M110 45 L135 20 L150 25 L120 50 Z" fill="#4338CA"/>
                
                {/* Main Fuselage Top */}
                <path d="M30 75 L140 35 L155 45 L45 85 Z" fill="#A5B4FC"/>
                
                {/* Main Fuselage Side */}
                <path d="M45 85 L155 45 L150 55 L40 95 Z" fill="#6366F1"/>
                
                {/* Nose Cone */}
                <path d="M140 35 L165 42 L155 45 Z" fill="#C7D2FE"/>
                <path d="M155 45 L165 42 L160 52 L150 55 Z" fill="#818CF8"/>

                {/* Cockpit */}
                <path d="M120 42 L135 36 L145 42 L128 49 Z" fill="#1E1B4B" opacity="0.6"/>

                {/* Left/Front Wing */}
                <path d="M85 70 L45 110 L65 115 L105 75 Z" fill="#818CF8"/>
                {/* Left Wing Thickness */}
                <path d="M45 110 L65 115 L60 120 L40 115 Z" fill="#4F46E5"/>

                {/* Tail Fin */}
                <path d="M40 70 L30 35 L45 40 L50 65 Z" fill="#818CF8"/>
                {/* Tail Fin Side */}
                <path d="M45 40 L50 65 L55 60 L50 35 Z" fill="#4F46E5"/>

                {/* Left Engine */}
                <path d="M80 85 L70 95 L80 100 L90 90 Z" fill="#3730A3"/>
                <circle cx="75" cy="90" r="8" fill="#34D399" transform="scale(1, 0.8) rotate(-45 75 90)"/>
             </svg>
          </div>
          
          <div className="left-panel-footer">
             <span className="secured-text">Secured by</span>
             <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" height="14" style={{filter: 'brightness(0) invert(1)'}} />
          </div>
        </div>

        {/* Right Dynamic Content */}
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
