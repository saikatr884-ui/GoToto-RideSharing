const { getFirestoreDb } = require('../config/firebase');

const getRideMessages = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { rideId } = req.params;

    const messagesSnapshot = await db
      .collection('messages')
      .where('rideId', '==', rideId)
      .orderBy('createdAt', 'asc')
      .get();

    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { rideId } = req.params;
    const { receiverId, message } = req.body;

    const messageData = {
      rideId,
      senderId: req.user.uid,
      receiverId,
      message,
      type: 'text',
      attachmentUrl: null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('messages').add(messageData);

    res.status(201).json({
      message: 'Message sent successfully',
      messageId: docRef.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const db = getFirestoreDb();

    const conversationsSnapshot = await db
      .collection('messages')
      .where('senderId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const conversations = conversationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const db = getFirestoreDb();
    const { messageId } = req.params;

    await db.collection('messages').doc(messageId).delete();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRideMessages,
  sendMessage,
  getConversations,
  deleteMessage,
};
