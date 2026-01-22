import { Router } from "express";
import { confirmOrderAndsendReward } from "../controllers/adminController";

const adminRoute = Router();
adminRoute.post("/giveReward/agent/:agentOrderId", confirmOrderAndsendReward);
export default adminRoute;
