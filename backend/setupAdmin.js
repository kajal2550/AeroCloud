const mongoose = require('mongoose');
const User = require('./models/User'); // Mongoose Model
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flight-manager')
  .then(async () => {
    // Check if it already exists to prevent duplicate key errors
    await User.deleteOne({ email: 'admin@aerocloud.com' });
    
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@aerocloud.com',
      password: 'password123',
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('✅ Admin user created successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error creating admin user:', err);
    process.exit(1);
  });
