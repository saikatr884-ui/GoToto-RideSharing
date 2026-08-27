const { getFirestoreDb } = require('../config/firebase');

const createRating = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { rideId, ratedUserId, rating, review, categories } = req.body;

    const ratingData = {
      rideId,
      raterId: req.user.uid,
      ratedUserId,
      rating,
      review,
      categories,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('ratings').add(ratingData);

    res.status(201).json({
      message: 'Rating created successfully',
      ratingId: docRef.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { userId } = req.params;

    const ratingsSnapshot = await db
      .collection('ratings')
      .where('ratedUserId', '==', userId)
      .get();

    const ratings = ratingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(ratings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRideRatings = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { rideId } = req.params;

    const ratingsSnapshot = await db
      .collection('ratings')
      .where('rideId', '==', rideId)
      .get();

    const ratings = ratingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(ratings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { userId } = req.params;

    const ratingsSnapshot = await db
      .collection('ratings')
      .where('ratedUserId', '==', userId)
      .get();

    const ratings = ratingsSnapshot.docs.map(doc => doc.data().rating);
    const averageRating = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1)
      : 0;

    res.status(200).json({
      userId,
      averageRating,
      totalRatings: ratings.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRating = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;
    const { rating, review } = req.body;

    await db.collection('ratings').doc(id).update({
      rating,
      review,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Rating updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRating = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { id } = req.params;

    await db.collection('ratings').doc(id).delete();

    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRating,
  getUserRatings,
  getRideRatings,
  getAverageRating,
  updateRating,
  deleteRating,
};
