import { Response, Request } from "express";
import { userModel } from "../models/userModel";
import { rewardModel } from "../models/rewardModel";
import mongoose from "mongoose";

export const sendReward = async (req: Request, res: Response) => {
  const { reward } = req.body;
  const { agentId } = req.params;
  if (!agentId) return res.status(404).json({ message: "ID NOT FOUND" });
  if (!mongoose.Types.ObjectId.isValid(agentId))
    return res.status(400).json({ message: "INVALID ID FORMAT" });
  try {
    const admin = await userModel.findOne({ role: "admin" });
    // const agent = await userModel.findById(agentId);
    if (!admin) return res.json({ message: "ADMIN NOT FOUND" });
    if (admin?.role !== "admin")
      return res.json({ message: "CHI ADMIN BISH BAINA" });
    if (admin) {
      const agentReward = await rewardModel.create({
        agentId: agentId,
        reward: reward,
      });
      return res.status(200).json({ sent_reward: agentReward });
    }
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
