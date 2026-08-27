const { getFirestoreDb } = require('../config/firebase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const chargePayment = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { rideId, amount, paymentMethodId } = req.body;

    // Create Stripe charge
    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      source: paymentMethodId,
    });

    // Record payment in Firestore
    const paymentData = {
      rideId,
      userId: req.user.uid,
      amount,
      currency: 'INR',
      paymentMethod: 'card',
      status: 'successful',
      transactionId: charge.id,
      stripeChargeId: charge.id,
      breakdown: {
        baseFare: amount * 0.3,
        distanceFare: amount * 0.5,
        surgePricing: 0,
        taxes: amount * 0.1,
        discount: 0,
      },
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('payments').add(paymentData);

    res.status(201).json({
      message: 'Payment processed successfully',
      paymentId: docRef.id,
      transactionId: charge.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const paymentsSnapshot = await db
      .collection('payments')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const payments = paymentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;

    const paymentDoc = await db.collection('payments').doc(id).get();

    if (!paymentDoc.exists) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json({ id: paymentDoc.id, ...paymentDoc.data() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addPaymentCard = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { cardDetails } = req.body;

    // Create payment method in Stripe
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: cardDetails,
    });

    // Update user's payment methods
    await db.collection('users').doc(req.user.uid).update({
      paymentMethods: {
        id: paymentMethod.id,
        type: 'card',
        last4: paymentMethod.card.last4,
        isDefault: true,
      },
    });

    res.status(201).json({ message: 'Payment card added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPaymentCards = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    const paymentMethods = userDoc.data().paymentMethods || [];

    res.status(200).json(paymentMethods);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePaymentCard = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;

    // Delete from Stripe
    await stripe.paymentMethods.detach(id);

    res.status(200).json({ message: 'Payment card deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const refundPayment = async (req, res) => {
  try {
    const { chargeId, amount } = req.body;

    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: Math.round(amount * 100),
    });

    res.status(200).json({
      message: 'Refund processed successfully',
      refundId: refund.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  chargePayment,
  getPaymentHistory,
  getPaymentDetails,
  addPaymentCard,
  getPaymentCards,
  deletePaymentCard,
  refundPayment,
};
