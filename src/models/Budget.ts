import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
    user: mongoose.Types.ObjectId;
    month: number;
    year: number;
    amount: number;
    alertLevel: number;
};

const budgetSchema = new Schema<IBudget>(
    {
        user: { type: Schema.Types.ObjectId, required: true},
        month: { type: Number, required: true},
        year: { type: Number, required: true},
        amount: { type: Number, required: true},
        alertLevel: { type: Number, default: 0}
    },
    {timestamps: true}
);

budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IBudget>("Budget", budgetSchema);

