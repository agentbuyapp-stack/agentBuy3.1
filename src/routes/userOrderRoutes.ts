import { Router } from "express";
import {
    createUserOrder,
    getAllUserOrders,
    getUserOrdersByUserId,
    getUserOrderById,
    updateUserOrder,
    updateUserOrderStatus,
    assignAgentToOrder,
    deleteUserOrder,
    getUserOrdersByStatus,
} from "../controllers/userOrderController";

const router = Router();

// Create new user order
router.post("/", createUserOrder);

// Get all user orders
router.get("/", getAllUserOrders);

// Get orders by status
router.get("/status/:status", getUserOrdersByStatus);

// Get user orders by userId
router.get("/user/:userId", getUserOrdersByUserId);

// Get single order by ID
router.get("/:id", getUserOrderById);

// Update order
router.put("/:id", updateUserOrder);

// Update order status
router.patch("/:id/status", updateUserOrderStatus);

// Assign agent to order
router.patch("/:id/assign-agent", assignAgentToOrder);

// Delete order
router.delete("/:id", deleteUserOrder);

export default router;
