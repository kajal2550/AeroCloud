import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm AeroBot. How can I assist you with your flight today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const responses = {
    "baggage": "Standard baggage allowance is 15kg for Economy and 30kg for Business class. You can add extra baggage during booking or at the airport.",
    "checkin": "Web check-in opens 24 hours before departure and closes 2 hours before the flight. You can do it from your Dashboard.",
    "cancel": "You can cancel your flight from the Dashboard 24 hours before departure for a full refund.",
    "points": "You earn 10 AeroPoints for every $10 spent. Points can be redeemed for discounts on future bookings.",
    "contact": "You can reach our premium support at support@aerocloud.com or call +1-800-AERO-FLY.",
    "hi": "Hello! How can I help you today?",
    "hlo": "Hey! How can I assist you with AeroCloud services?",
    "hey": "Hi there! Looking for a flight or have a query?",
    "hello": "Hi there! Welcome to AeroCloud support.",
    "booking": "You can book flights directly from our home page search. Select your destination, pick a seat, and pay securely.",
    "flight": "We operate over 500 international routes. Use the search bar to find the best deals for your journey.",
    "price": "Our prices are dynamic and include all taxes. We also offer multi-currency support (USD, INR, EUR, etc).",
    "thanks": "You're welcome! Have a great journey.",
    "thank you": "Happy to help! Blue skies ahead."
  };

  const [isTyping, setIsTyping] = useState(false);

  const fallbacks = [
    "That's a great question! As an AeroCloud AI, I recommend checking our official travel guidelines for more details.",
    "I'm still learning, but I can tell you that AeroCloud is the best choice for your journey. Try asking about luggage or booking!",
    "Interesting! While I don't have a specific answer for that, I can help you find the best flights. Just type 'flights'.",
    "I'm here to ensure your journey is smooth. For specific account issues, please contact our support at support@aerocloud.com.",
    "AeroCloud is always evolving. Is there anything specific about your upcoming trip I can help with?"
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Bot response logic
    setTimeout(() => {
      const lowerInput = currentInput.toLowerCase();
      let botText = fallbacks[Math.floor(Math.random() * fallbacks.length)];

      for (const key in responses) {
        if (lowerInput.includes(key)) {
          botText = responses[key];
          break;
        }
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-window glass-panel"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
          >
            <div className="chatbot-header">
              <div className="bot-info">
                <div className="bot-avatar"><Bot size={20} /></div>
                <div>
                  <h4>AeroBot</h4>
                  <span className="online-pulse">Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>

            <div className="chatbot-messages" ref={scrollRef}>
              {messages.map(msg => (
                <div key={msg.id} className={`message-wrap ${msg.sender}`}>
                  <div className="message-content">
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message-wrap bot">
                  <div className="message-content typing">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                </div>
              )}
            </div>

            <form className="chatbot-input" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Type your question..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit"><Send size={18} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className="chatbot-toggle-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: isOpen ? 'var(--error)' : 'var(--primary-gradient)' }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
