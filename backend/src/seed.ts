import mongoose from 'mongoose';
import Transaction from './models/Transaction';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Transaction.deleteMany({});
    console.log('Cleared existing transactions');

    // Read transactions.json
    const transactionsPath = path.join(__dirname, '../../transactions.json');
    const transactionsData = JSON.parse(fs.readFileSync(transactionsPath, 'utf8'));

    // Transform data for MongoDB
    const transactions = transactionsData.map((transaction: any) => ({
      id: transaction.id,
      date: new Date(transaction.date),
      amount: transaction.amount,
      category: transaction.category,
      status: transaction.status,
      user_id: transaction.user_id,
      user_profile: transaction.user_profile
    }));

    // Insert data
    await Transaction.insertMany(transactions);
    console.log(`Inserted ${transactions.length} transactions`);

    // Create indexes
    await Transaction.createIndexes();
    console.log('Created indexes');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 