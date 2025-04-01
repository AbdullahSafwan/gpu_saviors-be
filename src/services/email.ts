import nodemailer from "nodemailer";
import { debugLog } from "./helper";

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const result = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    });
    return result;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};
