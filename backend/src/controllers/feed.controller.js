import { ConnectionRequestModel } from "../models/connectionRequest.js";
import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";

const USER_SAFE_DATA =
  "firstname lastname age gender avatar about email";

export const getFeed = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;

  const skip = (page - 1) * limit;

  // Users connected or already interacted
  const connectionReq = await ConnectionRequestModel.find({
    $or: [
      { fromUserId: loggedInUserId },
      { toUserId: loggedInUserId },
    ],
  }).select("fromUserId toUserId");

  const hideUserFromFeed = new Set();

  connectionReq.forEach((row) => {
    hideUserFromFeed.add(row.fromUserId.toString());
    hideUserFromFeed.add(row.toUserId.toString());
  });

  // Make sure logged-in user is excluded always
  hideUserFromFeed.add(loggedInUserId.toString());

  // Final feed query
  const users = await User.find({
    _id: {
      $nin: Array.from(hideUserFromFeed),
    },
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return res.status(200).json({
    page,
    count: users.length,
    data: users,
  });
});
