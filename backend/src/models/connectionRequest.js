import mongoose from "mongoose"

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"

    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
        
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},{
    timestamps:true,
})
connectionRequestSchema.index({fromUserId:1,toUserId:1})  // compound index it is for searching fast in db 

connectionRequestSchema.pre("save",function(next){
    const connectionReq = this;
    // check if the froUserId is same as toUserId
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error("can not send connection request to youself")
    }
    next();
})

export const ConnectionRequestModel = mongoose.model("ConnectionRequestModel",connectionRequestSchema)