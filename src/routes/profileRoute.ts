import { Router } from "express";
import {
  createProfile,
  getProfileById,
  updateProfile,
} from "../controllers/profileController";

const profileRoute = Router();

profileRoute.post("/createProfile/:_id", createProfile);
profileRoute.get("/getProfileById/:_id", getProfileById);
profileRoute.put("/updateProfile/:_id", updateProfile);
export default profileRoute;
