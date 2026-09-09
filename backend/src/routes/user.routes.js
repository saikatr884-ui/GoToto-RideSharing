const express = require('express');
const router = express.Router();
const { userDb } = require('../config/database');

// Get all users
router.get('/', (req, res) => {
  try {
    const users = userDb.findAll();
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
    });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const user = userDb.findById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message,
    });
  }
});

// Create new user
router.post('/', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Basic validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required',
      });
    }

    // Check if user already exists
    const existingUser = userDb.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const newUser = userDb.create({
      name,
      email,
      phone,
      password, // In production, this should be hashed
      profilePicture: null,
      address: '',
      paymentMethods: [],
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
});

// Update user
router.put('/:id', (req, res) => {
  try {
    const user = userDb.findById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updatedUser = userDb.update(parseInt(req.params.id), req.body);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
});

// Delete user
router.delete('/:id', (req, res) => {
  try {
    const user = userDb.findById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    userDb.delete(parseInt(req.params.id));

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
});

module.exports = router;
