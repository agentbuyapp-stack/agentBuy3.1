import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { profileModel } from "../models/profileModel";

export const createProfile = async (req: Request, res: Response) => {
  const { clerkId, name, phone, cargo, accountNumber } = req.body;
  try {
    const user = await userModel.findOne({
      clerkId: clerkId,
    });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    if (user) {
      await profileModel.create({
        userId: user._id,
        name: name,
        phone: phone,
        email: user.email,
        cargo: cargo,
        accountNumber: accountNumber,
      });
    }
    res.status(200).json({ message: "profile succesfully created" });
  } catch (err) {
    console.error("", err);
    res.status(400).send("failed");
  }
};
