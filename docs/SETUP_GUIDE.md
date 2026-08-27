# Backend Setup Guide

## Prerequisites

- Node.js v16 or higher
- npm or yarn
- Firebase Account
- MongoDB Atlas Account (Optional)
- Stripe/PayPal Account for payments

## Installation Steps

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

4. **Configure .env file**
```
# Server
PORT=5000
NODE_ENV=development

# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Payment Gateway
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Email Service
SENDGRID_API_KEY=your_sendgrid_key
```

5. **Start the server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Rides
- `POST /api/rides/book` - Book a ride
- `GET /api/rides/history` - Get ride history
- `PUT /api/rides/:id/cancel` - Cancel a ride
- `GET /api/rides/:id` - Get ride details

### Drivers
- `GET /api/drivers/available` - Get available drivers
- `PUT /api/drivers/:id/status` - Update driver status
- `GET /api/drivers/:id/earnings` - Get driver earnings

### Payments
- `POST /api/payments/charge` - Process payment
- `GET /api/payments/history` - Get payment history

### Ratings & Reviews
- `POST /api/ratings` - Create rating
- `GET /api/ratings/:userId` - Get user ratings

### Chat
- `GET /api/chats/:rideId` - Get chat messages
- `POST /api/chats/:rideId` - Send message

## Database Collections

### Firestore Collections
- `users` - User profiles and authentication
- `drivers` - Driver details and documents
- `rides` - Ride information
- `payments` - Payment records
- `ratings` - Rating and reviews
- `messages` - Chat messages

## Deployment

For production deployment, use:
```bash
npm run build
npm start
```

---

See main README.md for more information.
