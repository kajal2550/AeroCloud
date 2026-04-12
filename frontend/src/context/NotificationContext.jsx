import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Welcome to AeroCloud!', read: false, time: new Date() }
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const addNotification = (message) => {
    setNotifications(prev => [{ id: Date.now().toString(), message, read: false, time: new Date() }, ...prev]);
    setIsDropdownOpen(true);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  React.useEffect(() => {
    if (isDropdownOpen) {
      const timer = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isDropdownOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, unreadCount, isDropdownOpen, setIsDropdownOpen }}>
      {children}
    </NotificationContext.Provider>
  );
};
