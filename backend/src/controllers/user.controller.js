const { getFirestoreDb } = require('../config/firebase');

const getProfile = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(userDoc.data());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { name, phoneNumber, address } = req.body;

    await db.collection('users').doc(req.user.uid).update({
      name,
      phoneNumber,
      address,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { imageUrl } = req.body;

    await db.collection('users').doc(req.user.uid).update({
      profileImage: imageUrl,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Profile image updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const admin = require('firebase-admin');

    // Delete from Firestore
    await db.collection('users').doc(req.user.uid).delete();

    // Delete from Firebase Auth
    await admin.auth().deleteUser(req.user.uid);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteAccount,
};
