import { Request, Response } from "express";
import { userModel } from "../models/userModel";

// GET /api/users/me - Өөрийн мэдээлэл авах
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      clerkUserId: user.clerkUserId,
      role: user.role,
      isApproved: user.isApproved,
      agentReward: user.agentReward,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users - Бүх хэрэглэгчдийн жагсаалт (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await userModel.find().sort({ createdAt: -1 });
    res.json({ users, count: users.length });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/:userId/approve - Agent-ийг зөвшөөрөх (Admin only)
export const approveAgent = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    const adminId = (req as any).user?.clerkId;
    const { userId } = req.params;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "agent") {
      return res.status(400).json({ message: "User is not an agent" });
    }

    user.isApproved = true;
    user.approvedAt = new Date();
    user.approvedBy = adminId;
    await user.save();

    res.json({ message: "Agent approved successfully", user });
  } catch (error) {
    console.error("approveAgent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/role - Role өөрчлөх (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    const { userId, newRole } = req.body;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    if (!["user", "agent", "admin"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = newRole;

    // Хэрэв agent болгосон бол approval шаардлагатай
    if (newRole === "agent") {
      user.isApproved = false;
    }

    await user.save();

    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
