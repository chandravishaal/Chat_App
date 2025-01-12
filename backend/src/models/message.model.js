import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({//creates a schema for the message model
  
  //senderID andf receiverID are the IDs are refernce to user model
  senderId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: {
    type: String,
  },
  image: {
    type: String,
  },
},
{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);//creates a model from the schema

export default Message;