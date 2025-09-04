import { connectDB } from "../../../../dbConfig/dbconnection.js";
import { NextResponse, NextRequest } from "next/server";

connectDB();

export async function POST(request) {
    try {
        const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: 0,
        });
        return response; 
    } catch (error) {
        console.error("Error during user logout:", error);
        return NextResponse.json({ error: "Internal server error during logout." }, { status: 500 }); 
    }
}