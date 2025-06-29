import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

const TransactionSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Revenue', 'Expense'] },
  status: { type: String, required: true, enum: ['Paid', 'Pending'] },
  user_id: { type: String, required: true },
  user_profile: { type: String, required: true }
}, {
  timestamps: true
});

// Create indexes for better query performance
TransactionSchema.index({ date: 1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ user_id: 1 });
TransactionSchema.index({ amount: 1 });
TransactionSchema.index({ user_profile: 1 });

// Text index for better search performance
TransactionSchema.index({ 
  user_id: 'text', 
  category: 'text', 
  status: 'text', 
  user_profile: 'text' 
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema); 