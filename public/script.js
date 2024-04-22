const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Draw on canvas
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const currentX = e.offsetX;
  const currentY = e.offsetY;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  // Send drawing data to the server
  socket.emit('draw', { lastX, lastY, currentX, currentY });

  [lastX, lastY] = [currentX, currentY];
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

// Receive drawing data from the server
socket.on('draw', (data) => {
  ctx.beginPath();
  ctx.moveTo(data.lastX, data.lastY);
  ctx.lineTo(data.currentX, data.currentY);
  ctx.stroke();
});