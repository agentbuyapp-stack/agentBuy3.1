import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { profileModel } from "../models/profileModel";
import mongoose from "mongoose";

export const createProfile = async (req: Request, res: Response) => {
  const { name, phone, cargo, accountNumber } = req.body;
  const { _id } = req.params;
  if (!_id) return res.status(400).json({ message: "ID NOT FOUND" });
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).json("INVALID ID FORMAT");
  try {
    const user = await userModel.findById(_id);
    if (!user) {
      return res.status(400).json({ message: "USER NOT FOUND" });
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
    res.status(200).json({ created_profile: user });
  } catch (err) {
    console.error("SERVER_ERROR:", err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
export const getProfileById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  if (!_id) return res.status(400).json({ message: "ID NOT FOUND" });
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).json({ message: "INVALID ID FORMAT" });
  try {
    const getProfile = await profileModel.findById(_id).populate("userId");
    if (!getProfile) return res.status(404).json({ message: "USER NOT FOUND" });
    res.status(200).json({ profile: getProfile });
  } catch (err) {
    console.error("SERVER_ERROR: ", err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  const { name, phone, cargo, accountNumber } = req.body;
  const { _id } = req.params;
  if (!_id) return res.status(400).json({ message: "ID NOT FOUND" });
  try {
    const updateProfile = await profileModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          name: name,
          phone: phone,
          cargo: cargo,
          accountNumber: accountNumber,
        },
      },
      {
        new: true,
      },
    );
    res.status(200).json({ updated_profile: updateProfile });
  } catch (err) {
    console.error("SERVER_ERROR:", err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
