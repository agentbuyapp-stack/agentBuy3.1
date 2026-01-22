import { Response, Request } from "express";
import { userModel } from "../models/userModel";
import { rewardModel } from "../models/rewardModel";
import mongoose from "mongoose";
import { AgentOrder } from "../models/agentOrderModel";

export const confirmOrderAndsendReward = async (
  req: Request,
  res: Response,
) => {
  const { reward, status } = req.body;
  const { agentOrderId, adminId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(agentOrderId))
    return res.status(400).json({ message: "INVALID ID FORMAT" });
  if (!agentOrderId) return res.status(404).json({ message: "ID NOT FOUND" });
  try {
    const admin = await userModel.findById(adminId);
    if (admin?.role !== "admin")
      return res.json({ message: "ADMIN NOT FOUND" });
    if (admin) {
      const agentOrderItem = await AgentOrder.findById(agentOrderId);
      await AgentOrder.findByIdAndUpdate(
        agentOrderId,
        {
          $set: {
            status: status,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (agentOrderItem?.status === "Баталгаажуулсан") {
        const agentReward = await rewardModel.create({
          agentId: agentOrderItem.agentId,
          reward: reward,
        });
        return res.status(200).json({ sent_reward: agentReward });
      }
    }
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
// NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z2VuZXJvdXMtaGVuLTE3LmNsZXJrLmFjY291bnRzLmRldiQ
// CLERK_SECRET_KEY=sk_test_Wa1iNOGz5qXHmXObOI6KmqK4GG49lLQXnAKPGRLZhz
export const adminConfirmReward = async (req: Request, res: Response) => {
  const { adminId, agentId } = req.params;
  const { reward } = req.body;
  try {
    const agentReward = await rewardModel.findOne({ agentId: agentId });
    const admin = await userModel.findById(adminId);
    if (!admin) return res.status(404).json({ message: "not found" });
    if (admin.role !== "admin")
      res.status(400).json({ message: "you are not admin" });
    if (admin) {
      
    }
  } catch (err) {
    console.error(err);
  }
};
// export const seeAllPendingOrders = async (req: Request, res: Response) => {
//   const { adminId } = req.params;
//   const {} = req.body;
//   try {
//   } catch (err) {
//     console.error(err);
//   }
// };
