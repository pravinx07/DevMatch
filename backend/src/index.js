import dotenv from "dotenv"
import {connectDB} from "./config/database.js"
import app from "./app.js"

dotenv.config({
  path:"./.env"
})

connectDB()
.then(() => {
  app.listen(process.env.PORT,()=>{
    console.log(`Server is running at PORT: ${process.env.PORT}`);
    
  })
}).catch((err) => {
  console.log("Mongo DB connection failed !!! ");
  
});

