import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { rewardModel } from "../models/rewardModel";
export const rewardRequest = async (req: Request, res: Response) => {
  const { agentReward, email } = req.body;
  try {
    const agent = await userModel.findOne({ email: email });
    if (!agent) return res.status(404).json({ message: "AGENT  OLDODGUEE" });
    if (agent.role === "agent")
      return res
        .status(400)
        .json({ message: "CHI AGENT BISH BAINA DAVRAARAI" });
    if (agent.agentReward === undefined || agent.agentReward < 50000)
      return res.json({ message: "BAGA BAINA MONGO CHIN" });
    if (agent.agentReward > 50000) {
      await rewardModel.create({
        agentId: agent._id,     
        pendingReward: agentReward,
        rewardStatus: "pending",
      });
    }
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: "INTERNAL SERVER. ERROR" });
  }
};
