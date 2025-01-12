import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserID = req.user._id; //req.user._id is the id of the logged in user and is set by the protectRoute middleware
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserID },
    }).select("-password"); //find all users except the logged in user

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; //get the id of the user to chat with from the request params
    const myId = req.user._id; //get the id of the logged in user from the request object

    const messages = await Message.find({
      $or: [
        //find messages where the senderId is myId and the receiverId is userToChatId or the senderId is userToChatId and the receiverId is myId
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; //get the text and image from the request body
    const { id: receiverId } = req.params; //get the id of the receiver from the request params
    const senderId = req.user._id; //get the id of the sender from the request object

    let imageUrl;
    if (image) {
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save(); //save the message to the database

    //todo: send the message to the receiver using websockets   

     res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage", error.message);
    res.status(500).json({ error: "Internal Server Error" });

  }
};
