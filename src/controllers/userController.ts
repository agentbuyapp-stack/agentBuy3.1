import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { userModel } from "../models/userModel";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const event = await verifyWebhook(req);
    if (event.type === "user.created") {
      const data = event.data;
      try {
        const user = await clerkClient.users.getUser(data.id);
        console.log("user found id:", user.id);
        console.log("user found publicmetadata:", user.publicMetadata);
        console.log("user found unsafemetadata:", user.unsafeMetadata);
        console.log("user found name:", user.firstName);
      } catch (err) {
        console.warn("User not found yet in Clerk", data.id);
        return res.status(200).send("user not yet created");
      }
      const exists = await userModel.findOne({
        clerkId: data.id,
      });
      const signUpType =
        data.unsafe_metadata?.signUpType === "agent" ? "agent" : "user";
      await clerkClient.users.updateUser(data.id, {
        publicMetadata: {
          role: signUpType,
        },
        unsafeMetadata: {
          signUpType: null,
        },
      });
      if (!exists) {
        await userModel.create({
          clerkId: data.id,
          email: data.email_addresses?.[0].email_address,
          role: signUpType,
        });
      }
    }
    res.status(200).send("user created");
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(400).send("Webhook verification failed");
  }
};
