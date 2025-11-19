import express from "express"
import {userAuth} from "../middlewares/auth.js"

import { ConnectionRequestModel } from "../models/connectionRequest.js";
import {User} from "../models/user.js"

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about";
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    return res.json({
      message: "Connection requests fetched",
      data: connectionRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get connection request ",
      error,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionReq = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName age gender photoUrl about email")
      .populate("toUserId", "firstName lastName age gender photoUrl about email");

    const data = connectionReq.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      
      return row.fromUserId;
    });
    return res.json({ data });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to get connection request ",
      error,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 : limit
    let skip = (page - 1) * limit

    const connectionReq = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionReq.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed)}},
        {_id: { $ne: loggedInUser._id },},
      ], // check not in the hidde users
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);
    return res.json({data:users})
  } catch (error) {
    return res.status(400).json({
      message: "Failed to get feed of users.",
      error,
    });
  }
});

export default userRouter;
