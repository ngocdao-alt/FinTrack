import mongoose, { Schema, Document } from 'mongoose';

interface CategoryBudget {
  category: string;
  amount: number;
}

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  month: number;
  year: number;
  totalAmount: number;
  categories: CategoryBudget[]; 
  alertLevel: number;
}

const BudgetSchema = new Schema<IBudget>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  categories: [
    {
      category: { type: String, required: true },
      amount: { type: Number, required: true },
    }
  ],
  alertLevel: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IBudget>('Budget', BudgetSchema);
