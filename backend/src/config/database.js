// Mock Database Configuration
// This is a temporary in-memory database for development

const mockDatabase = {
  users: [],
  drivers: [],
  rides: [],
  payments: [],
  ratings: [],
  chats: [],
};

let idCounter = {
  user: 1000,
  driver: 2000,
  ride: 3000,
  payment: 4000,
  rating: 5000,
  chat: 6000,
};

// Helper function to generate IDs
const generateId = (type) => {
  idCounter[type]++;
  return idCounter[type];
};

// User operations
const userDb = {
  create: (userData) => {
    const user = {
      id: generateId('user'),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDatabase.users.push(user);
    return user;
  },

  findById: (id) => {
    return mockDatabase.users.find(user => user.id === id);
  },

  findByEmail: (email) => {
    return mockDatabase.users.find(user => user.email === email);
  },

  findAll: () => {
    return mockDatabase.users;
  },

  update: (id, userData) => {
    const user = mockDatabase.users.find(user => user.id === id);
    if (user) {
      Object.assign(user, userData, { updatedAt: new Date() });
    }
    return user;
  },

  delete: (id) => {
    const index = mockDatabase.users.findIndex(user => user.id === id);
    if (index > -1) {
      return mockDatabase.users.splice(index, 1)[0];
    }
    return null;
  },
};

// Driver operations
const driverDb = {
  create: (driverData) => {
    const driver = {
      id: generateId('driver'),
      ...driverData,
      verified: false,
      rating: 5.0,
      totalRides: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDatabase.drivers.push(driver);
    return driver;
  },

  findById: (id) => {
    return mockDatabase.drivers.find(driver => driver.id === id);
  },

  findByEmail: (email) => {
    return mockDatabase.drivers.find(driver => driver.email === email);
  },

  findAll: () => {
    return mockDatabase.drivers;
  },

  findAvailable: () => {
    return mockDatabase.drivers.filter(driver => driver.isAvailable === true);
  },

  update: (id, driverData) => {
    const driver = mockDatabase.drivers.find(driver => driver.id === id);
    if (driver) {
      Object.assign(driver, driverData, { updatedAt: new Date() });
    }
    return driver;
  },

  delete: (id) => {
    const index = mockDatabase.drivers.findIndex(driver => driver.id === id);
    if (index > -1) {
      return mockDatabase.drivers.splice(index, 1)[0];
    }
    return null;
  },
};

// Ride operations
const rideDb = {
  create: (rideData) => {
    const ride = {
      id: generateId('ride'),
      ...rideData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDatabase.rides.push(ride);
    return ride;
  },

  findById: (id) => {
    return mockDatabase.rides.find(ride => ride.id === id);
  },

  findByUserId: (userId) => {
    return mockDatabase.rides.filter(ride => ride.userId === userId);
  },

  findByDriverId: (driverId) => {
    return mockDatabase.rides.filter(ride => ride.driverId === driverId);
  },

  findActive: () => {
    return mockDatabase.rides.filter(ride => 
      ride.status === 'accepted' || ride.status === 'in_progress'
    );
  },

  findAll: () => {
    return mockDatabase.rides;
  },

  update: (id, rideData) => {
    const ride = mockDatabase.rides.find(ride => ride.id === id);
    if (ride) {
      Object.assign(ride, rideData, { updatedAt: new Date() });
    }
    return ride;
  },

  delete: (id) => {
    const index = mockDatabase.rides.findIndex(ride => ride.id === id);
    if (index > -1) {
      return mockDatabase.rides.splice(index, 1)[0];
    }
    return null;
  },
};

// Payment operations
const paymentDb = {
  create: (paymentData) => {
    const payment = {
      id: generateId('payment'),
      ...paymentData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDatabase.payments.push(payment);
    return payment;
  },

  findById: (id) => {
    return mockDatabase.payments.find(payment => payment.id === id);
  },

  findByRideId: (rideId) => {
    return mockDatabase.payments.find(payment => payment.rideId === rideId);
  },

  findAll: () => {
    return mockDatabase.payments;
  },

  update: (id, paymentData) => {
    const payment = mockDatabase.payments.find(payment => payment.id === id);
    if (payment) {
      Object.assign(payment, paymentData, { updatedAt: new Date() });
    }
    return payment;
  },

  delete: (id) => {
    const index = mockDatabase.payments.findIndex(payment => payment.id === id);
    if (index > -1) {
      return mockDatabase.payments.splice(index, 1)[0];
    }
    return null;
  },
};

// Rating operations
const ratingDb = {
  create: (ratingData) => {
    const rating = {
      id: generateId('rating'),
      ...ratingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDatabase.ratings.push(rating);
    return rating;
  },

  findById: (id) => {
    return mockDatabase.ratings.find(rating => rating.id === id);
  },

  findByRideId: (rideId) => {
    return mockDatabase.ratings.filter(rating => rating.rideId === rideId);
  },

  findAll: () => {
    return mockDatabase.ratings;
  },

  update: (id, ratingData) => {
    const rating = mockDatabase.ratings.find(rating => rating.id === id);
    if (rating) {
      Object.assign(rating, ratingData, { updatedAt: new Date() });
    }
    return rating;
  },

  delete: (id) => {
    const index = mockDatabase.ratings.findIndex(rating => rating.id === id);
    if (index > -1) {
      return mockDatabase.ratings.splice(index, 1)[0];
    }
    return null;
  },
};

// Chat operations
const chatDb = {
  create: (chatData) => {
    const chat = {
      id: generateId('chat'),
      ...chatData,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDatabase.chats.push(chat);
    return chat;
  },

  findById: (id) => {
    return mockDatabase.chats.find(chat => chat.id === id);
  },

  findByRideId: (rideId) => {
    return mockDatabase.chats.find(chat => chat.rideId === rideId);
  },

  findAll: () => {
    return mockDatabase.chats;
  },

  addMessage: (chatId, message) => {
    const chat = mockDatabase.chats.find(c => c.id === chatId);
    if (chat) {
      chat.messages.push({
        id: Date.now(),
        ...message,
        timestamp: new Date(),
      });
      chat.updatedAt = new Date();
    }
    return chat;
  },

  update: (id, chatData) => {
    const chat = mockDatabase.chats.find(chat => chat.id === id);
    if (chat) {
      Object.assign(chat, chatData, { updatedAt: new Date() });
    }
    return chat;
  },

  delete: (id) => {
    const index = mockDatabase.chats.findIndex(chat => chat.id === id);
    if (index > -1) {
      return mockDatabase.chats.splice(index, 1)[0];
    }
    return null;
  },
};

// Export all database operations
module.exports = {
  mockDatabase,
  generateId,
  userDb,
  driverDb,
  rideDb,
  paymentDb,
  ratingDb,
  chatDb,
};
