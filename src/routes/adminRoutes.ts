import { Router } from "express";
import { sendReward } from "../controllers/adminController";

const adminRoute = Router();
adminRoute.post("/giveReward/agent/:agentId", sendReward);
export default adminRoute;
