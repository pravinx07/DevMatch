import { ConnectionRequestModel } from "../models/connectionRequest.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.js";

export const sendRequest = asyncHandler(async (req, res) => {
  const fromUserId = req.user._id; // from userId
  const toUserId = req.params.toUserId;
  const status = req.params.status;

  const allowedStatus = ["ignored", "interested"];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status type: " + status);
  }

  // check user cant send connection req to ourself

  if (fromUserId.toString() === toUserId.toString()) {
    throw new ApiError(400, "you can not send request to yourself");
  }

  // check the user exist or not in db
  const toUser = await User.findById(toUserId);
  if (!toUser) {
    throw new ApiError(404, "User not found");
  }

  // check if there is an existing connection request
  const existingConnectionRequest = await ConnectionRequestModel.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (existingConnectionRequest) {
    // check connection request and not send double
    throw new ApiError(400, "connection request already exist");
  }
  const connectionRequest = await ConnectionRequestModel.create({
    fromUserId,
    toUserId,
    status,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        connectionRequest,
        "Connection Request Send Successfully"
      )
    );
});

export const reviewRequest = asyncHandler(async (req, res) => {
  const { status, requestId } = req.params;
  const loggedInUser = req.user;

  const allowedStatus = ["accepted", "rejected"];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(403, "Status must be accepted or rejected");
  }

  const connectionRequest = await ConnectionRequestModel.findOne({
    _id: requestId,
    toUserId: loggedInUser._id,
    status: "interested",
  });

  if (!connectionRequest) {
    throw new ApiError(404, "connection request not found ");
  }

  // update status
  connectionRequest.status = status;
  const data = await connectionRequest.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        connectionRequest,
        `Connection request ${status} successfully`
      )
    );
});

// request recives
const USER_SAFE_DATA = "firstname lastname age gender avatar about";

export const requestRecieved = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  const connectionRequest = await ConnectionRequestModel.find({
    toUserId: loggedInUser._id,
    status: "interested",
  }).populate("fromUserId", USER_SAFE_DATA);

  return res.json({
    message: "Connection requests fetched",
    data: connectionRequest,
  });
});
