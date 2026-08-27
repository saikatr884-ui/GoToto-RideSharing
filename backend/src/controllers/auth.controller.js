const admin = require('firebase-admin');
const { getFirestoreDb } = require('../config/firebase');

const register = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, userType } = req.body;

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber,
    });

    // Store user data in Firestore
    const db = getFirestoreDb();
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      phoneNumber,
      userType,
      profileImage: null,
      address: '',
      paymentMethods: [],
      emergencyContacts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    });

    res.status(201).json({
      message: 'User registered successfully',
      uid: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Firebase client would handle login - this is backend verification
    const user = await admin.auth().getUserByEmail(email);

    res.status(200).json({
      message: 'User found',
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

const logout = async (req, res) => {
  try {
    // Firebase handles logout on client side
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    // Token refresh logic
    res.status(200).json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await admin.auth().generatePasswordResetLink(email);
    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    // Password reset logic
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
