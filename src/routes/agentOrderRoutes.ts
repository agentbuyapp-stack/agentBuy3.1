import { Router } from "express";
import {
    createAgentOrder,
    getAllAgentOrders,
    getOrdersByAgentId,
    getAgentOrdersByUserId,
    getAgentOrderById,
    updateAgentOrder,
    updateAgentOrderStatus,
    addItemToOrder,
    updateOrderItem,
    removeItemFromOrder,
    verifyUserPayment,
    markAgentPaymentPaid,
    addTrackCode,
    deleteAgentOrder,
    getAgentOrdersByStatus,
} from "../controllers/agentOrderController";

const router = Router();

// Create new agent order
router.post("/", createAgentOrder);

// Get all agent orders
router.get("/", getAllAgentOrders);

// Get orders by status
router.get("/status/:status", getAgentOrdersByStatus);

// Get orders by agentId
router.get("/agent/:agentId", getOrdersByAgentId);

// Get orders by userId
router.get("/user/:userId", getAgentOrdersByUserId);

// Get single order by ID
router.get("/:id", getAgentOrderById);

// Update order
router.put("/:id", updateAgentOrder);

// Update order status
router.patch("/:id/status", updateAgentOrderStatus);

// Add item to order
router.post("/:id/items", addItemToOrder);

// Update item in order
router.patch("/:id/items/:itemId", updateOrderItem);

// Remove item from order
router.delete("/:id/items/:itemId", removeItemFromOrder);

// Verify user payment for item
router.patch("/:id/items/:itemId/verify-payment", verifyUserPayment);

// Mark agent payment as paid
router.patch("/:id/items/:itemId/agent-paid", markAgentPaymentPaid);

// Add track code to item
router.patch("/:id/items/:itemId/track-code", addTrackCode);

// Delete order
router.delete("/:id", deleteAgentOrder);

export default router;
