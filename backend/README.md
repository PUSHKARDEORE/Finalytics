# Finalytics Backend

A Node.js/Express backend for the Finalytics financial application with MongoDB integration, JWT authentication, and comprehensive transaction management.

## Features

- **Authentication**: JWT-based login/logout system
- **Transaction Management**: CRUD operations with advanced filtering, sorting, and pagination
- **Dashboard Analytics**: Revenue vs expenses trends, category breakdowns, summary metrics
- **CSV Export**: Configurable column selection with automatic file download
- **Search & Filtering**: Real-time search across transaction fields with multi-field filters
- **Database Optimization**: Indexed queries for better performance

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/finalytics
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud instance.

5. **Seed the database**
   ```bash
   npm run seed
   ```
   This will populate the database with sample transaction data from `transactions.json`.

6. **Start the server**
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/protected` - Protected route example

### Transactions
- `GET /api/transactions` - Get transactions with filtering, sorting, and pagination
- `GET /api/transactions/stats` - Get dashboard statistics
- `POST /api/transactions/export` - Export transactions to CSV
- `GET /api/transactions/filters` - Get available filter options

### Health Check
- `GET /api/health` - Server health check

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Transaction Endpoints

#### Get Transactions
```http
GET /api/transactions?page=1&limit=10&sortBy=date&sortOrder=desc&category=Revenue&status=Paid&search=user_001&startDate=2024-01-01&endDate=2024-12-31&minAmount=100&maxAmount=5000
Authorization: x-auth-token <your-jwt-token>
```

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `sortBy` (string): Field to sort by (date, amount, category, status, user_id)
- `sortOrder` (string): Sort order (asc, desc)
- `category` (string): Filter by category (Revenue, Expense)
- `status` (string): Filter by status (Paid, Pending)
- `user_id` (string): Filter by user ID
- `search` (string): Search across user_id, category, and status
- `startDate` (string): Filter by start date (YYYY-MM-DD)
- `endDate` (string): Filter by end date (YYYY-MM-DD)
- `minAmount` (number): Minimum amount filter
- `maxAmount` (number): Maximum amount filter

#### Get Dashboard Statistics
```http
GET /api/transactions/stats?startDate=2024-01-01&endDate=2024-12-31
Authorization: x-auth-token <your-jwt-token>
```

#### Export Transactions to CSV
```http
POST /api/transactions/export
Authorization: x-auth-token <your-jwt-token>
Content-Type: application/json

{
  "columns": ["id", "date", "amount", "category", "status", "user_id"],
  "filters": {
    "category": "Revenue",
    "status": "Paid",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }
}
```

#### Get Filter Options
```http
GET /api/transactions/filters
Authorization: x-auth-token <your-jwt-token>
```

## Database Schema

### Transaction Model
```typescript
interface ITransaction {
  id: number;
  date: Date;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User Model
```typescript
interface IUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid or missing token)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS enabled for frontend integration
- Input validation and sanitization
- MongoDB injection protection

## Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for large datasets
- Efficient aggregation pipelines for statistics
- Optimized CSV generation

## Development

### Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm run seed` - Seed the database with sample data

### File Structure
```
src/
├── index.ts          # Main server file
├── seed.ts           # Database seeding script
├── models/
│   ├── User.ts       # User model
│   └── Transaction.ts # Transaction model
├── routes/
│   ├── auth.ts       # Authentication routes
│   └── transactions.ts # Transaction routes
└── middleware/
    └── auth.ts       # JWT authentication middleware
```

## Deployment

1. Set up environment variables for production
2. Use a production MongoDB instance
3. Set a strong JWT secret
4. Configure CORS for your frontend domain
5. Use a process manager like PM2 for production

## License

MIT License 