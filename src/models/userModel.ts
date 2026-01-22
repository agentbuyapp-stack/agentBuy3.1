import mongoose, { Schema, Document } from "mongoose";

export type Role = "user" | "agent" | "admin";
export type RewardStatus = "pending" | "cancelled" | "succesfull";

export interface IUser extends Document {
  email: string;
  clerkId: string;
  role: Role;
  isApproved?: boolean;
  approvedAt?: Date;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    approvedBy: { type: String },
  },
  { timestamps: true, collection: "users" },
);
export const userModel = mongoose.model<IUser>("User", userSchema);
