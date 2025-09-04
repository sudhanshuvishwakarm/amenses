import jwt from "jsonwebtoken";

const getDataFromToken = async (request) => {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            throw new Error("No token provided");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        return decodedToken.id; 
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
}

export default getDataFromToken;

