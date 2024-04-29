const socket = io();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to window size

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


// Set initial canvas size


// Draw on canvas
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Handle mouse events
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  draw(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

// Handle touch events
canvas.addEventListener('touchstart', (e) => {
  isDrawing = true;
  const touch = e.touches[0];
  [lastX, lastY] = [touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop];
});

canvas.addEventListener('touchmove', (e) => {
  if (!isDrawing) return;
  e.preventDefault(); // Prevent scrolling on touch devices
  const touch = e.touches[0];
  const currentX = touch.clientX - canvas.offsetLeft;
  const currentY = touch.clientY - canvas.offsetTop;
  draw(currentX, currentY);
});

canvas.addEventListener('touchend', () => {
  isDrawing = false;
});

function draw(currentX, currentY) {
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  // Send drawing data to the server
  socket.emit('draw', { lastX, lastY, currentX, currentY });

  [lastX, lastY] = [currentX, currentY];
}

// Receive drawing data from the server
socket.on('draw', (data) => {
  ctx.beginPath();
  ctx.moveTo(data.lastX, data.lastY);
  ctx.lineTo(data.currentX, data.currentY);
  ctx.stroke();
});
