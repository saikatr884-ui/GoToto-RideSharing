const express = require('express');
const router = express.Router();
const { userDb, driverDb } = require('../config/database');

// Login user
router.post('/login', (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    let user;
    if (userType === 'driver') {
      user = driverDb.findByEmail(email);
    } else {
      user = userDb.findByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // In production, use bcrypt for password verification
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    // Generate token (mock JWT)
    const token = `token_${user.id}_${Date.now()}`;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: userType || 'customer',
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
});

// Signup user (customer)
router.post('/signup', (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required',
      });
    }

    // Check if user already exists
    let existingUser;
    if (userType === 'driver') {
      existingUser = driverDb.findByEmail(email);
    } else {
      existingUser = userDb.findByEmail(email);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    let newUser;
    const token = `token_${Date.now()}`;

    if (userType === 'driver') {
      newUser = driverDb.create({
        name,
        email,
        phone,
        password, // In production, hash this
        licenseNumber: '',
        vehicleNumber: '',
        vehicleType: 'economy',
        isAvailable: true,
      });
    } else {
      newUser = userDb.create({
        name,
        email,
        phone,
        password, // In production, hash this
        profilePicture: null,
        address: '',
        paymentMethods: [],
      });
    }

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        userType: userType || 'customer',
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during signup',
      error: error.message,
    });
  }
});

// Get profile
router.get('/profile/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Try to find as customer first
    let user = userDb.findById(userId);
    let userType = 'customer';

    // If not found, try as driver
    if (!user) {
      user = driverDb.findById(userId);
      userType = 'driver';
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        ...user,
        userType,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile',
      error: error.message,
    });
  }
});

module.exports = router;
