// const connectDB = require("../config/database");
import express from "express"

import { connectDB } from "./src/config/database.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { initSocketIo } from "./src/utils/socketIo.js";


const app = express();
app.use(cookieParser()); // use for read a cookie
app.use(express.json()); // help to read json data
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
dotenv.config({
  path:"./.env"
})


const server = http.createServer(app);
initSocketIo(server);


import authRouter from "./src/routes/auth.js";
import profileRouter from "./src/routes/profile.js";
import requestRouter from "./src/routes/request.js";
import userRouter from "./src/routes/user.js";

app.use("/",authRouter)  // check the all routes in authROuter
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/", userRouter)
connectDB()
  .then(() => {
    console.log("Database connection estabalish....");
    server.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database connection failed...");
  });
