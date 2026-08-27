# GoToto - Ride Sharing Application

A comprehensive ride-sharing platform similar to Uber with mobile and web applications for customers and drivers.

## Features

✅ **Real-time Tracking** - Live location tracking with Google Maps integration
✅ **Payment System** - Secure payment processing with multiple payment options
✅ **Rating & Reviews** - Star ratings and reviews for drivers and customers
✅ **In-app Chat** - Real-time messaging between drivers and customers
✅ **Customer & Driver Apps** - Separate mobile and web interfaces for both user types
✅ **Firebase Integration** - Real-time database and authentication

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Firebase Firestore + MongoDB
- **Authentication:** Firebase Auth
- **Real-time:** Firebase Realtime Database / Socket.io

### Frontend (Web)
- **Framework:** React.js
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Maps:** Google Maps API

### Mobile Apps
- **Framework:** React Native
- **Build Tool:** Expo
- **Navigation:** React Navigation
- **State Management:** Redux Toolkit

## Project Structure

```
GoToto-RideSharing/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── app.js
│   ├── package.json
│   └── .env.example
│
├── web-customer/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── redux/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── web-driver/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── redux/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── mobile-customer/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── redux/
│   │   ├── navigation/
│   │   └── App.tsx
│   ├── app.json
│   └── package.json
│
├── mobile-driver/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── redux/
│   │   ├── navigation/
│   │   └── App.tsx
│   ├── app.json
│   └── package.json
│
├── docs/
│   ├── API.md
│   ├── DATABASE_SCHEMA.md
│   ├── SETUP_GUIDE.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── .gitignore
└── LICENSE
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase Account
- Google Maps API Key
- Payment Gateway Account (Stripe/PayPal)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/saikatr884-ui/GoToto-RideSharing.git
cd GoToto-RideSharing
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

3. **Setup Web Customer App**
```bash
cd web-customer
npm install
npm start
```

4. **Setup Web Driver App**
```bash
cd web-driver
npm install
npm start
```

5. **Setup Mobile Customer App**
```bash
cd mobile-customer
npm install
expo start
```

6. **Setup Mobile Driver App**
```bash
cd mobile-driver
npm install
expo start
```

## API Documentation

See [API.md](./docs/API.md) for detailed API endpoints documentation.

## Database Schema

See [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) for Firestore and MongoDB schema details.

## Features Roadmap

- [x] Project Setup
- [ ] User Authentication (Customer & Driver)
- [ ] Real-time Location Tracking
- [ ] Ride Booking System
- [ ] Payment Integration
- [ ] In-app Chat System
- [ ] Rating & Review System
- [ ] Driver Verification
- [ ] Admin Dashboard
- [ ] Analytics & Reports

## Contributing

Contributions are welcome! Please follow the contributing guidelines.

## License

MIT License - see LICENSE file for details

## Support

For support, email: support@gototo.com

---

**Happy Coding! 🚀**
