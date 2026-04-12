const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

const flights = [
  {
    flightNumber: 'AC101', airline: 'AeroCloud', origin: 'New York (JFK)', destination: 'London (LHR)',
    departureTime: new Date(Date.now() + 86400000 * 2), arrivalTime: new Date(Date.now() + 86400000 * 2 + 3600000 * 8), price: 450, totalSeats: 150, availableSeats: 150
  },
  {
    flightNumber: 'AC205', airline: 'AeroCloud', origin: 'San Francisco (SFO)', destination: 'Tokyo (HND)',
    departureTime: new Date(Date.now() + 86400000 * 3), arrivalTime: new Date(Date.now() + 86400000 * 3 + 3600000 * 11), price: 850, totalSeats: 200, availableSeats: 200
  },
  {
    flightNumber: 'DL300', airline: 'Delta', origin: 'Los Angeles (LAX)', destination: 'New York (JFK)',
    departureTime: new Date(Date.now() + 86400000 * 1), arrivalTime: new Date(Date.now() + 86400000 * 1 + 3600000 * 5), price: 250, totalSeats: 180, availableSeats: 180
  },
  {
    flightNumber: 'QA405', airline: 'Qatar Airways', origin: 'London (LHR)', destination: 'Doha (DOH)',
    departureTime: new Date(Date.now() + 86400000 * 4), arrivalTime: new Date(Date.now() + 86400000 * 4 + 3600000 * 6.5), price: 600, totalSeats: 220, availableSeats: 220
  },
  {
    flightNumber: 'IN707', airline: 'Air India', origin: 'Delhi (DEL)', destination: 'Kolkata (CCU)',
    departureTime: new Date("2026-07-07T10:00:00Z"), arrivalTime: new Date("2026-07-07T12:30:00Z"), price: 120, totalSeats: 180, availableSeats: 180
  },
  {
    flightNumber: 'EK102', airline: 'Emirates', origin: 'Dubai (DXB)', destination: 'Paris (CDG)',
    departureTime: new Date(Date.now() + 86400000 * 5), arrivalTime: new Date(Date.now() + 86400000 * 5 + 3600000 * 7), price: 720, totalSeats: 300, availableSeats: 300
  },
  {
    flightNumber: 'AC188', airline: 'AeroCloud', origin: 'London (LHR)', destination: 'Dubai (DXB)',
    departureTime: new Date(Date.now() + 86400000 * 6), arrivalTime: new Date(Date.now() + 86400000 * 6 + 3600000 * 7), price: 550, totalSeats: 180, availableSeats: 180
  },
  {
    flightNumber: 'SG332', airline: 'Singapore Airlines', origin: 'Singapore (SIN)', destination: 'Tokyo (NRT)',
    departureTime: new Date(Date.now() + 86400000 * 2), arrivalTime: new Date(Date.now() + 86400000 * 2 + 3600000 * 6), price: 400, totalSeats: 250, availableSeats: 250
  },
  {
    flightNumber: 'AC991', airline: 'AeroCloud', origin: 'Tokyo (NRT)', destination: 'Los Angeles (LAX)',
    departureTime: new Date(Date.now() + 86400000 * 7), arrivalTime: new Date(Date.now() + 86400000 * 7 + 3600000 * 9.5), price: 920, totalSeats: 200, availableSeats: 180
  },
  {
    flightNumber: 'LUF55', airline: 'Lufthansa', origin: 'Frankfurt (FRA)', destination: 'New York (JFK)',
    departureTime: new Date(Date.now() + 86400000 * 3), arrivalTime: new Date(Date.now() + 86400000 * 3 + 3600000 * 8.5), price: 480, totalSeats: 160, availableSeats: 160
  },
  {
    flightNumber: 'BA33', airline: 'British Airways', origin: 'London (LHR)', destination: 'Berlin (BER)',
    departureTime: new Date(Date.now() + 86400000 * 1), arrivalTime: new Date(Date.now() + 86400000 * 1 + 3600000 * 2), price: 150, totalSeats: 100, availableSeats: 85
  },
  {
    flightNumber: 'AC334', airline: 'AeroCloud', origin: 'Miami (MIA)', destination: 'Cancun (CUN)',
    departureTime: new Date(Date.now() + 86400000 * 4), arrivalTime: new Date(Date.now() + 86400000 * 4 + 3600000 * 2.5), price: 210, totalSeats: 120, availableSeats: 120
  },
  {
    flightNumber: 'KLM60', airline: 'KLM', origin: 'Amsterdam (AMS)', destination: 'Toronto (YYZ)',
    departureTime: new Date(Date.now() + 86400000 * 5), arrivalTime: new Date(Date.now() + 86400000 * 5 + 3600000 * 8.5), price: 580, totalSeats: 210, availableSeats: 200
  },
  {
    flightNumber: 'AC110', airline: 'AeroCloud', origin: 'Sydney (SYD)', destination: 'Los Angeles (LAX)',
    departureTime: new Date(Date.now() + 86400000 * 8), arrivalTime: new Date(Date.now() + 86400000 * 8 + 3600000 * 14), price: 1100, totalSeats: 240, availableSeats: 220
  },
  {
    flightNumber: 'IN882', airline: 'Air India', origin: 'Mumbai (BOM)', destination: 'London (LHR)',
    departureTime: new Date(Date.now() + 86400000 * 3), arrivalTime: new Date(Date.now() + 86400000 * 3 + 3600000 * 9), price: 650, totalSeats: 260, availableSeats: 260
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flight-manager')
  .then(async () => {
    console.log('MongoDB Connected for Seeding');
    await Flight.deleteMany(); // Clear existing
    await Flight.insertMany(flights);
    console.log('Flights Seeded!');
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
