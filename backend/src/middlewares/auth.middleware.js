import jwt from "jsonwebtoken"
import {User} from "../models/user.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"


// export const userAuth = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;
//     if (!token) {
//       return res.status(401).json({
//         message:"You are not login! Please login"
//       })
//     }

//     const decodeObj = await jwt.verify(token, "DEV@Tinder123");
//     const { _id } = decodeObj;

//     const user = await User.findById(_id);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     req.user = user;
//     return next();
//   } catch (error) {
//     console.error("Authentication error:", error.stack);
//     return res.status(400).json({
//       message: "ERROR while sending request: " + error.message,
//     });
//   }
// };



export const verifyJWT = asyncHandler(async(req,res,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
    if(!token){
      throw new ApiError(401,"Unauthorized request")
   }

   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

   const user = await User.findById(decodedToken._id).select("-password -refreshToken")

   if(!user){
    throw new ApiError(401, "Invalid Access Token")
    
  }
  req.user = user;
  next();
   } catch (error) {
    console.log("Error in Auth middleware ", error);
     throw new ApiError(401, error?.message || "Invalid access token")
   }
}
)