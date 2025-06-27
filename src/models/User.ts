import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    avatarUrl?: string,
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        avatarUrl: {type: String, default: "", required: false},
    },
    {timestamps: true}  
)

export default mongoose.model<IUser>("User", UserSchema);