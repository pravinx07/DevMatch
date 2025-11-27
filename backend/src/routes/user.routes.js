import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changeCurrentPassword, getProfile, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar, userConnection } from "../controllers/user.controller.js";
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

router.route("/profile/view").get(verifyJWT,getProfile)

// router.route("/profile/edit").patch(verifyJWT,)
router.route("/connections").get(verifyJWT, userConnection)

export default router;
