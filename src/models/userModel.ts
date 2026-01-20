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
  agentReward?: number;
  createdAt: Date;
  updatedAt: Date;
  rewardStatus?: RewardStatus;
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
    agentReward: { type: Number, default: 0, min: 0 },
    rewardStatus: {
      type: String,
      enum: ["pending", "cancelled", "succesfull"],
    },
  },
  { timestamps: true, collection: "users" },
);
export const userModel = mongoose.model<IUser>("users", userSchema);
