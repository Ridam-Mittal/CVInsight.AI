import { NonRetriableError } from "inngest";
import { User } from "../../models/user.js";
import { inngest } from "../client.js";
import { sendMail } from "../../utils/mailer.js";

export const OnRequestOtp = inngest.createFunction(
  { id: "on-otp-request", retries: 2 },
  { event: "otp/request" },
  async ({ event, step }) => {
    try {
      const { userId, email, otp } = event.data;
      console.log(process.env.MAILTRAP_SMTP_USER);

      const user = await step.run("get-user", async () => {
        const found = await User.findById(userId);
        if (!found) throw new NonRetriableError("User not found.");
        return found;
      });

      // Step 1: Send OTP Email First
      await step.run("send-otp-email", async () => {
        const subject = "Account Verification - OTP";
        const text = `Your OTP is ${otp}. It will expire in 5 minutes.`;

        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4F46E5;">🔐 OTP for Account Verification</h2>
            <p>Hello ${user.fullname},</p>
            <p>Your OTP is: <strong style="color: #1F2937;">${otp}</strong></p>
            <p>This OTP is valid for the next <strong>5 minutes</strong>.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
          </div>
        `;

        await sendMail(email, subject, text, html); // If this fails, OTP won't be saved
      });

      // Step 2: Save OTP *only if* email was sent successfully
      await step.run("store-otp", async () => {
        const userToUpdate = await User.findById(user._id); // rehydrate full Mongoose model
        userToUpdate.otp = otp;
        userToUpdate.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins expiry
        await userToUpdate.save();
      });

      return { success: true };
    } catch (error) {
      console.error("Error in otp/request function:", error.message);
      return { success: false };
    }
  }
);
