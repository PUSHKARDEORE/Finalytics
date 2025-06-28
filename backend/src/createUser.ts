import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const createDemoUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    // Remove all users
    await User.deleteMany({});
    console.log('Cleared all users');

    // Create only the demo user
    const demoUser = {
      email: 'demo@example.com',
      password: await bcrypt.hash('demo123', 10)
    };

    await User.create(demoUser);
    console.log('Created demo user: demo@example.com / demo123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating demo user:', error);
    process.exit(1);
  }
};

createDemoUser(); 