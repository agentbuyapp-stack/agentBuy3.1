import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";
import ngrok from "@ngrok/ngrok";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 SOCKET CONNECTED:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`👥 JOINED CHAT ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 SOCKET DISCONNECTED");
  });
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("MongoDB connected");

  server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
  // const listener = await ngrok.connect({
  //   addr: PORT,
  //   authtoken: process.env.NGROK_AUTHTOKEN,
  // });
  // console.log("ngrok url:", listener.url());
}
start();
