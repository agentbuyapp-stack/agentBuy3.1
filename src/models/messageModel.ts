import mongoose, { Schema, Document } from "mongoose";
export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  chat: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}
const messsageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true,
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "messages",
  },
);
export const messageModel = mongoose.model<IMessage>(
  "Messages",
  messsageSchema,
);
