import { Request, Response } from "express";
import { AgentOrder } from "../models/agentOrderModel";

// Create new agent order
export const createAgentOrder = async (req: Request, res: Response) => {
  try {
    const order = await AgentOrder.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Get all agent orders
export const getAllAgentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await AgentOrder.find()
      .populate("userId", "email")
      .populate("agentId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get agent orders by agentId
export const getOrdersByAgentId = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const orders = await AgentOrder.find({ agentId })
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get agent orders by userId
export const getAgentOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await AgentOrder.find({ userId })
      .populate("agentId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get single agent order by ID
export const getAgentOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await AgentOrder.findById(id)
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

// Update agent order
export const updateAgentOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await AgentOrder.findByIdAndUpdate(id, req.body, {
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
export const updateAgentOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await AgentOrder.findByIdAndUpdate(
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

// Add item to order
export const addItemToOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await AgentOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    order.items.push(req.body);
    order.totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Update item in order
export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const order = await AgentOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }
    Object.assign(item, req.body);
    order.totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Remove item from order
export const removeItemFromOrder = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const order = await AgentOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    order.items.pull(itemId);
    order.totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Verify user payment for item
export const verifyUserPayment = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const order = await AgentOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }
    item.userPaymentVerified = true;
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Mark agent payment as paid
export const markAgentPaymentPaid = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const order = await AgentOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }
    item.agentPaymentPaid = true;
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Add track code to item
export const addTrackCode = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const { trackCode } = req.body;
    const order = await AgentOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }
    item.trackCode = trackCode;
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// Delete agent order
export const deleteAgentOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await AgentOrder.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Get orders by status
export const getAgentOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const orders = await AgentOrder.find({ status })
      .populate("userId", "email")
      .populate("agentId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
