import { Response, Request } from "express";
import { userModel } from "../models/userModel";
import { rewardModel } from "../models/rewardModel";
import mongoose from "mongoose";
import { AgentOrder } from "../models/agentOrderModel";
import { UserOrder } from "../models/userOrderModel";

export const confirmOrderAndsendReward = async (
  req: Request,
  res: Response,
) => {
  const { point, status } = req.body;
  const { agentOrderId, adminId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(agentOrderId))
    return res.status(400).json({ message: "INVALID ID FORMAT" });
  if (!agentOrderId) return res.status(404).json({ message: "ID NOT FOUND" });
  try {
    const admin = await userModel.findById(adminId);
    if (admin?.role !== "admin")
      return res.json({ message: "ADMIN NOT FOUND" });
    if (admin.role === "admin") {
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
          reward: point,
        });
        return res.status(200).json({ SENT_REWARD: agentReward });
      }
    }
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
export const adminConfirmReward = async (req: Request, res: Response) => {
  const { adminId, agentId } = req.params;
  const { reward, status } = req.body;
  try {
    const admin = await userModel.findById(adminId);
    if (!admin) return res.status(404).json({ message: "not found" });
    if (admin.role !== "admin")
      res.status(400).json({ message: "you are not admin" });
    if (admin) {
      const confirm = await rewardModel.findOneAndUpdate(
        { agentId: agentId },
        {
          $set: {
            rewardStatus: status,
            recievedReward: reward,
            pendingReward: 0,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      return res.status(200).json({ SENT: confirm?.recievedReward });
    }
  } catch (err) {
    console.error(err);
  }
};
export const seeAllOrders = async (req: Request, res: Response) => {
  const { adminId } = req.params;
  const admin = await userModel.findById(adminId);
  if (admin?.role !== "admin") res.status(400).json({ message: "ONLY ADMIN" });
  try {
    if (admin) {
      const allOrders = await UserOrder.find();
      return res.status(200).json({ ALL_ORDERS: allOrders });
    }
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};
export const seeOrderById = async (req: Request, res: Response) => {
  const { adminId, userOrderId } = req.params;
  const admin = await userModel.findById(adminId);
  if (admin?.role !== "admin") return res.status(400).json("ONLY ADMIN");
  try {
    if (admin.role === "admin") {
      const ordersById = await UserOrder.findById(userOrderId);
      return res.status(200).json({ ORDER_BY_ID: ordersById });
    }
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
};
export const seeAllOpenOrders = async (req: Request, res: Response) => {
  const { adminId } = req.params;
  try {
    const admin = await userModel.findById(adminId);
    if (admin?.role === "admin") {
      const ordersUser = await UserOrder.find({ status: "Нийтэлсэн" });
      return res.status(200).json({ PENDING_ORDERS: ordersUser });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("INTERNAL SERVER ERROR");
  }
};
export const seeOpenOrderById = async (req: Request, res: Response) => {
  const { adminId, orderId } = req.params;
  try {
    const admin = await userModel.findById(adminId);
    if (admin?.role !== "admin")
      res.status(400).json({ message: "ONLY ADMIN" });
    if (admin) {
      const openOrderById = await UserOrder.findOne({
        status: "Нийтэлсэн",
        _id: orderId,
      });
      return res.json(200).json({ order: openOrderById });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("INTERNAL SERVER ERROR");
  }
};
