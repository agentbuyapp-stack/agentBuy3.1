import { Router } from "express";
import { setRole } from "../controllers/userController";

const userRoute = Router();
userRoute.put("/setRole", setRole);
export default userRoute;
