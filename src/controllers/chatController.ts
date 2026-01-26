import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { messageModel } from "../models/messageModel";
import { chatModel } from "../models/chatModel";

export const getOrCreateChat = async (req: Request, res: Response) => {
  const { members } = req.body;
  const [user1, user2] = members;
  if (!user1) return res.status(404).send("USER1 NOT FOUND");
  if (!user2) return res.status(404).send("USER2 NOT FOUND");
  // if (!members || members !== 2)
  //   return res.status(400).json({ message: "MEMBERS MUST BE 2 USERS" });
  try {
    const chat = await chatModel.findOne({
      members: {
        $all: [user1, user2],
        $size: 2,
      },
    });
    if (chat) return res.status(200).json({ OLD_ROOM: chat });
    if (!chat) {
      const newChat = await chatModel.create({
        members: [user1, user2],
      });
      return res.status(200).json({ NEW_ROOM: newChat });
    }
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json("INTERNAL SERVER ERROR");
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, senderId } = req.params;
  const { text } = req.body;
  try {
    const sender = await userModel.findById(senderId);
    if (!sender) return res.status(404).json({ messsage: "SENDER NOT FOUND" });
    const message = await messageModel.create({
      chat: chatId,
      senderId: senderId,
      text: text,
    });
    await chatModel.findByIdAndUpdate(chatId, {
      $push: {
        message: message._id,
      },
    });
    return res.status(200).json({ message: message });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json("INTERNAL SERVER ERROR");
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  if (!chatId) return res.status(404).json("ID NOT FOUND");
  try {
    const chat = await messageModel
      .find({ chat: chatId })
      .populate("senderId", "email")
      .sort({ createdAt: 1 });
    if (!chat) return res.status(404).json("CHAT NOT FOUND");
    if (chat) return res.status(200).json({ CHAT: chat });
  } catch (err) {
    console.error(err);
  }
};

export const getChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  if (!chatId) return res.status(404).json("ID NOT FOUND");
  try {
    const getChat = await chatModel
      .findById(chatId)
      .populate("members", "email");
    if (!getChat) return res.status(404).json("CHAT NOT FOUND");
    res.status(200).json({ ROOM_CHAT: getChat });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json("INTERNAL SERVER ERROR");
  }
};
