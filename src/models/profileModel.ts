import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  cargo?: string;
  accountNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    cargo: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "profiles",
  }
);

export const profileModel = mongoose.model<IProfile>("profiles", ProfileSchema);
