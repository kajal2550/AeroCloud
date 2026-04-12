const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');

// Fix for querySrv ECONNREFUSED when using MongoDB Atlas on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const socketConfig = require('./socket');

const app = express();
const http = require('http');
const server = http.createServer(app);

// Initialize socket.io
socketConfig.init(server);

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Root route for base URL feedback
app.get('/', (req, res) => {
  res.send('<h1>AeroCloud API is Running 🚀</h1><p>Visit the <b>Frontend UI</b> on <a href="http://localhost:5174">http://localhost:5174</a></p>');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/destinations', destinationRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flight-manager';

// Connect to database
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`MongoDB Connected: ${MONGO_URI}`);
    server.listen(PORT, console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(`Error connection to MongoDB: ${err.message}`);
    process.exit(1);
  });
