import mongoose, { Schema, Document } from "mongoose";
export type Role = "user" | "agent";
export interface IChat extends Document {
  //   orderId: mongoose.Types.ObjectId; //order holboh
  senderId: mongoose.Types.ObjectId; // user esvel agent holboh
  recieverId: mongoose.Types.ObjectId;
  senderRole: Role;
  recieverRole: Role;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const chatSchema = new Schema<IChat>(
  {
    // orderId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "",
    //   required: true,
    //   unique: true,
    // },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    senderRole: { type: String, enum: ["user", "agent"] },
    message: { type: String },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "chat",
  },
);
export const chatModel = mongoose.model<IChat>("chat", chatSchema);
