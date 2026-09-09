const express = require('express');
const router = express.Router();
const { driverDb } = require('../config/database');

// Get all drivers
router.get('/', (req, res) => {
  try {
    const drivers = driverDb.findAll();
    res.json({
      success: true,
      message: 'Drivers retrieved successfully',
      data: drivers,
      count: drivers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving drivers',
      error: error.message,
    });
  }
});

// Get available drivers
router.get('/available', (req, res) => {
  try {
    const drivers = driverDb.findAvailable();
    res.json({
      success: true,
      message: 'Available drivers retrieved successfully',
      data: drivers,
      count: drivers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving available drivers',
      error: error.message,
    });
  }
});

// Get driver by ID
router.get('/:id', (req, res) => {
  try {
    const driver = driverDb.findById(parseInt(req.params.id));
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }
    res.json({
      success: true,
      message: 'Driver retrieved successfully',
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving driver',
      error: error.message,
    });
  }
});

// Create new driver
router.post('/', (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      licenseNumber,
      vehicleNumber,
      vehicleType,
    } = req.body;

    // Basic validation
    if (!name || !email || !phone || !password || !licenseNumber || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message:
          'Name, email, phone, password, license number, and vehicle number are required',
      });
    }

    // Check if driver already exists
    const existingDriver = driverDb.findByEmail(email);
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this email already exists',
      });
    }

    const newDriver = driverDb.create({
      name,
      email,
      phone,
      password, // In production, this should be hashed
      licenseNumber,
      vehicleNumber,
      vehicleType: vehicleType || 'economy',
      profilePicture: null,
      isAvailable: true,
      currentLocation: null,
    });

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: newDriver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating driver',
      error: error.message,
    });
  }
});

// Update driver
router.put('/:id', (req, res) => {
  try {
    const driver = driverDb.findById(parseInt(req.params.id));
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    const updatedDriver = driverDb.update(parseInt(req.params.id), req.body);

    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: updatedDriver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating driver',
      error: error.message,
    });
  }
});

// Update driver availability
router.patch('/:id/availability', (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (isAvailable === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isAvailable field is required',
      });
    }

    const updatedDriver = driverDb.update(parseInt(req.params.id), {
      isAvailable,
    });

    res.json({
      success: true,
      message: 'Driver availability updated successfully',
      data: updatedDriver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating driver availability',
      error: error.message,
    });
  }
});

// Delete driver
router.delete('/:id', (req, res) => {
  try {
    const driver = driverDb.findById(parseInt(req.params.id));
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    driverDb.delete(parseInt(req.params.id));

    res.json({
      success: true,
      message: 'Driver deleted successfully',
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting driver',
      error: error.message,
    });
  }
});

module.exports = router;
