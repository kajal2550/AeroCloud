import { Tag, Plane, ArrowRight, Star, Hexagon, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import './Offers.css';

const offersData = [
  { id: 1, city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', price: '$450', discount: '20% OFF', rating: 4.9, description: 'Experience the magic of the Eiffel Tower and the Louvre museum.' },
  { id: 2, city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', price: '$650', discount: '15% OFF', rating: 4.8, description: 'Discover the perfect blend of tradition and high-tech futurism.' },
  { id: 3, city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', price: '$380', discount: 'NEW', rating: 4.7, description: 'Explore the world\'s tallest buildings and luxury desert escapes.' },
  { id: 4, city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', price: '$290', discount: 'HOT', rating: 4.9, description: 'Reconnect with nature in this tropical island paradise.' },
  { id: 5, city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', price: '$520', discount: 'LIMITED', rating: 4.8, description: 'The city that never sleeps, from Times Square to Central Park.' },
  { id: 6, city: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80', price: '$490', discount: '10% OFF', rating: 4.7, description: 'Walk through history at Big Ben and the London Eye.' },
  { id: 7, city: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80', price: '$410', discount: 'CLASSIC', rating: 4.9, description: 'Ancient history at the Colosseum and incredible Italian cuisine.' },
  { id: 9, city: 'Sydney', country: 'Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80', price: '$580', discount: 'FAR AWAY', rating: 4.7, description: 'Sun, surf, and the iconic Opera House at Sydney Harbour.' },
  { id: 10, city: 'Maldives', country: 'MV', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80', price: '$890', discount: 'PREMIUM', rating: 5.0, description: 'The ultimate overwater villa experience in crystal clear waters.' },
  { id: 11, city: 'Istanbul', country: 'Turkey', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80', price: '$310', discount: 'MYSTERY', rating: 4.6, description: 'Where East meets West in the stunning Blue Mosque and Bazaars.' },
  { id: 12, city: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80', price: '$390', discount: 'ARTISTIC', rating: 4.8, description: 'Gaudí\'s architecture and the vibrant Las Ramblas street life.' },
  { id: 13, city: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80', price: '$720', discount: 'ROMANTIC', rating: 4.9, description: 'Whitewashed buildings and perfect sunsets over the Aegean.' },
  { id: 17, city: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', price: '$540', discount: 'SERENE', rating: 4.9, description: 'Traditional temples, bamboo forests, and cherry blossoms.' },
  { id: 18, city: 'Los Angeles', country: 'USA', image: 'https://images.unsplash.com/photo-1502101872923-d48509bff386?auto=format&fit=crop&w=800&q=80', price: '$510', discount: 'HOLLYWOOD', rating: 4.7, description: 'Entertainment capital of the world and sunny Santa Monica pier.' },
  { id: 19, city: 'Amsterdam', country: 'NL', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80', price: '$430', discount: 'CULTURAL', rating: 4.7, description: 'Iconic canals, bicycle life, and the Van Gogh museum.' }
];

const tickerDeals = [
  "LHR → JFK: $399 (limited time)",
  "AMS → TYO: 15% off Business Class",
  "SYD → SIN: Flash sale ends in 2h",
  "CDG → DXB: Exclusive Member Price"
];

const Offers = () => {
    return (
        <div className="offers-page min-h-screen">
            {/* Flash Deals Ticker */}
            <div className="deals-ticker-wrap">
                <div className="ticker-label">
                    <Zap size={14} fill="currentColor" /> Flash Deals
                </div>
                <div className="ticker-content">
                    <motion.div 
                        className="ticker-track"
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    >
                        {[...tickerDeals, ...tickerDeals].map((deal, i) => (
                            <span key={i} className="ticker-item">{deal}</span>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="container">
                <motion.div 
                  className="offers-header text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                    <div className="offers-tag">Exclusive Discovery</div>
                    <h1 className="title text-gradient text-glow">Signature Collections</h1>
                    <p className="text-muted max-w-2xl mx-auto">Hand-picked destinations and unbeatable prices for your next high-altitude escape.</p>
                </motion.div>

                <motion.div 
                  className="offers-grid"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                  }}
                >
                    {offersData.map(offer => (
                        <motion.div 
                          key={offer.id} 
                          className="offer-card glass-panel"
                          variants={{
                            hidden: { opacity: 0, y: 30, scale: 0.95 },
                            show: { opacity: 1, y: 0, scale: 1 }
                          }}
                          whileHover={{ y: -12, transition: { duration: 0.4 } }}
                        >
                            <div className="offer-card-shimmer"></div>
                            <div className="offer-img-wrap">
                                <img src={offer.image} alt={offer.city} className="offer-image" />
                                <div className="offer-badge-premium">
                                    <Hexagon size={16} className="bg-icon" />
                                    <span>{offer.discount}</span>
                                </div>
                                <div className="img-overlay"></div>
                            </div>
                            <div className="offer-content">
                                <div className="flex-between mb-3">
                                    <div>
                                        <h3 className="city-title">{offer.city}</h3>
                                        <span className="country-label">{offer.country}</span>
                                    </div>
                                    <div className="rating-pill">
                                        <Star size={12} fill="#fbbf24" color="#fbbf24" /> 
                                        <span>{offer.rating}</span>
                                    </div>
                                </div>
                                <p className="offer-desc mb-5">{offer.description}</p>
                                <div className="offer-footer flex-between">
                                    <div className="price-stack">
                                        <span className="p-label text-muted">Luxury from</span>
                                        <span className="p-val text-gradient">{offer.price}</span>
                                    </div>
                                    <motion.button 
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="btn-primary prestige-btn"
                                    >
                                        Inquire <ArrowRight size={16} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Redesigned Premium Subscription */}
                <motion.div 
                  className="newsletter-section glass-card mt-5"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                    <div className="newsletter-content">
                        <div className="newsletter-text">
                            <h2 className="text-gradient">Unlock Early Passage</h2>
                            <p>Subscribe to our elite circle for priority access to secret routes and seasonal deals.</p>
                        </div>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter your executive email" />
                            <button className="prestige-btn">Subscribe Free</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Offers;
