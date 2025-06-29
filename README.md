# Finalytics - Financial Analytics Dashboard

A full-stack financial analytics application built with React, Node.js, Express, and MongoDB. This application provides comprehensive transaction management, real-time analytics, and data visualization capabilities.

## 🚀 Features

### Frontend (React + TypeScript + Chakra UI)
- **Modern UI/UX**: Beautiful, responsive design with Chakra UI components
- **Dashboard Analytics**: Real-time charts and statistics using Chart.js
- **Transaction Management**: Advanced filtering, sorting, and pagination
- **Authentication**: Secure login/register system with JWT
- **CSV Export**: Download transaction data in CSV format
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Backend (Node.js + Express + TypeScript)
- **RESTful API**: Complete CRUD operations for transactions
- **JWT Authentication**: Secure token-based authentication
- **Advanced Filtering**: Multi-field search and filtering capabilities
- **Data Analytics**: Revenue vs expenses analysis, category breakdowns
- **CSV Export**: Configurable column selection for data export
- **MongoDB Integration**: Optimized database queries with indexing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/PUSHKARDEORE/Finalytics.git
cd Finalytics
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finalytics
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

Start MongoDB and seed the database:
```bash
npm run seed
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend application:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Environment Configuration

### Backend Environment Variables
| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port number | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/finalytics` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key` |

### Frontend Environment Variables
| Variable | Purpose | Example |
|----------|---------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |

**Important**: 
- Never commit `.env` files to version control
- React environment variables must start with `REACT_APP_`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/protected` - Protected route example

### Transaction Endpoints
- `GET /api/transactions` - Get transactions with filtering & pagination
- `GET /api/transactions/stats` - Get dashboard statistics
- `POST /api/transactions/export` - Export transactions to CSV
- `GET /api/transactions/filters` - Get available filter options

### Health Check
- `GET /api/health` - Server health check

## 🎯 Key Features Demonstrated

1. **Full-Stack Development**: Complete frontend and backend implementation
2. **Database Design**: MongoDB with proper schema design and indexing
3. **API Development**: RESTful API with comprehensive endpoints
4. **Authentication**: JWT-based secure authentication system
5. **Data Visualization**: Interactive charts and analytics dashboard
6. **Data Export**: CSV export functionality with custom column selection
7. **Search & Filtering**: Advanced search across multiple fields
8. **Responsive Design**: Mobile-friendly user interface
9. **Error Handling**: Comprehensive error handling and validation
10. **Performance Optimization**: Database indexing and query optimization

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration for frontend integration
- Input validation and sanitization
- MongoDB injection protection

## 📊 Database Schema

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

## 📁 Project Structure

```
Finalytics/
├── backend/                # Node.js/Express backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication middleware
│   │   └── index.ts        # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── App.tsx         # Main app component
│   ├── .env                # Environment variables
│   └── package.json
└── README.md
```


## 👨‍💻 Author

Pushkar Deore - Full Stack Developer

