import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Calendar, Plane, Activity, DollarSign } from 'lucide-react';

const COLORS = ['#58a6ff', '#3fb950', '#f85149', '#d2a8ff', '#ffeb3b'];

const AdminAnalytics = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [flightsRes, bookingsRes] = await Promise.all([
        api.get('/flights'),
        api.get('/bookings')
      ]);
      setFlights(flightsRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (err) {
      console.error("Failed to fetch analytics data", err);
    } finally {
      setLoading(false);
    }
  };

  // Aggregations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const activeFlights = flights.filter(f => f.status === 'On Time' || f.status === 'Scheduled').length;
  
  // Data for PieChart (Flight Status)
  const statusCounts = flights.reduce((acc, flight) => {
    acc[flight.status] = (acc[flight.status] || 0) + 1;
    return acc;
  }, {});
  const flightStatusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  // Data for BarChart (Bookings per Airline)
  const airlineBookings = bookings.reduce((acc, b) => {
    if (b.flight && b.flight.airline) {
      acc[b.flight.airline] = (acc[b.flight.airline] || 0) + 1;
    }
    return acc;
  }, {});
  const airlineData = Object.keys(airlineBookings).map(airline => ({
    name: airline,
    bookings: airlineBookings[airline]
  })).sort((a,b) => b.bookings - a.bookings).slice(0, 5); // Top 5

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container section animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header className="mb-5">
        <span className="welcome-tag">Overview</span>
        <h1 className="title">Platform <span className="text-gradient">Analytics</span></h1>
      </header>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon-wrap" style={{ background: 'rgba(63, 185, 80, 0.1)', color: '#3fb950' }}><DollarSign size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">${totalRevenue.toLocaleString()}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </motion.div>
        
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon-wrap" style={{ background: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff' }}><Users size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{bookings.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon-wrap" style={{ background: 'rgba(210, 168, 255, 0.1)', color: '#d2a8ff' }}><Plane size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{activeFlights}</span>
            <span className="stat-label">Active / Scheduled Flights</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Flight Status Distribution */}
        <motion.div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity className="text-primary" /> Flight Status Distribution
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={flightStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {flightStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-overlay-solid)', borderColor: 'var(--surface-border)', borderRadius: '12px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Airlines by Bookings */}
        <motion.div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp className="text-primary" /> Top Airlines
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={airlineData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--surface-overlay-solid)', borderColor: 'var(--surface-border)', borderRadius: '12px' }}
                />
                <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                  {airlineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
