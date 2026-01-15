import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoute from "./routes/userRoutes";
import webhookRoute from "./routes/webhookRoutes";

const app = express();

app.use(cors());
// webhook route
app.use("/api/webhooks", webhookRoute);

app.use(express.json());
// app.use(clerkMiddleware());
// user route
app.use("/user", userRoute);
app.get("/", (_, res) => {
  res.json({ status: "ok" });
});

export default app;
