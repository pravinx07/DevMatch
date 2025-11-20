import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changeCurrentPassword, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT,updateUserAvatar )

export default router;
