import mongoose from 'mongoose';

//schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }//created at... updated at...
);


//model
const User = mongoose.model("User", userSchema);//singular and camelcase --USER

export default User;