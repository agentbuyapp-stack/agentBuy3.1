import mongoose, { Schema } from "mongoose";

export type UserOrderStatus =
  | "Нийтэлсэн"
  | "Агент судлаж байна"
  | "Төлбөр"
  | "Баталгаажуулсан";

export interface IUserOrder {
  userId: mongoose.Types.ObjectId;
  agentId?: mongoose.Types.ObjectId;
  productName: string;
  productUrl?: string;
  description?: string;
  imageUrl?: string;
  imageUrls: string[];
  quantity: number;
  estimatedPrice?: number;
  finalPrice?: number;
  status: UserOrderStatus;
  phone?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserOrderSchema = new Schema<IUserOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    quantity: {
      type: Number,
      // required: true,
      min: 1,
      default: 1,
    },
    estimatedPrice: {
      type: Number,
      min: 0,
    },
    finalPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Нийтэлсэн", "Агент судлаж байна", "Төлбөр", "Баталгаажуулсан"],
      default: "Нийтэлсэн",
    },
    phone: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "userOrders",
  },
);

export const UserOrder = mongoose.model<IUserOrder>(
  "UserOrder",
  UserOrderSchema,
);
