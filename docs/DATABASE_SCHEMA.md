# Database Schema

## Firestore Collections

### 1. Users Collection
```json
{
  "uid": "user_id",
  "email": "user@email.com",
  "name": "User Name",
  "phoneNumber": "+1234567890",
  "profileImage": "url",
  "userType": "customer", // customer or driver
  "address": "Full Address",
  "paymentMethods": [
    {
      "id": "card_id",
      "type": "card", // card, wallet, upi
      "last4": "4242",
      "isDefault": true
    }
  ],
  "emergencyContacts": [
    {
      "name": "Contact Name",
      "phoneNumber": "+1234567890"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "isActive": true
}
```

### 2. Drivers Collection
```json
{
  "uid": "user_id",
  "licenseNumber": "DL123456",
  "licenseExpiry": "2025-12-31",
  "licenseDocument": "url",
  "vehicleDetails": {
    "registrationNumber": "AB12CD1234",
    "model": "Toyota Fortuner",
    "color": "White",
    "capacity": 4
  },
  "insurance": {
    "policyNumber": "INS123456",
    "expiryDate": "2025-12-31",
    "document": "url"
  },
  "backgroundCheck": {
    "status": "verified", // pending, verified, rejected
    "date": "2024-01-01T00:00:00Z"
  },
  "bankDetails": {
    "accountNumber": "****1234",
    "bankName": "Bank Name",
    "holderName": "Name"
  },
  "status": "active", // active, inactive, suspended
  "rating": 4.8,
  "totalRides": 245,
  "totalEarnings": 50000,
  "currentLocation": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "isOnline": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 3. Rides Collection
```json
{
  "id": "ride_id",
  "customerId": "customer_uid",
  "driverId": "driver_uid",
  "pickupLocation": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "Pickup Address"
  },
  "dropoffLocation": {
    "latitude": 28.5244,
    "longitude": 77.1855,
    "address": "Dropoff Address"
  },
  "status": "completed", // requested, accepted, ongoing, completed, cancelled
  "rideType": "standard", // standard, premium, xl
  "fare": 450,
  "distance": 12.5,
  "duration": 1200, // in seconds
  "paymentMethod": "card",
  "paymentStatus": "paid", // pending, paid, failed
  "ratedByCustomer": false,
  "ratedByDriver": false,
  "createdAt": "2024-01-01T10:00:00Z",
  "acceptedAt": "2024-01-01T10:01:00Z",
  "startedAt": "2024-01-01T10:05:00Z",
  "completedAt": "2024-01-01T10:25:00Z"
}
```

### 4. Payments Collection
```json
{
  "id": "payment_id",
  "rideId": "ride_id",
  "userId": "user_id",
  "amount": 450,
  "currency": "INR",
  "paymentMethod": "card",
  "status": "successful", // pending, successful, failed
  "transactionId": "txn_123456",
  "stripeChargeId": "ch_123456",
  "breakdown": {
    "baseFare": 50,
    "distanceFare": 300,
    "surgePricing": 100,
    "taxes": 25,
    "discount": 25
  },
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### 5. Ratings Collection
```json
{
  "id": "rating_id",
  "rideId": "ride_id",
  "raterId": "user_id", // Who gave the rating
  "ratedUserId": "rated_user_id", // Who is being rated
  "rating": 5, // 1-5 stars
  "review": "Great driver, very professional",
  "categories": {
    "cleanliness": 5,
    "driving": 5,
    "communication": 4,
    "behavior": 5
  },
  "createdAt": "2024-01-01T10:30:00Z"
}
```

### 6. Messages Collection
```json
{
  "id": "message_id",
  "rideId": "ride_id",
  "senderId": "user_id",
  "receiverId": "other_user_id",
  "message": "I'm on my way",
  "type": "text", // text, image, location
  "attachmentUrl": null,
  "isRead": false,
  "createdAt": "2024-01-01T10:10:00Z"
}
```

### 7. Support Tickets Collection
```json
{
  "id": "ticket_id",
  "userId": "user_id",
  "rideId": "ride_id",
  "subject": "Issue Description",
  "description": "Detailed description",
  "status": "open", // open, in_progress, resolved, closed
  "priority": "medium", // low, medium, high, urgent
  "attachments": ["url1", "url2"],
  "createdAt": "2024-01-01T10:00:00Z",
  "resolvedAt": null
}
```

## MongoDB Collections (Optional)

### Analytics Collection
```json
{
  "_id": ObjectId,
  "date": "2024-01-01",
  "totalRides": 500,
  "totalRevenue": 225000,
  "averageFare": 450,
  "newUsers": 25,
  "newDrivers": 5,
  "activeUsers": 450
}
```

### Promo Codes Collection
```json
{
  "_id": ObjectId,
  "code": "WELCOME50",
  "discountType": "percentage", // percentage, fixed
  "discountValue": 50,
  "maxDiscount": 500,
  "usageLimit": 1000,
  "usageCount": 250,
  "validFrom": "2024-01-01T00:00:00Z",
  "validTo": "2024-12-31T23:59:59Z",
  "applicableUserTypes": ["customer"], // customer, driver
  "status": "active"
}
```

## Indexes (Firestore)

- `users`: uid (primary), email, userType
- `drivers`: uid (primary), status, isOnline
- `rides`: customerId, driverId, status, createdAt
- `payments`: rideId, userId, status, createdAt
- `ratings`: rideId, ratedUserId, createdAt
- `messages`: rideId, senderId, createdAt

---

See SETUP_GUIDE.md for connection details.
