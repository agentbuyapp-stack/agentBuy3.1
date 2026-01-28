import { Response, NextFunction } from "express";
import { ClerkRequest } from "./clerkAuth";
import { userModel } from "../models/userModel";
export const adminMiddleware = async (
  req: ClerkRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await userModel.findOne({ clerkUserId });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  } catch (err) {
    console.error("ADMIN MIDDLEWARE ERROR:", err);
    res.status(500).json("INTERNAL SERVER ERROR");
  }
};
