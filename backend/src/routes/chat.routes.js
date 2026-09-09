const express = require('express');
const router = express.Router();
const { chatDb, rideDb } = require('../config/database');

// Get chat by ride ID
router.get('/ride/:rideId', (req, res) => {
  try {
    const chat = chatDb.findByRideId(parseInt(req.params.rideId));
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found for this ride',
      });
    }
    res.json({
      success: true,
      message: 'Chat retrieved successfully',
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving chat',
      error: error.message,
    });
  }
});

// Get all chats
router.get('/', (req, res) => {
  try {
    const chats = chatDb.findAll();
    res.json({
      success: true,
      message: 'Chats retrieved successfully',
      data: chats,
      count: chats.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving chats',
      error: error.message,
    });
  }
});

// Get chat by ID
router.get('/:id', (req, res) => {
  try {
    const chat = chatDb.findById(parseInt(req.params.id));
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }
    res.json({
      success: true,
      message: 'Chat retrieved successfully',
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving chat',
      error: error.message,
    });
  }
});

// Send message
router.post('/:id/message', (req, res) => {
  try {
    const { senderId, senderType, message } = req.body;

    // Validation
    if (!senderId || !senderType || !message) {
      return res.status(400).json({
        success: false,
        message: 'senderId, senderType, and message are required',
      });
    }

    const chat = chatDb.findById(parseInt(req.params.id));
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    const updatedChat = chatDb.addMessage(parseInt(req.params.id), {
      senderId,
      senderType, // customer, driver
      message,
      read: false,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: updatedChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message,
    });
  }
});

// Get messages for a chat
router.get('/:id/messages', (req, res) => {
  try {
    const chat = chatDb.findById(parseInt(req.params.id));
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.json({
      success: true,
      message: 'Messages retrieved successfully',
      data: {
        chatId: chat.id,
        rideId: chat.rideId,
        messages: chat.messages,
        messageCount: chat.messages.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving messages',
      error: error.message,
    });
  }
});

// Mark messages as read
router.patch('/:id/mark-read', (req, res) => {
  try {
    const chat = chatDb.findById(parseInt(req.params.id));
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Mark all messages as read
    chat.messages.forEach(msg => (msg.read = true));
    const updatedChat = chatDb.update(parseInt(req.params.id), chat);

    res.json({
      success: true,
      message: 'Messages marked as read',
      data: updatedChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message,
    });
  }
});

// Delete chat
router.delete('/:id', (req, res) => {
  try {
    const chat = chatDb.findById(parseInt(req.params.id));
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    chatDb.delete(parseInt(req.params.id));

    res.json({
      success: true,
      message: 'Chat deleted successfully',
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting chat',
      error: error.message,
    });
  }
});

module.exports = router;
