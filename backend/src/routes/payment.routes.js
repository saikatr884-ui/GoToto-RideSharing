const express = require('express');
const router = express.Router();
const { paymentDb, rideDb } = require('../config/database');

// Create payment
router.post('/', (req, res) => {
  try {
    const {
      rideId,
      userId,
      driverId,
      amount,
      paymentMethod,
      transactionId,
    } = req.body;

    // Validation
    if (!rideId || !userId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'rideId, userId, amount, and paymentMethod are required',
      });
    }

    const ride = rideDb.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    const newPayment = paymentDb.create({
      rideId,
      userId,
      driverId: driverId || null,
      amount,
      paymentMethod, // card, wallet, upi, cash
      transactionId: transactionId || `TXN_${Date.now()}`,
      status: 'completed', // pending, completed, failed, refunded
    });

    // Update ride with payment
    rideDb.update(rideId, { paymentId: newPayment.id });

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: newPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message,
    });
  }
});

// Get payment by ID
router.get('/:id', (req, res) => {
  try {
    const payment = paymentDb.findById(parseInt(req.params.id));
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }
    res.json({
      success: true,
      message: 'Payment retrieved successfully',
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving payment',
      error: error.message,
    });
  }
});

// Get payment by ride ID
router.get('/ride/:rideId', (req, res) => {
  try {
    const payment = paymentDb.findByRideId(parseInt(req.params.rideId));
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this ride',
      });
    }
    res.json({
      success: true,
      message: 'Payment retrieved successfully',
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving payment',
      error: error.message,
    });
  }
});

// Get all payments
router.get('/', (req, res) => {
  try {
    const payments = paymentDb.findAll();
    res.json({
      success: true,
      message: 'Payments retrieved successfully',
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving payments',
      error: error.message,
    });
  }
});

// Update payment status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status is required',
      });
    }

    const payment = paymentDb.findById(parseInt(req.params.id));
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    const updatedPayment = paymentDb.update(parseInt(req.params.id), { status });

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message,
    });
  }
});

// Refund payment
router.patch('/:id/refund', (req, res) => {
  try {
    const payment = paymentDb.findById(parseInt(req.params.id));
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    const refundedPayment = paymentDb.update(parseInt(req.params.id), {
      status: 'refunded',
    });

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: refundedPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refunding payment',
      error: error.message,
    });
  }
});

module.exports = router;
