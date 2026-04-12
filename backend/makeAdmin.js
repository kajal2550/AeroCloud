const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/flight-manager')
  .then(async () => {
    const result = await mongoose.connection.db.collection('users').updateMany(
      {},
      { $set: { role: 'admin' } }
    );
    console.log(result.modifiedCount + ' users updated to admin');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
