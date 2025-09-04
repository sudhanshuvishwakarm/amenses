import { connectDB } from "../../../../dbConfig/dbconnection.js";
import { NextResponse } from "next/server";
import User from "../../../../models/User.js";
import { sendEmail } from "../../../../utils/nodemailer.js";

connectDB();

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found." }, 
        { status: 404 }
      );
    }
    
    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email is already verified." }, 
        { status: 400 }
      );
    }
    
    // Generate new OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    await user.save();
    
    // Send email
    await sendEmail(email, verificationCode, user.username);
    
    return NextResponse.json(
      { message: "OTP sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error." }, 
      { status: 500 }
    );
  }
}