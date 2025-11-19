import jwt from "jsonwebtoken"
import {User} from "../models/user.js"

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message:"You are not login! Please login"
      })
    }

    const decodeObj = await jwt.verify(token, "DEV@Tinder123");
    const { _id } = decodeObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Authentication error:", error.stack);
    return res.status(400).json({
      message: "ERROR while sending request: " + error.message,
    });
  }
};

