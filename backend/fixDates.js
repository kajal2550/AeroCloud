const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aerocloud');

const updateFlights = async () => {
  try {
    const flights = await Flight.find();
    console.log(`Found ${flights.length} flights`);
    
    for (let flight of flights) {
      // Set departure time to 3 days from now
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      flight.departureTime = futureDate;
      
      // Set arrival to 3 days + 4 hours
      const arrivalDate = new Date(futureDate);
      arrivalDate.setHours(arrivalDate.getHours() + 4);
      flight.arrivalTime = arrivalDate;
      
      await flight.save();
    }
    
    console.log('Successfully updated all flights to FUTURE dates!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateFlights();
