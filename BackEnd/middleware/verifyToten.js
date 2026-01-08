import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    let token;

    // 1️⃣ Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Check cookies (HTTP-only cookie)
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    console.log("Token found:", token);

    // 3️⃣ If no token found
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id; // or decoded._id
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
