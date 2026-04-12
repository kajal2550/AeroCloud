const socketIo = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = socketIo(httpServer, {
      cors: {
        origin: '*', // For development, allow all
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected to socket.io:', socket.id);

      // Join a specific flight room for live seat updates
      socket.on('joinFlightRoom', (flightId) => {
          socket.join(flightId);
      });

      // Real-time Seat Locking broadcast
      socket.on('lockSeat', ({ flightId, seatId }) => {
          socket.to(flightId).emit('seatLockedByAnother', { seatId });
      });

      socket.on('unlockSeat', ({ flightId, seatId }) => {
          socket.to(flightId).emit('seatUnlocked', { seatId });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected from socket.io:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
