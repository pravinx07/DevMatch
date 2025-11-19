import express from "express";

import {userAuth} from "../middlewares/auth.middlewarejs";
import {validateEditProfileData} from "../utils/validation.js";
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error in token  : " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    return res.json({
      message: `${loggedInUser.firstName} your Profile Updated Successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    return res.status(400).send("ERROR : " + error.message);
  }
});

export default profileRouter;
