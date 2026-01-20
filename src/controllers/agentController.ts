import { Request, Response } from "express";
import { userModel } from "../models/userModel";
export const rewardRequest = async (req: Request, res: Response) => {
  const { agentReward, email } = req.body;
  const { _id } = req.params;
  try {
    const agent = await userModel.findOne({ email: email });
    if (!agent) return res.status(404).json({ message: "AGENT  OLDODGUEE" });
    if (agent.agentReward === undefined || agent.agentReward < 50000)
      return res.json({ message: "BAGA BAINA MONGO CHIN" });
    if (agent.agentReward > 50000) {
      await userModel.findByIdAndUpdate(_id, {
        $set: {
          rewardStatus: "pending",
          agentReward: agentReward,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};
