import mongoose, { Schema, Document } from "mongoose";
export type Role = "user" | "agent";
export interface IChat extends Document {
  members: mongoose.Types.ObjectId;
  message: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const chatSchema = new Schema<IChat>(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    message: {
      type: Schema.Types.ObjectId,
      ref: "Messages",
    },
  },
  {
    timestamps: true,
    collection: "chat",
  },
);
export const chatModel = mongoose.model<IChat>("ChatRoom", chatSchema);
