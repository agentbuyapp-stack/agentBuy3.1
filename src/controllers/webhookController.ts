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
      const signupType = userData.unsafe_metadata?.signupType;
      if (!exists) {
        await userModel.create({
          clerkId: userData.id,
          email: userData.email_addresses?.[0]?.email_address,
          role: signupType,
        });
        console.log("User created in database");
        console.log("ROLE:", signupType);
      } else {
        console.log("User already exists in database");
      }
    }
    res.status(200).send("webhook received");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(400).send("Webhook verification failed");
  }
};
