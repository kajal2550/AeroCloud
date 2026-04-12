import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, User, LogOut, Sun, Moon, Bell, Globe, Briefcase, Tag, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import { CurrencyContext } from '../context/CurrencyContext';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { notifications, unreadCount, markAllAsRead, isDropdownOpen, setIsDropdownOpen } = useContext(NotificationContext);
  const { currency, setCurrency } = useContext(CurrencyContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };


  return (
    <motion.nav 
      className="navbar glass-panel"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container flex-between">
        <motion.div
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="nav-logo">
            <Plane className="logo-icon" />
            <span className="text-gradient">AeroCloud</span>
          </Link>
        </motion.div>
        
        <div className="nav-links">
          <div className="nav-menu">
            {[
              { to: "/", label: "Flights", icon: null },
              { to: "/status", label: "Status", icon: null },
              { to: "/manage", label: "Manage", icon: <Briefcase size={16} /> },
              { to: "/offers", label: "Offers", icon: <Tag size={16} /> }
            ].map((item, idx) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link to={item.to} className="nav-item flex-center gap-1">
                  {item.icon} {item.label}
                </Link>
              </motion.div>
            ))}
            
            {user && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -2 }}
              >
                <Link to="/dashboard" className="nav-item flex-center gap-1">
                  <User size={16} /> My Trips
                </Link>
              </motion.div>
            )}
            {user && user.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex-center gap-2"
                style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--surface-border)' }}
              >
                <Link to="/admin/analytics" className="nav-item admin-badge" style={{ background: 'rgba(210, 168, 255, 0.1)', color: '#d2a8ff', borderColor: 'rgba(210, 168, 255, 0.2)' }}>Analytics</Link>
                <Link to="/admin/flights" className="nav-item admin-badge">Manage</Link>
              </motion.div>
            )}
          </div>

          <div className="nav-actions">
            <div className="system-icons flex-center gap-3">
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="currency-select"
                style={{
                  background: 'var(--surface-overlay-medium)',
                  border: '1px solid var(--surface-border)',
                  color: '#fff',
                  padding: '6px 10px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                <option value="USD">USD $</option>
                <option value="INR">INR ₹</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
              </select>

              <motion.button 
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme} 
                className="icon-btn" 
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.button>
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNotificationClick} 
                  className="icon-btn relative" 
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      className="notif-dropdown glass-panel"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    >
                      <div className="notif-header">
                        <h4>Notifications</h4>
                      </div>
                      <div className="notif-body">
                        {notifications.length === 0 ? (
                          <div className="notif-empty">No updates yet</div>
                        ) : (
                          notifications.map(n => {
                            const isTripUpdate = n.message.toLowerCase().includes('trip') || n.message.toLowerCase().includes('tokyo');
                            return (
                              <div key={n.id} className="notif-item">
                                {isTripUpdate ? (
                                  <CheckCircle size={14} className="notif-icon" style={{ color: '#3fb950' }} />
                                ) : (
                                  <Bell size={14} className="notif-icon" />
                                )}
                                <div style={{ flex: 1 }}>
                                  <p>{n.message}</p>
                                  <small className="text-muted">{n.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toast.success('Language switched to English (US)')} 
                className="icon-btn" 
                title="Language"
              >
                <Globe size={20} />
              </motion.button>
            </div>

            <div className="auth-section flex-center gap-3">
              {user ? (
                <>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="user-profile flex-center gap-2"
                  >
                    <div className="avatar-sm">
                      <User size={16} />
                    </div>
                    <span className="user-name">{user.name.split(' ')[0]}</span>
                  </motion.div>
                  <motion.button 
                    whileHover={{ scale: 1.1, color: 'var(--error)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout} 
                    className="logout-icon-btn"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </motion.button>
                </>
              ) : (
                <div className="flex-center gap-2">
                  <Link to="/login" className="nav-item">Login</Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="btn-primary btn-sm">Sign Up</Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
