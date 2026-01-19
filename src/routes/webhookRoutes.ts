import { Router } from "express";
import express from "express";
import { signUpUser } from "../controllers/webhookController";

const webhookRoute = Router();

webhookRoute.post("/", express.raw({ type: "application/json" }), signUpUser);

export default webhookRoute;
