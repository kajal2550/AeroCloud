const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flight-manager')
  .then(async () => {
    let user = await User.findOne({ email: 'test@aerocloud.com' });
    if (!user) {
        await User.create({
            name: 'Demo User',
            email: 'test@aerocloud.com',
            password: 'password123'
        });
        console.log('Demo user created (test@aerocloud.com / password123)');
    } else {
        user.password = 'password123';
        await user.save();
        console.log('Demo user updated (test@aerocloud.com / password123)');
    }
    process.exit(0);
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });
