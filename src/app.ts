import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cargoRoutes from "./routes/cargoRoutes";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/cargo", cargoRoutes);


export default app;
