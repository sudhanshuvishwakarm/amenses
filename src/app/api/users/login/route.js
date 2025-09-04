

import { connectDB } from "../../../../dbConfig/dbconnection.js";
import User from "../../../../models/User.js";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
connectDB();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log("Received login data:", reqBody);

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found. login error" }, { status: 404 });
        }

        console.log("User found for login:", user);
        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) {
            return NextResponse.json({ error: "Invalid password." }, { status: 400 });
        }

        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
        const response = NextResponse.json({ message: "Login successful", token, user: tokenData }, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60, 
        });
        return response;
    } catch (error) {
        console.error("Error during user login:", error);
        return NextResponse.json({ error: "Internal server error.user login" }, { status: 500 });
    }
}