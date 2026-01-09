import { Router } from "express";
import { clerkAuth } from "../middleware/clerkAuth";
import {
  getMe,
  getAllUsers,
  approveAgent,
  updateUserRole,
} from "../controllers/userController";

const router = Router();

// Бүх route-д clerkAuth middleware ашиглана
router.use(clerkAuth);

// GET /api/users/me - Өөрийн мэдээлэл
router.get("/me", getMe);

// GET /api/users - Бүх хэрэглэгч (Admin only)
router.get("/", getAllUsers);

// PATCH /api/users/:userId/approve - Agent зөвшөөрөх (Admin only)
router.patch("/:userId/approve", approveAgent);

// PATCH /api/users/role - Role өөрчлөх (Admin only)
router.patch("/role", updateUserRole);

export default router;
