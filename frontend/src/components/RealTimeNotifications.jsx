import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import toast from 'react-hot-toast';

const RealTimeNotifications = () => {
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (!socket) return;
        
        const handleNotification = (data) => {
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                }`}
                style={{ 
                  padding: '16px', 
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.95)', 
                  backdropFilter: 'blur(12px)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  border: '1px solid rgba(88, 166, 255, 0.4)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(88, 166, 255, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '4px', background: 'linear-gradient(to bottom, #58a6ff, #2b5cff)' }} />
                <div style={{ fontSize: '28px', filter: 'drop-shadow(0 0 8px rgba(255,200,0,0.5))' }}>🔥</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem', color: '#58a6ff', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Activity</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff', marginTop: '4px' }}>{data.message}</p>
                </div>
              </div>
            ), { position: 'bottom-left', duration: 5000 });
        };

        socket.on('globalBookingNotification', handleNotification);

        return () => {
            socket.off('globalBookingNotification', handleNotification);
        };
    }, [socket]);

    return null; // Silent observer component
};

export default RealTimeNotifications;
