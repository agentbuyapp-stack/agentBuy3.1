import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { userModel } from "../models/userModel";

export const clerkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = auth.slice(7);

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
      issuer: process.env.CLERK_ISSUER!,
    });

    const clerkUserId = payload.sub;
    if (!clerkUserId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ✅ DB sync by clerkUserId (найдвартай)
    let user = await userModel.findOne({ clerkUserId });

    if (!user) {
      // Dev шатанд email-гүй байж болох тул placeholder үүсгэнэ
      user = await userModel.create({
        clerkUserId,
        email: `clerk_${clerkUserId}@local.dev`,
        role: "user",
        isApproved: true, // dev-д шууд
      });
    }

    (req as any).user = {
      id: user._id.toString(),
      role: user.role,
      clerkId: clerkUserId,
    };

    next();
  } catch (err) {
    console.error("clerkAuth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
