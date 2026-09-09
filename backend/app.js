const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./src/routes/user.routes');
const driverRoutes = require('./src/routes/driver.routes');
const authRoutes = require('./src/routes/auth.routes');
const rideRoutes = require('./src/routes/ride.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const ratingRoutes = require('./src/routes/rating.routes');
const chatRoutes = require('./src/routes/chat.routes');

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
    endpoints: {
      auth: [
        'POST /api/auth/signup',
        'POST /api/auth/login',
        'GET /api/auth/profile/:userId',
      ],
      users: [
        'GET /api/users',
        'POST /api/users',
        'GET /api/users/:id',
        'PUT /api/users/:id',
        'DELETE /api/users/:id',
      ],
      drivers: [
        'GET /api/drivers',
        'GET /api/drivers/available',
        'POST /api/drivers',
        'GET /api/drivers/:id',
        'PUT /api/drivers/:id',
        'PATCH /api/drivers/:id/availability',
        'DELETE /api/drivers/:id',
      ],
      rides: [
        'POST /api/rides (create ride)',
        'GET /api/rides',
        'GET /api/rides/:id',
        'GET /api/rides/user/:userId',
        'GET /api/rides/status/active',
        'PATCH /api/rides/:id/accept',
        'PATCH /api/rides/:id/start',
        'PATCH /api/rides/:id/complete',
        'PATCH /api/rides/:id/cancel',
      ],
      payments: [
        'POST /api/payments (process payment)',
        'GET /api/payments',
        'GET /api/payments/:id',
        'GET /api/payments/ride/:rideId',
        'PATCH /api/payments/:id/status',
        'PATCH /api/payments/:id/refund',
      ],
      ratings: [
        'POST /api/ratings (submit rating)',
        'GET /api/ratings',
        'GET /api/ratings/:id',
        'GET /api/ratings/ride/:rideId',
        'GET /api/ratings/average/:userId',
        'PUT /api/ratings/:id',
        'DELETE /api/ratings/:id',
      ],
      chat: [
        'GET /api/chat',
        'GET /api/chat/:id',
        'GET /api/chat/ride/:rideId',
        'POST /api/chat/:id/message (send message)',
        'GET /api/chat/:id/messages',
        'PATCH /api/chat/:id/mark-read',
        'DELETE /api/chat/:id',
      ],
    }
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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/chat', chatRoutes);

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
  console.log(`\n📍 All API Endpoints Available at http://localhost:${PORT}`);
  console.log(`\n✅ Features Implemented:`);
  console.log(`   ✓ User Management (Customers)`);
  console.log(`   ✓ Driver Management`);
  console.log(`   ✓ Authentication (Login/Signup)`);
  console.log(`   ✓ Ride Booking & Management`);
  console.log(`   ✓ Payment Processing`);
  console.log(`   ✓ Ratings & Reviews`);
  console.log(`   ✓ In-app Chat System`);
});

module.exports = app;
