import mongoose, { Schema, Document } from "mongoose";

export type Role = "user" | "agent" | "admin";

export interface IUser extends Document {
  email: string;
  role: Role;
  isApproved: boolean;
  approvedAt?: Date;
  approvedBy?: string;
  agentReward?: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: String,
    },
    agentReward: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
export const userModel = mongoose.model<IUser>("users", userSchema);
