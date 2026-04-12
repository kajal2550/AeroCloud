import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherWidget = ({ destination }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Extract city name (e.g., "New York (JFK)" -> "New York")
        const city = destination.split('(')[0].trim();
        
        // 1. Geocoding
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          if (isMounted) setLoading(false);
          return;
        }
        
        const { latitude, longitude } = geoData.results[0];
        
        // 2. Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        if (isMounted) {
          setWeather(weatherData.current_weather);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch weather for", destination, err);
        if (isMounted) setLoading(false);
      }
    };
    
    if (destination) fetchWeather();
    
    return () => { isMounted = false; };
  }, [destination]);

  if (loading) return (
    <div className="flex-center" style={{ padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.03)' }}>
      <Loader size={14} className="spin text-muted" />
    </div>
  );
  
  if (!weather) return null;

  // WMO Weather code mapping (https://open-meteo.com/en/docs)
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun size={14} style={{ color: '#fbbf24' }} title="Clear sky" />;
    if (code >= 1 && code <= 3) return <Cloud size={14} style={{ color: '#94a3b8' }} title="Partly cloudy" />;
    if (code >= 45 && code <= 48) return <CloudFog size={14} style={{ color: '#64748b' }} title="Fog" />;
    if (code >= 51 && code <= 67) return <CloudRain size={14} style={{ color: '#38bdf8' }} title="Rain" />;
    if (code >= 71 && code <= 77) return <Snowflake size={14} style={{ color: '#e0f2fe' }}  title="Snow" />;
    if (code >= 80 && code <= 82) return <CloudRain size={14} style={{ color: '#38bdf8' }} title="Rain showers" />;
    if (code >= 95 && code <= 99) return <CloudLightning size={14} style={{ color: '#f87171' }} title="Thunderstorm" />;
    return <Cloud size={14} style={{ color: '#94a3b8' }} />;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex-center gap-1" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '4px 8px', 
          borderRadius: '12px', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)',
          fontSize: '12px',
          color: 'var(--text-main)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        title={`Current weather in ${destination}`}
      >
        {getWeatherIcon(weather.weathercode)}
        <span style={{ fontWeight: '600', marginLeft: '2px' }}>{Math.round(weather.temperature)}°C</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherWidget;
