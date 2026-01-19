import { Router } from "express";
import { getUserById, setRole } from "../controllers/userController";

const userRoute = Router();
userRoute.put("/setRole/:_id", setRole);
userRoute.get("/getUserById/:_id", getUserById);
export default userRoute;
