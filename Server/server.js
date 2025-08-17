import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import express from "express";

const app = express();
app.use(express.json());

// 1. Configure your email transporter (example with Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password (not your real Gmail password)
  },
});

// 2. Function to send email
export async function sendSummaryEmail(toEmail, summaryText) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Meeting Summary",
    text: summaryText, // plain text
    // html: `<p>${summaryText}</p>`  // if you want HTML formatting
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error(" Error sending email:", error);
    return false;
  }
}

app.post("/send-summary", async (req, res) => {
  const { toEmail, summary } = req.body;
  const success = await sendSummaryEmail(toEmail, summary);
  if (success) {
    res.status(200).json({ message: "Email sent" });
  } else {
    res.status(500).json({ message: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Example usage
// sendSummaryEmail("recipient@example.com", "Here is the summary...");
