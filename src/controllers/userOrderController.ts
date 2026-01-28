import { Request, Response } from "express";
import { UserOrder } from "../models/userOrderModel";
import { userModel } from "../models/userModel";

// Create new user order
export const createUserOrder = async (req: Request, res: Response) => {
  const { clerkId, productName, description, imageUrls } = req.body;
  try {
    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User олдсонгүй" });
    }
    const order = await UserOrder.create({
      userId: user._id,
      productName: productName,
      description: description,
      imageUrls: imageUrls,
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Get all user orders
export const getAllUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await UserOrder.find()
      .populate("userId", "email")
      .populate("agentId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get user orders by userId
export const getUserOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await UserOrder.find({ userId })
      .populate("agentId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get single user order by ID
export const getUserOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await UserOrder.findById(id)
      .populate("userId", "email")
      .populate("agentId", "email");
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Update user order
export const updateUserOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await UserOrder.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Update order status
export const updateUserOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await UserOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Assign agent to order
export const assignAgentToOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    const order = await UserOrder.findByIdAndUpdate(
      id,
      { agentId, status: "Агент судлаж байна" },
      { new: true, runValidators: true },
    );
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Delete user order
export const deleteUserOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await UserOrder.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get orders by status
export const getUserOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const orders = await UserOrder.find({ status })
      .populate("userId", "email")
      .populate("agentId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
