import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoute from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use("/api/webhooks", userRoute);
app.use(express.json());
app.use(clerkMiddleware());
app.get("/", (_, res) => {
  res.json({ status: "ok" });
});

export default app;
