import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;
