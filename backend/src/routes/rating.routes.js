const express = require('express');
const router = express.Router();
const { ratingDb, rideDb } = require('../config/database');

// Create rating
router.post('/', (req, res) => {
  try {
    const { rideId, ratedBy, ratedTo, rating, review, ratedByType } = req.body;

    // Validation
    if (!rideId || !ratedBy || !ratedTo || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'rideId, ratedBy, ratedTo, and rating are required',
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const ride = rideDb.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    const newRating = ratingDb.create({
      rideId,
      ratedBy,
      ratedTo,
      rating,
      review: review || '',
      ratedByType: ratedByType || 'customer', // customer or driver
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: newRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message,
    });
  }
});

// Get all ratings
router.get('/', (req, res) => {
  try {
    const ratings = ratingDb.findAll();
    res.json({
      success: true,
      message: 'Ratings retrieved successfully',
      data: ratings,
      count: ratings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving ratings',
      error: error.message,
    });
  }
});

// Get rating by ID
router.get('/:id', (req, res) => {
  try {
    const rating = ratingDb.findById(parseInt(req.params.id));
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found',
      });
    }
    res.json({
      success: true,
      message: 'Rating retrieved successfully',
      data: rating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving rating',
      error: error.message,
    });
  }
});

// Get ratings by ride ID
router.get('/ride/:rideId', (req, res) => {
  try {
    const ratings = ratingDb.findByRideId(parseInt(req.params.rideId));
    res.json({
      success: true,
      message: 'Ratings retrieved successfully',
      data: ratings,
      count: ratings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving ratings',
      error: error.message,
    });
  }
});

// Get average rating for a user/driver
router.get('/average/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const allRatings = ratingDb.findAll();
    
    const userRatings = allRatings.filter(r => r.ratedTo === userId);
    
    if (userRatings.length === 0) {
      return res.json({
        success: true,
        message: 'No ratings found',
        data: {
          userId,
          averageRating: 0,
          totalRatings: 0,
          ratings: [],
        },
      });
    }

    const totalRating = userRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / userRatings.length).toFixed(2);

    res.json({
      success: true,
      message: 'Average rating retrieved successfully',
      data: {
        userId,
        averageRating: parseFloat(averageRating),
        totalRatings: userRatings.length,
        ratings: userRatings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating average rating',
      error: error.message,
    });
  }
});

// Update rating
router.put('/:id', (req, res) => {
  try {
    const rating = ratingDb.findById(parseInt(req.params.id));
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found',
      });
    }

    // Validate rating if provided
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const updatedRating = ratingDb.update(parseInt(req.params.id), req.body);

    res.json({
      success: true,
      message: 'Rating updated successfully',
      data: updatedRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating rating',
      error: error.message,
    });
  }
});

// Delete rating
router.delete('/:id', (req, res) => {
  try {
    const rating = ratingDb.findById(parseInt(req.params.id));
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found',
      });
    }

    ratingDb.delete(parseInt(req.params.id));

    res.json({
      success: true,
      message: 'Rating deleted successfully',
      data: rating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting rating',
      error: error.message,
    });
  }
});

module.exports = router;
