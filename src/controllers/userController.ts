import { Request, Response } from "express";
import { userModel } from "../models/userModel";
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
