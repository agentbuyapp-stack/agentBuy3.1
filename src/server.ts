import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";
import ngrok from "@ngrok/ngrok";

console.log(process.env.NGROK_AUTHTOKEN, "env is here");

const PORT = process.env.PORT || 4000;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
  const listener = await ngrok.connect({
    addr: PORT,
    authtoken: process.env.NGROK_AUTHTOKEN,
  });
  console.log("ngrok url:", listener.url());
}
start();
