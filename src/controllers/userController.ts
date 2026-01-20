import { Request, Response } from "express";
import { userModel } from "../models/userModel";

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get user by ID
// export const getUserById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const user = await userModel.findById(id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: (error as Error).message });
//   }
// };

// Get user by clerkId
export const getUserByClerkId = async (req: Request, res: Response) => {
  try {
    const { clerkId } = req.params;
    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

import mongoose from "mongoose";
export const setRole = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { role } = req.body;
  if (!_id) return res.status(400).json({ message: "ID NOT FOUND" });
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).json("INVALID ID FORMAT");
  try {
    const setRole = await userModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          role: role,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json({ role: setRole?.role });
  } catch (err) {
    console.error("SERVER_ERROR:", err);
    res.status(500).json({ messsage: "INTERNAL SERVER ERROR" });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  if (!_id) return res.status(400).json({ message: "ID NOT FOUND" });
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).json("INVALID ID FORMAT");
  try {
    const getUser = await userModel.findById(_id);
    if (!getUser) return res.status(404).json({ message: "USER NOT FOUND" });
    res.status(200).json({ user: getUser });
  } catch (err) {
    console.error("SERVER_ERROR:", err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
