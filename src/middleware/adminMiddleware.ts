// import { Request, Response, NextFunction } from "express";
// import { userModel } from "../models/userModel";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: any;
//       auth?: { userId: string };
//     }
//   }
// }

// export const adminMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     if (!req.auth?.userId) {
//       return res.status(401).json({ message: "UNAUTHORIZED" });
//     }
//     const user = await userModel.findOne({ clerkId: req.auth.userId });
//     if (!user) {
//       return res.status(404).json({ message: "USER NOT FOUND" });
//     }
//     if (user.role !== "admin") {
//       return res.status(403).json({ message: "FORBIDDEN: ADMIN ONLY" });
//     }
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("ADMIN MIDDLEWARE ERROR:", err);
//     return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
//   }
// };
