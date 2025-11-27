import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  requestRecieved,
  reviewRequest,
  sendRequest,
} from "../controllers/request.controller.js";
const requestRouter = express.Router();

requestRouter
  .route("/request/send/:status/:toUserId")
  .post(verifyJWT, sendRequest);

requestRouter.route("/request/recieved").get(verifyJWT, requestRecieved);

requestRouter
  .route("/request/reviews/:status/:requestId")
  .post(verifyJWT, reviewRequest);

export default requestRouter;
