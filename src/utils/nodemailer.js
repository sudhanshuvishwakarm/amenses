import nodemailer from 'nodemailer';
export const sendEmail = async (email, otp, username) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, 
            },
        });

        const mailOptions = {
            from: `"AMENSES INNOVATION" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verification Code</h2>
          <p>Dear ${username},</p>
          <p>Your OTP code is:</p>
          <h1 style="color: #4CAF50;">${otp}</h1>
          <p>This code will expire in <b>3 hours</b>. Do not share it with anyone.</p>
          <br/>
          <p>Best regards,<br/>AMENSES TEAM</p>
        </div>
      `,
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully.");
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed");
    }
};
