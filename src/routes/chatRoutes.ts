import { Router } from "express";
import {
  getAllMessages,
  getChat,
  getOrCreateChat,
  sendMessage,
} from "../controllers/chatController";

const chatRoute = Router();
chatRoute.post("/createChatRoom", getOrCreateChat);
chatRoute.post("/:chatId/senderId/:senderId", sendMessage);
chatRoute.get("/:chatId", getAllMessages);
chatRoute.get("/seeChatRoom/:chatId", getChat);
export default chatRoute;
