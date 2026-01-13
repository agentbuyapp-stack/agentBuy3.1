import e, { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { userModel } from "../models/userModel";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const event = await verifyWebhook(req);
    if (event.type === "session.created") {
      const session = event.data;
      // console.log({ session });
      const userData = await clerkClient.users.getUser(session.user_id);
      const exists = await userModel.findOne({
        clerkId: userData.id,
      });
      // const signUpType =
      //   userData.unsafeMetadata?.signUpType === "agent" ? "agent" : "admin";
      // await clerkClient.users.updateUser(userData.id, {
      //   publicMetadata: {
      //     role: signUpType,
      //   },
      // });
      const role = userData.unsafeMetadata?.signUpType;
      console.log("ROLE:", role);
      console.log("USER_DATA:", userData);
      console.log("UNSAFE_META_DATA:", userData.unsafeMetadata);

      if (!exists) {
        await userModel.create({
          clerkId: userData.id,
          email: userData.emailAddresses?.[0].emailAddress,
          role: role,
        });
      }
    }
    res.status(200).send("user created");
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(400).send("Webhook verification failed");
  }
};
