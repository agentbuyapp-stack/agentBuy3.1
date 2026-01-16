import { Router } from "express";
import { createProfile } from "../controllers/profileController";

const profileRoute = Router();

profileRoute.post("/createProfile", createProfile);
export default profileRoute;
