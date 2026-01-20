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
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

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

export const setRole = async (req: Request, res: Response) => {
  const { role, clerkId } = req.body;
  try {
    const setRole = await userModel.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          role,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: setRole });
  } catch (err) {
    console.error(err);
    res.status(500).send("failed to set role");
  }
};
