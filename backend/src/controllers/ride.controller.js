const { getFirestoreDb } = require('../config/firebase');

const bookRide = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { pickupLocation, dropoffLocation, rideType } = req.body;

    const rideData = {
      customerId: req.user.uid,
      driverId: null,
      pickupLocation,
      dropoffLocation,
      status: 'requested',
      rideType,
      fare: 0,
      distance: 0,
      duration: 0,
      paymentMethod: 'card',
      paymentStatus: 'pending',
      ratedByCustomer: false,
      ratedByDriver: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('rides').add(rideData);

    res.status(201).json({
      message: 'Ride booked successfully',
      rideId: docRef.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActiveRides = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const ridesSnapshot = await db
      .collection('rides')
      .where('customerId', '==', req.user.uid)
      .where('status', 'in', ['requested', 'accepted', 'ongoing'])
      .get();

    const rides = ridesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(rides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRideHistory = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const ridesSnapshot = await db
      .collection('rides')
      .where('customerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const rides = ridesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(rides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRideDetails = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;

    const rideDoc = await db.collection('rides').doc(id).get();

    if (!rideDoc.exists) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.status(200).json({ id: rideDoc.id, ...rideDoc.data() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelRide = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;

    await db.collection('rides').doc(id).update({
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const acceptRide = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;

    await db.collection('rides').doc(id).update({
      driverId: req.user.uid,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Ride accepted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const startRide = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;

    await db.collection('rides').doc(id).update({
      status: 'ongoing',
      startedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Ride started' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const completeRide = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;
    const { fare, distance, duration } = req.body;

    await db.collection('rides').doc(id).update({
      status: 'completed',
      fare,
      distance,
      duration,
      completedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Ride completed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNearbyDrivers = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { latitude, longitude } = req.query;

    // Simple nearby drivers query (in production use geohashing)
    const driversSnapshot = await db
      .collection('drivers')
      .where('isOnline', '==', true)
      .where('status', '==', 'active')
      .get();

    const drivers = driversSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(drivers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  bookRide,
  getActiveRides,
  getRideHistory,
  getRideDetails,
  cancelRide,
  acceptRide,
  startRide,
  completeRide,
  getNearbyDrivers,
};
