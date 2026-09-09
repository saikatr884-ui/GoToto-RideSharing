const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./src/routes/user.routes');
const driverRoutes = require('./src/routes/driver.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'GoToto Backend API is running',
    version: '1.0.0',
    status: 'active',
    database: 'Mock (In-Memory)',
    endpoints: [
      'GET /api/health',
      'GET /api/users',
      'POST /api/users',
      'GET /api/users/:id',
      'PUT /api/users/:id',
      'DELETE /api/users/:id',
      'GET /api/drivers',
      'POST /api/drivers',
      'GET /api/drivers/:id',
      'PATCH /api/drivers/:id/availability',
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GoToto Backend Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: Mock In-Memory Database`);
  console.log(`\n📍 API Endpoints:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(`   http://localhost:${PORT}/api/users`);
  console.log(`   http://localhost:${PORT}/api/drivers`);
});

module.exports = app;
