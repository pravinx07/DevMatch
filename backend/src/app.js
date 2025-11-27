import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
import requestRouter from "./routes/request.routes.js";
import feedRouter from "./routes/feed.routes.js" 

app.use("/api/v1/user",userRouter)
app.use("/api/v1/user",requestRouter)
app.use("/api/v1/user", feedRouter)


export default app