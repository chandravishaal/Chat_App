import { generateKey } from "crypto";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "All fields are required" });
  }

  //signup--hashing of pass--bcrypt/create token
  try {
    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password should be atleast 6 characters long",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    //hashing of password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate token
      generateToken(newUser._id, res);
      await newUser.save(); //save user to db

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ status: "error", message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error on signup", error.message);
    res.status(500).json({ status: "error", message: " Interal Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password); //compare hashed password with the password entered by user

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    //generate token
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error on login", error.message);
    res.status(500).json({ status: "error", message: " Interal Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    console.log("Error on logout", error.message);
    res.status(500).json({ status: "error", message: " Interal Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res
        .status(400)
        .json({ status: "error", message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); //upload the profile picture to cloudinary
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ); //update the user profile picture

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error on updateProfile", error);
    res.status(500).json({ status: "error", message: "Internal Server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
     res.status(200).json(req.user);
  } catch (error) {
    console.log("Error on checkAuth", error.message);
    res.status(500).json({ status: "error", message: "Internal Server error" });
  }
}