import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cargoRoutes from "./routes/cargoRoutes";
import { clerkMiddleware } from "@clerk/express";
import webhookRoute from "./routes/webhookRoutes";
import profileRoute from "./routes/profileRoute";
import userRoute from "./routes/userRoute";

const app = express();

app.use(cors());
// webhook route
app.use("/api/webhooks", webhookRoute);

app.use(express.json());
// app.use(clerkMiddleware());
// profile route
app.use("/profile", profileRoute);
// user route
app.use("/user", userRoute);
app.get("/", (_, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/cargo", cargoRoutes);


export default app;
