import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      
      
    },
    password: {
      type: String,
      required: true,
      minlength:6
    },
    age: {
      type: Number,
      min: 18,
      max: 65,
    },
    gender: {
      type: String,
     
    },
    avatar: {
      type: String,
      required:true
    },

    about: {
      type: String,
      default: "This is default about ",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.index({firstName:1, lastName:1})  // indexes is db for fast manipulating data


userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next();
  
  this.password = await bcrypt.hash(this.password, 10);
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    firstName:this.firstName,
    lastName:this.lastName
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  })
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
    _id:this._id,
  
   }
   ,
    process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
)
}
export const User = mongoose.model("User", userSchema);

