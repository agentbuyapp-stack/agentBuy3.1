import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { userModel } from "../models/userModel";

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const event = await verifyWebhook(req);
    if (event.type === "user.created") {
      const data = event.data;
      const clerkId = data.id;
      const email = data.email_addresses?.[0].email_address;
      const exists = await userModel.findOne({
        clerkId: data.id,
      });
      const roleAgent = await userModel.findOne({
        role: "agent",
      });
      const roleAdmin = await userModel.findOne({
        role: "admin",
      });
      const adminApproveAgent = await userModel.findOneAndUpdate({
        
      });
      if (!exists) {
        await userModel.create({
          clerkId,
          email,
        });
      }
    }
    res.status(200).send("webhook recieved");
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(400).send("Webhook verification failed");
  }
};
