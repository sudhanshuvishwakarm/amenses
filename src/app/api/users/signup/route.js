
import { connectDB } from "../../../../dbConfig/dbconnection.js";
import { NextResponse} from "next/server";
import bcrypt from "bcryptjs"
import User from "../../../../models/User.js";
import { sendEmail } from "../../../../utils/nodemailer.js";
connectDB();
export async function POST(request) {
    try {
        const { username, email, password } = await request.json();
        console.log("Received signup data:", { username, email, password });
        const existUser = await User.findOne({ email });
        if (existUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationCode
        });
        const savedUser = await newUser.save();
        console.log("User created successfully", savedUser);
        await sendEmail(email,verificationCode,username);
        return NextResponse.json(
            { message: "User created successfully.", user: savedUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during user signup:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
