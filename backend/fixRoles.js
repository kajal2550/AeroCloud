const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flight-manager')
  .then(async () => {
    // 1. Demote everyone to 'user' EXCEPT admin@aerocloud.com
    const result = await mongoose.connection.db.collection('users').updateMany(
      { email: { $ne: 'admin@aerocloud.com' } },
      { $set: { role: 'user' } }
    );
    console.log(result.modifiedCount + ' users demoted back to normal user.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
