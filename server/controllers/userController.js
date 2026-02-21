import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const getUserData = async (req, res) => {
  try {
    // Prefer the JWT stored in the `token` cookie. Fall back to body or req.userId.
    const token = req.cookies?.token || req.body?.token;
    let userId = req.body?.userId || req.userId;

    if (!userId && token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        userId = payload.id;
      } catch (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }
    }

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User ID from token:", req.userId);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error.message);
  }
};
