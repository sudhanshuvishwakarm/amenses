


import { connectDB } from "../../../../dbConfig/dbconnection.js";
import User from "../../../../models/User.js";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

connectDB();

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    const user = await User.findOne({
      email,
      verificationCode: otp
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid OTP or email." },
        { status: 400 }
      );
    }

    const now = new Date();
    const otpCreatedAt = user.updatedAt;
    const diffInMinutes = (now - otpCreatedAt) / (1000 * 60);

    if (diffInMinutes > 10) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationCode = undefined; // Clear the OTP
    await user.save();

    // Create token data (exclude password)
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified
    };

    // Create token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Create response with cookie
    const response = NextResponse.json(
      { 
        message: "Email verified successfully!", 
        success: true,
        user: tokenData 
      }, 
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 1 day
    });

    return response;

  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

