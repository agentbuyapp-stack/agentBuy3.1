import { Router } from "express";
import { signUpFinish } from "../controllers/userController";

const userRoute = Router();

userRoute.post("/createProfile", signUpFinish);
export default userRoute;
