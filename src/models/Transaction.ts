import mongoose, { Document, mongo, Schema } from "mongoose";

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    type: "income" | "expense";
    amount: number;
    category: string;
    note?: string;
    date: Date;
    receiptImage?: string[];
    isRecurring?: boolean;
    recurringDay?: number;
}

const transactionSchema = new Schema<ITransaction> (
    {
        user: {type: Schema.Types.ObjectId, ref: "User", required: true},
        type: {type: String, enum: ["income", "expense"], required: true},
        amount: {type: Number, required: true},
        category: { type: String, required: true},
        note: {type: String, required: false},
        date: {type: Date, required: false},
        receiptImage: {type: [String], required: false},
        isRecurring: {type: Boolean, default: false},
        recurringDay: {type: Number, min: 1, max: 31},
    },
    {timestamps: true}
);

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
