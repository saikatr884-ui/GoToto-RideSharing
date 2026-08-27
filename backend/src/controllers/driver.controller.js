const { getFirestoreDb } = require('../config/firebase');

const registerDriver = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { licenseNumber, licenseExpiry, vehicleDetails, insurance, bankDetails } = req.body;

    const driverData = {
      uid: req.user.uid,
      licenseNumber,
      licenseExpiry,
      licenseDocument: null,
      vehicleDetails,
      insurance,
      backgroundCheck: {
        status: 'pending',
        date: null,
      },
      bankDetails,
      status: 'pending',
      rating: 0,
      totalRides: 0,
      totalEarnings: 0,
      currentLocation: null,
      isOnline: false,
      createdAt: new Date().toISOString(),
    };

    await db.collection('drivers').doc(req.user.uid).set(driverData);

    res.status(201).json({ message: 'Driver registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDriverProfile = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const driverDoc = await db.collection('drivers').doc(req.user.uid).get();

    if (!driverDoc.exists) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    res.status(200).json(driverDoc.data());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDriverProfile = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { vehicleDetails, bankDetails } = req.body;

    await db.collection('drivers').doc(req.user.uid).update({
      vehicleDetails,
      bankDetails,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Driver profile updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDriverStatus = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { isOnline } = req.body;

    await db.collection('drivers').doc(req.user.uid).update({
      isOnline,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Driver status updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { latitude, longitude } = req.body;

    await db.collection('drivers').doc(req.user.uid).update({
      currentLocation: { latitude, longitude, updatedAt: new Date().toISOString() },
    });

    res.status(200).json({ message: 'Location updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getEarnings = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const driverDoc = await db.collection('drivers').doc(req.user.uid).get();

    if (!driverDoc.exists) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.status(200).json({
      totalEarnings: driverDoc.data().totalEarnings,
      totalRides: driverDoc.data().totalRides,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const driverDoc = await db.collection('drivers').doc(req.user.uid).get();

    if (!driverDoc.exists) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const driver = driverDoc.data();
    res.status(200).json({
      rating: driver.rating,
      totalRides: driver.totalRides,
      totalEarnings: driver.totalEarnings,
      status: driver.status,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAvailableDrivers = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const driversSnapshot = await db
      .collection('drivers')
      .where('isOnline', '==', true)
      .where('status', '==', 'active')
      .get();

    const drivers = driversSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(drivers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { licenseDocument, insuranceDocument } = req.body;

    await db.collection('drivers').doc(req.user.uid).update({
      licenseDocument,
      'insurance.document': insuranceDocument,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Documents uploaded successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  updateDriverStatus,
  updateLocation,
  getEarnings,
  getStatistics,
  getAvailableDrivers,
  uploadDocuments,
};
