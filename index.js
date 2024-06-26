const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let userCount=0;
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');
  userCount++;
  io.emit('userCount', userCount);
  console.log(userCount);
  // Broadcast drawing data to all other clients
  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    userCount--;
    io.emit('userCount', userCount);
    console.log(userCount);
  });

  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
