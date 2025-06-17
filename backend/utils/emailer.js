import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to, otp) => {
  try {
    const data = await resend.emails.send({
      from: `MtxTracker <${process.env.SENDER_EMAIL}>`,
      to: to,
      subject: "Verify Your MtxTracker Account",
      text: `Hi gamer,

Thanks for signing up for MtxTracker!

To verify your account, please enter the following code:

Your verification code: ${otp}

This code will expire in 30 minutes.

If you didn’t request this, you can safely ignore this email.`,
    });

    console.log("Email sent successfully:", data);
    return true;
  } catch (err) {
    console.error("Failed to send verification email", err);
    return false;
  }
};

export const sendPasswordResetEmail = async (to, otp) => {
  try {
    const data = await resend.emails.send({
      from: `MtxTracker <${process.env.SENDER_EMAIL}>`,
      to: to,
      subject: "Your Password Reset Code",
      text: `Hi gamer,

We received a request to reset your password.

Your reset code is: ${otp}

This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.`,
    });

    console.log("Email sent successfully:", data);
    return true;
  } catch (err) {
    console.error("Failed to send verification email", err);
    return false;
  }
};
