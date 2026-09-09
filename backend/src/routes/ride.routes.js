const express = require('express');
const router = express.Router();
const { rideDb, userDb, driverDb, chatDb } = require('../config/database');

// Create a ride request
router.post('/', (req, res) => {
  try {
    const {
      userId,
      pickupLocation,
      dropLocation,
      pickupLat,
      pickupLng,
      dropLat,
      dropLng,
      rideType,
      estimatedFare,
    } = req.body;

    // Validation
    if (!userId || !pickupLocation || !dropLocation) {
      return res.status(400).json({
        success: false,
        message: 'userId, pickupLocation, and dropLocation are required',
      });
    }

    const user = userDb.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const newRide = rideDb.create({
      userId,
      driverId: null,
      pickupLocation,
      dropLocation,
      pickupLat: pickupLat || 0,
      pickupLng: pickupLng || 0,
      dropLat: dropLat || 0,
      dropLng: dropLng || 0,
      rideType: rideType || 'economy',
      estimatedFare: estimatedFare || 0,
      status: 'searching', // searching, accepted, in_progress, completed, cancelled
      startTime: null,
      endTime: null,
    });

    // Create chat for this ride
    chatDb.create({
      rideId: newRide.id,
      userId,
      driverId: null,
    });

    res.status(201).json({
      success: true,
      message: 'Ride request created successfully',
      data: newRide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating ride',
      error: error.message,
    });
  }
});

// Get all rides
router.get('/', (req, res) => {
  try {
    const rides = rideDb.findAll();
    res.json({
      success: true,
      message: 'Rides retrieved successfully',
      data: rides,
      count: rides.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving rides',
      error: error.message,
    });
  }
});

// Get ride by ID
router.get('/:id', (req, res) => {
  try {
    const ride = rideDb.findById(parseInt(req.params.id));
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }
    res.json({
      success: true,
      message: 'Ride retrieved successfully',
      data: ride,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving ride',
      error: error.message,
    });
  }
});

// Get rides by user ID
router.get('/user/:userId', (req, res) => {
  try {
    const rides = rideDb.findByUserId(parseInt(req.params.userId));
    res.json({
      success: true,
      message: 'User rides retrieved successfully',
      data: rides,
      count: rides.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user rides',
      error: error.message,
    });
  }
});

// Get active rides
router.get('/status/active', (req, res) => {
  try {
    const activeRides = rideDb.findActive();
    res.json({
      success: true,
      message: 'Active rides retrieved successfully',
      data: activeRides,
      count: activeRides.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active rides',
      error: error.message,
    });
  }
});

// Accept ride (driver accepts)
router.patch('/:id/accept', (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: 'driverId is required',
      });
    }

    const ride = rideDb.findById(parseInt(req.params.id));
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    const driver = driverDb.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    const updatedRide = rideDb.update(parseInt(req.params.id), {
      driverId,
      status: 'accepted',
    });

    // Update chat with driver info
    const chat = chatDb.findByRideId(ride.id);
    if (chat) {
      chatDb.update(chat.id, { driverId });
    }

    res.json({
      success: true,
      message: 'Ride accepted successfully',
      data: updatedRide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accepting ride',
      error: error.message,
    });
  }
});

// Start ride
router.patch('/:id/start', (req, res) => {
  try {
    const ride = rideDb.findById(parseInt(req.params.id));
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    const updatedRide = rideDb.update(parseInt(req.params.id), {
      status: 'in_progress',
      startTime: new Date(),
    });

    res.json({
      success: true,
      message: 'Ride started successfully',
      data: updatedRide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting ride',
      error: error.message,
    });
  }
});

// Complete ride
router.patch('/:id/complete', (req, res) => {
  try {
    const ride = rideDb.findById(parseInt(req.params.id));
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    const updatedRide = rideDb.update(parseInt(req.params.id), {
      status: 'completed',
      endTime: new Date(),
    });

    res.json({
      success: true,
      message: 'Ride completed successfully',
      data: updatedRide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing ride',
      error: error.message,
    });
  }
});

// Cancel ride
router.patch('/:id/cancel', (req, res) => {
  try {
    const ride = rideDb.findById(parseInt(req.params.id));
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    const updatedRide = rideDb.update(parseInt(req.params.id), {
      status: 'cancelled',
    });

    res.json({
      success: true,
      message: 'Ride cancelled successfully',
      data: updatedRide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling ride',
      error: error.message,
    });
  }
});

module.exports = router;
