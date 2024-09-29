import nodemailer from "nodemailer";
import asyncHandler from "../middlewares/asyncHandler.js";

const sendEmail = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "shuklag868@gmail.com",
      pass: "Y6yaArmqMPvRtJQw", // Use your SMTP Master Password
    },
  });

  const mailOptions = {
    from: "shuklag868@gmail.com",
    to: "202252316@iiitvadodara.ac.in",
    subject: "New Contact Message",
    html: `<p>New message from: <strong>${name}</strong></p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

export default sendEmail;
