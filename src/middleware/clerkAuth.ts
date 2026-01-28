import { clerkClient } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction } from "express";
export interface ClerkRequest extends Request {
  auth?: {
    userId: string;
  };
}
export const clerkAuth = async (
  req: ClerkRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("AUTH TOKEN REQUIRED");
    const token = authHeader.replace("Bearer ", "");
    const verifiedToken = await clerkClient.verifyToken(token);
    if (!verifiedToken.sub) {
      return res.status(401).json("INVALID TOKEN");
    }
    req.auth = { userId: verifiedToken.sub };
    next();
  } catch (err) {
    console.error("AUTHENTICATION ERROR:", err);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};
