import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getFeed } from "../controllers/feed.controller.js";

const router = express.Router();

router.route("/feed").get(verifyJWT, getFeed);

export default router;
