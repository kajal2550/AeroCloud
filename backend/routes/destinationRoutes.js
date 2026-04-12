const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// @desc    Get all popular destinations
// @route   GET /api/destinations
// @access  Public
router.get('/', async (req, res) => {
  try {
    let destinations = await Destination.find();
    
    // WIPE DATABASE TOTALLY TO REMOVE BRKOEN IMAGES
    await Destination.deleteMany({});
    
    const seedData = [
      { id: 'Tokyo', name: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200' },
      { id: 'London', name: 'London, UK', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200' },
      { id: 'Paris', name: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200' },
      { id: 'Dubai', name: 'Dubai, UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200' },
      { id: 'Rome', name: 'Rome, Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200' },
      { id: 'Sydney', name: 'Sydney, Australia', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200' },
      { id: 'New York', name: 'New York, USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200' },
      { id: 'Bali', name: 'Bali, Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200' },
      { id: 'Barcelona', name: 'Barcelona, Spain', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200' },
      { id: 'Amsterdam', name: 'Amsterdam, Netherlands', img: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200' },
      { id: 'Istanbul', name: 'Istanbul, Turkey', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200' },
      { id: 'Venice', name: 'Venice, Italy', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200' },
      { id: 'Prague', name: 'Prague, Czechia', img: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200' },
      { id: 'Santorini', name: 'Santorini, Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200' },
      { id: 'Maldives', name: 'Maldives', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200' },
      { id: 'Madrid', name: 'Madrid, Spain', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200' },
      { id: 'Vienna', name: 'Vienna, Austria', img: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200' },
      { id: 'Zurich', name: 'Zurich, Switzerland', img: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200' },
      { id: 'Berlin', name: 'Berlin, Germany', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200' },
      { id: 'Lisbon', name: 'Lisbon, Portugal', img: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=1200' }
    ];
    destinations = await Destination.insertMany(seedData);

    
    res.status(200).json({ success: true, count: destinations.length, data: destinations });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
