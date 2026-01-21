import mongoose, { Schema, Document } from "mongoose";

export type RewardStatus = "pending" | "cancelled" | "succesfull";

export interface IReward extends Document {
  agentId: mongoose.Types.ObjectId;
  reward: number;
  recievedReward: number;
  pendingReward: number;
  rewardStatus: RewardStatus;
  createdAt: Date;
  updatedAt: Date;
  orderId: mongoose.Types.ObjectId;
}

const rewardSchema = new Schema<IReward>(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      unique: true,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: "AgentOrder",
      // required: true,
    },
    reward: { type: Number, default: 0, min: 0 },
    recievedReward: { type: Number, default: 0, min: 0 },
    pendingReward: { type: Number, default: 0, min: 0 },
    rewardStatus: {
      type: String,
      enum: ["pending", "cancelled", "succesfull"],
    },
  },
  { timestamps: true, collection: "reward" },
);
export const rewardModel = mongoose.model<IReward>("reward", rewardSchema);
