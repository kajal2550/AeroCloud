import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import './AuthForm.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, 'user');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (loginWithGoogle) {
          await loginWithGoogle(credentialResponse.credential);
          toast.success("Successfully logged in with Google!");
          navigate('/');
      } else {
          toast.success("Google login captured (Backend integration pending)");
      }
    } catch (err) {
      setError('Google registration failed');
    }
  };

  const handleGoogleError = () => {
    setError('Google login was unsuccessful');
  };

  return (
    <div className="auth-container section animate-fade-in">
      <div className="auth-card glass-panel">
        <h2 className="title text-center">Join AeroCloud</h2>
        <p className="text-muted text-center mb-4">Create your account to start booking</p>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label"><User size={16}/> Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required 
            />
          </div>
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
              minLength={6}
              required 
            />
          </div>
          <button type="submit" className="btn-primary auth-submit flex-center">
            <UserPlus size={18} style={{marginRight: '8px'}}/> Create Account
          </button>
        </form>

        <div className="auth-footer text-center mt-4">
          <p className="text-muted">Already have an account? <Link to="/login" className="text-gradient">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
