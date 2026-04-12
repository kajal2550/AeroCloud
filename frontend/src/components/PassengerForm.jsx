import React, { useState, useEffect } from 'react';
import { User, CreditCard, ChevronRight, ChevronLeft, X, UserCheck, Eye, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './PassengerForm.css';

// ── Helpers ─────────────────────────────────────────────────────────────────
// Deterministic price & calories so they're stable across renders
const getMealPrice = (index, name = '') => {
  const base = 8;
  const seed = (name.charCodeAt(0) || 65) % 15;
  return (base + seed + (index % 8)).toFixed(2);
};

const getMealCalories = (index, name = '') => {
  const base = 280;
  const seed = (name.charCodeAt(1) || 70) % 200;
  return base + seed + (index % 10) * 12;
};

const getMealCategory = (dish) => dish.strCategory || 'Main Course';

// ── Meal Gallery Modal ──────────────────────────────────────────────────────
const MealGalleryModal = ({ mealType, onClose }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n'];
        const results = await Promise.all(
          letters.map(l =>
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${l}`)
              .then(r => r.json())
              .then(d => d.meals || [])
          )
        );
        setDishes(results.flat().slice(0, 60));
      } catch (err) {
        console.error('Meal fetch failed:', err);
        setDishes(Array.from({ length: 20 }, (_, i) => ({
          idMeal: `fallback-${i}`,
          strMeal: `Dish ${i + 1}`,
          strMealThumb: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&sig=${i}`,
          strCategory: 'Main Course'
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, [mealType]);

  const categories = ['All', ...new Set(dishes.map(d => d.strCategory).filter(Boolean))];
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? dishes : dishes.filter(d => d.strCategory === activeCategory);

  return (
    <AnimatePresence>
      <motion.div
        className="meal-gallery-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="meal-gallery-modal"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Hero header */}
          <div className="mgl-hero">
            <div className="mgl-hero-bg" />
            <div className="mgl-hero-content">
              <div className="mgl-hero-icon">✈️</div>
              <div>
                <h2 className="mgl-title">In-Flight Menu</h2>
                <p className="mgl-subtitle">{mealType} · {dishes.length} dishes curated for you</p>
              </div>
            </div>
            <button className="mgl-close" onClick={onClose}><X size={20} /></button>
          </div>

          {/* Category filter chips */}
          {!loading && (
            <div className="mgl-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`mgl-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >{cat}</button>
              ))}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="meal-gallery-loading">
              <div className="mgl-spinner">
                <div className="mgl-spinner-ring" />
                <span>🍽</span>
              </div>
              <p className="mgl-loading-text">Preparing your menu...</p>
            </div>
          ) : (
            <div className="mgl-scroll-area">

              {/* Lightbox */}
              <AnimatePresence>
                {selected && (() => {
                  const dish = dishes.find(d => d.idMeal === selected);
                  if (!dish) return null;
                  const idx = dishes.indexOf(dish);
                  const price = getMealPrice(idx, dish.strMeal);
                  const cal   = getMealCalories(idx, dish.strMeal);
                  return (
                    <motion.div className="mgi-lightbox"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setSelected(null)}
                    >
                      <motion.div className="mgi-lightbox-inner"
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="mgi-lb-img-wrap">
                          <img src={dish.strMealThumb} alt={dish.strMeal} className="mgi-lb-img"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'; }} />
                          <div className="mgi-lb-img-overlay" />
                          <span className="mgi-lb-cat-badge">{getMealCategory(dish)}</span>
                        </div>
                        <div className="mgi-lb-info">
                          <h3 className="mgi-lb-name">{dish.strMeal}</h3>
                          <div className="mgi-lb-stats">
                            <div className="mgi-lb-stat green">
                              <span className="mgi-lb-stat-val">${price}</span>
                              <span className="mgi-lb-stat-label">per serving</span>
                            </div>
                            <div className="mgi-lb-divider" />
                            <div className="mgi-lb-stat orange">
                              <span className="mgi-lb-stat-val">{cal}</span>
                              <span className="mgi-lb-stat-label">kcal</span>
                            </div>
                          </div>
                          <p className="mgi-lb-desc">Fresh, premium ingredients prepared by our in-flight culinary team. Served at 35,000 feet! ✈️</p>
                          <button className="mgi-lb-close" onClick={() => setSelected(null)}>✕ Close</button>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* Grid */}
              <div className="meal-gallery-grid">
                {filtered.map((dish, i) => {
                  const price = getMealPrice(i, dish.strMeal);
                  const cal   = getMealCalories(i, dish.strMeal);
                  const cat   = getMealCategory(dish);
                  return (
                    <motion.div
                      key={dish.idMeal}
                      className="meal-gallery-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.4) }}
                      whileHover={{ y: -8, transition: { duration: 0.25 } }}
                      onClick={() => setSelected(dish.idMeal)}
                    >
                      <div className="mgi-img-wrap">
                        <img src={dish.strMealThumb} alt={dish.strMeal} loading="lazy"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300'; }} />
                        <div className="mgi-img-gradient" />
                        <span className="mgi-category">{cat}</span>
                        <div className="mgi-zoom-hint"><Eye size={16}/> View</div>
                      </div>
                      <div className="mgi-info">
                        <p className="mgi-name">{dish.strMeal}</p>
                        <div className="mgi-meta">
                          <span className="mgi-price">💵 ${price}</span>
                          <span className="mgi-cal">🔥 {cal} kcal</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main PassengerForm ──────────────────────────────────────────────────────
const PassengerForm = ({ onConfirm, onCancel, passengerCount = 1 }) => {
  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount }, () => ({
      name: '',
      age: '',
      gender: 'Male',
      idNumber: '',
      meal: 'Standard Veg',
      drink: 'Apple Juice',
      dessert: 'Chocolate Cake',
      baggage: '15kg (Included)',
      priority: false
    }))
  );
  const [showMealGallery, setShowMealGallery] = useState(null); // index of passenger

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(passengers);
  };

  return (
    <>
      <div className="modal-overlay">
        <motion.div
          className="passenger-form-modal glass-panel"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="pf-header">
            <div>
              <h2 className="pf-title">Passenger Details</h2>
              <p className="text-muted text-xs uppercase tracking-widest">
                {passengerCount} traveller{passengerCount > 1 ? 's' : ''} · Step 2 of 3
              </p>
            </div>
            <button className="close-btn-circle" onClick={onCancel}><X size={18}/></button>
          </div>

          {/* Progress bar */}
          <div className="pf-progress">
            <div className="pf-progress-fill" style={{ width: '66%' }}></div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-form">
            <div className="passengers-list">
              {passengers.map((p, idx) => (
                <motion.div
                  key={idx}
                  className="passenger-entry"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="p-entry-header">
                    <div className="p-num-badge">
                      <UserCheck size={14} />
                      <span>Passenger {idx + 1}</span>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-input-group">
                      <label>Full Name</label>
                      <div className="p-input-wrap">
                        <User size={16} className="p-icon" />
                        <input 
                          type="text" 
                          required 
                          value={p.name}
                          onChange={(e) => handleChange(idx, 'name', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="p-grid-row">
                      <div className="p-input-group">
                        <label>Age</label>
                        <input 
                          type="number" 
                          required 
                          min="1" 
                          max="120"
                          value={p.age}
                          onChange={(e) => handleChange(idx, 'age', e.target.value)}
                          placeholder="25"
                        />
                      </div>
                      <div className="p-input-group">
                        <label>Gender</label>
                        <select 
                          value={p.gender}
                          onChange={(e) => handleChange(idx, 'gender', e.target.value)}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-input-group">
                      <label>ID / Passport Number</label>
                      <div className="p-input-wrap">
                        <CreditCard size={16} className="p-icon" />
                        <input 
                          type="text" 
                          required 
                          value={p.idNumber}
                          onChange={(e) => handleChange(idx, 'idNumber', e.target.value)}
                          placeholder="A12345678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add-ons Section */}
                  <div className="p-addons-grid">
                      <div className="p-input-group">
                          <label>Meal Preferences</label>
                          <select 
                              value={p.meal}
                              onChange={(e) => handleChange(idx, 'meal', e.target.value)}
                          >
                              <option value="Standard Veg">Standard Veg</option>
                              <option value="Standard Non-Veg">Standard Non-Veg</option>
                              <option value="Asian Vegetarian">Asian Vegetarian</option>
                              <option value="Low Sodium">Low Sodium</option>
                              <option value="No Meal">No Meal</option>
                          </select>
                      </div>
                      <div className="p-input-group">
                          <label>Drink Selection</label>
                          <select 
                              value={p.drink || 'Juice'}
                              onChange={(e) => handleChange(idx, 'drink', e.target.value)}
                          >
                              <option value="Apple Juice">Apple Juice</option>
                              <option value="Orange Juice">Orange Juice</option>
                              <option value="Coffee">Premium Coffee</option>
                              <option value="Tea">Green Tea</option>
                              <option value="Wine">Red Wine (Premium only)</option>
                          </select>
                      </div>
                      <div className="p-input-group">
                          <label>Dessert Choice</label>
                          <select 
                              value={p.dessert || 'None'}
                              onChange={(e) => handleChange(idx, 'dessert', e.target.value)}
                          >
                              <option value="None">No Dessert</option>
                              <option value="Chocolate Cake">Chocolate Lava Cake</option>
                              <option value="Fruit Salad">Fresh Fruit Salad</option>
                              <option value="Pudding">Vanilla Pudding</option>
                          </select>
                      </div>
                      <div className="p-input-group">
                          <label>Extra Baggage</label>
                          <select 
                              value={p.baggage}
                              onChange={(e) => handleChange(idx, 'baggage', e.target.value)}
                          >
                              <option value="15kg (Included)">15kg (Included)</option>
                              <option value="20kg (+$18)">20kg (+$18)</option>
                              <option value="25kg (+$30)">25kg (+$30)</option>
                              <option value="30kg (+$48)">30kg (+$48)</option>
                          </select>
                      </div>
                  </div>

                  {/* Meal Preview Section — Premium Card */}
                  {p.meal !== 'No Meal' && (
                    <motion.div
                      className="pf-meal-preview meal-preview-clickable"
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setShowMealGallery({ index: idx, meal: p.meal })}
                    >
                      {/* Banner Image */}
                      <div className="meal-banner">
                        <img
                          src="https://images.unsplash.com/photo-1546793665-c74683c3f43d?w=800&q=80"
                          alt="Healthy Meal Selection"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'; }}
                        />
                        <div className="meal-banner-gradient" />
                        <div className="meal-banner-badge">✈ In-Flight Meal</div>
                      </div>

                      {/* Info row */}
                      <div className="meal-card-body">
                        <div className="meal-tags">
                          <span className="meal-tag meal">🍽 {p.meal}</span>
                          <span className="meal-tag drink">🥤 {p.drink || 'Apple Juice'}</span>
                          <span className="meal-tag dessert">🍰 {p.dessert || 'Dessert'}</span>
                        </div>
                        <button className="meal-browse-btn" type="button">
                          <Eye size={15} /> Browse 20+ Dishes
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="p-priority-check">
                      <label className="checkbox-wrap">
                          <input 
                              type="checkbox" 
                              checked={p.priority}
                              onChange={(e) => handleChange(idx, 'priority', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          <div className="priority-info">
                              <span className="p-label">Priority Boarding (+$7)</span>
                              <span className="p-desc">Skip the lines and board the aircraft first.</span>
                          </div>
                      </label>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pf-footer">
              <button type="button" className="btn-secondary flex-center gap-2" onClick={onCancel}>
                <ChevronLeft size={18} /> Back
              </button>
              <button type="submit" className="btn-primary flex-center gap-2">
                Seat Selection <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Meal Gallery Modal */}
      {showMealGallery && (
        <MealGalleryModal
          mealType={showMealGallery.meal}
          onClose={() => setShowMealGallery(null)}
        />
      )}
    </>
  );
};

export default PassengerForm;
