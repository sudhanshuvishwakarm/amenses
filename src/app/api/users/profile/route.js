import { connectDB } from "../../../../dbConfig/dbconnection.js";
import User from "../../../../models/User.js";
import { NextResponse, NextRequest } from "next/server";
import getDataFromToken from "../../../../utils/getDataFromToken.js";

connectDB();

export async function POST(request){
    
    const userId = await getDataFromToken(request)
    const user = await User.findOne({ _id: userId }).select("-password -verifyToken -verifyTokenExpiry");
    if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json({message: "User found , me", user }, { status: 200 });
}