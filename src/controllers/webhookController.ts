import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import { userModel } from "../models/userModel";

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const event = await verifyWebhook(req);
    if (event.type === "user.created") {
      const userData = event.data;
      const exists = await userModel.findOne({
        clerkId: userData.id,
      });
      if (exists)
        return res.status(400).json({ message: "USER ALREADY EXISTS" });
      if (!exists) {
        console.log("USERDATA:", userData);
        const signupType = userData.unsafe_metadata?.signupType;
        const newUser = await userModel.create({
          clerkId: userData.id,
          email: userData.email_addresses?.[0]?.email_address,
          role: signupType,
        });
        console.log("NEW USER:", newUser);
        console.log("ROLE:", signupType);
        res.status(200).json({ USER_CREATED: newUser });
      }
    }
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.status(400).send("INTERNAL SERVER ERROR");
  }
};
