import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { chatModel } from "../models/chatModel";
export const sendChat = async (req: Request, res: Response) => {
  const { message, _id } = req.body;
  try {
    const sender = await userModel.findById(_id);
    // const reciever = await userModel.findById(_id);
    const sendMessage = await chatModel.create({
      senderId: sender?._id,
      senderRole: sender?.role,
      message: message,
    });
    res.status(200).json({ message: sendMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed" });
  }
};
