import { Request, Response } from "express";
import { userModel } from "../models/userModel";
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
