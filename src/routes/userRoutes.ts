import { Router } from "express";
import express from "express";
import { signUpUser } from "../controllers/userController";

const userRoute = Router();

userRoute.post("/", express.raw({ type: "application/json" }), signUpUser);
export default userRoute;
