import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminFlights from './pages/AdminFlights';
import AdminAnalytics from './pages/AdminAnalytics';
import FlightStatus from './pages/FlightStatus';
import ManageBooking from './pages/ManageBooking';
import Offers from './pages/Offers';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { CurrencyProvider } from './context/CurrencyContext';
import RealTimeNotifications from './components/RealTimeNotifications';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <AuthProvider>
          <NotificationProvider>
            <CurrencyProvider>
              <Router>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 3500,
                    style: {
                      background: 'rgba(13,17,23,0.95)',
                      color: '#e6edf3',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      padding: '12px 18px',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      fontFamily: 'Inter, sans-serif',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      maxWidth: '360px',
                    },
                    success: {
                      iconTheme: { primary: '#3fb950', secondary: '#0d1117' },
                      style: {
                        background: 'rgba(13,17,23,0.95)',
                        border: '1px solid rgba(63,185,80,0.3)',
                        color: '#e6edf3',
                      },
                    },
                    error: {
                      iconTheme: { primary: '#f85149', secondary: '#0d1117' },
                      style: {
                        background: 'rgba(13,17,23,0.95)',
                        border: '1px solid rgba(248,81,73,0.3)',
                        color: '#e6edf3',
                      },
                    },
                    loading: {
                      iconTheme: { primary: '#58a6ff', secondary: '#0d1117' },
                      style: {
                        background: 'rgba(13,17,23,0.95)',
                        border: '1px solid rgba(88,166,255,0.3)',
                        color: '#e6edf3',
                      },
                    },
                  }}
                />
                <RealTimeNotifications />
        <div className="app-container">
          <div className="mesh-gradient-bg">
            <div className="mesh-glow mesh-glow-1"></div>
            <div className="mesh-glow mesh-glow-2"></div>
            <div className="mesh-glow mesh-glow-3"></div>
          </div>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
              />
              <Route 
                path="/admin/flights" 
                element={<ProtectedRoute adminOnly={true}><AdminFlights /></ProtectedRoute>} 
              />
              <Route 
                path="/admin/analytics" 
                element={<ProtectedRoute adminOnly={true}><AdminAnalytics /></ProtectedRoute>} 
              />
              <Route path="/status" element={<FlightStatus />} />
              <Route path="/manage" element={<ManageBooking />} />
              <Route path="/offers" element={<Offers />} />
              <Route 
                path="/checkout" 
                element={<ProtectedRoute><Checkout /></ProtectedRoute>} 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
        </Router>
            </CurrencyProvider>
          </NotificationProvider>
        </AuthProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
