import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import './AuthForm.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // In a full implementation, you'd send `credentialResponse.credential` to your backend.
      // For this demo, we'll simulate a successful Google auth via context if the backend route isn't set up yet.
      if (loginWithGoogle) {
          const loggedInUser = await loginWithGoogle(credentialResponse.credential);
          
          // Visual Welcome Message
          toast.success(`Welcome back, ${loggedInUser.name}! ✨`, {
              duration: 2000,
              icon: '👋',
          });
          
          // Voice Greeting
          if ('speechSynthesis' in window && loggedInUser?.name) {
              const msg = new SpeechSynthesisUtterance();
              msg.rate = 0.9; // Thoda slow aur premium feel ke liye
              msg.text = `Welcome ${loggedInUser.name}. AeroCloud is ready for your journey.`;
              window.speechSynthesis.speak(msg);
          }

          navigate('/');
      } else {
          toast.success("Google login captured (Backend integration pending)");
      }
    } catch (err) {
      setError('Google login failed');
    }
  };

  const handleGoogleError = () => {
    setError('Google login was unsuccessful');
  };

  return (
    <div className="auth-container section animate-fade-in">
      <div className="auth-card glass-panel">
        <h2 className="title text-center">Welcome Back</h2>
        <p className="text-muted text-center mb-4">Sign in to your AeroCloud account</p>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label"><Mail size={16}/> Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label"><Lock size={16}/> Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-primary auth-submit flex-center">
            <LogIn size={18} style={{marginRight: '8px'}}/> Sign In
          </button>
        </form>

        <div className="auth-footer text-center mt-4">
          <p className="text-muted">Don't have an account? <Link to="/register" className="text-gradient">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
