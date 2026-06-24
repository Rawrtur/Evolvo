import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required."],
      trim: true,
      minLength: 2,
      maxLength: 15,
    },
    email: {
      type: String,
      required: [true, "User Email is required."],
      trim: true,
      unique: true,
      lowerCase: true,
      minLength: 5,
      maxLength: 255,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required."],
      minLength: 6,
    },
    verified: {
      type:Boolean,
      required: [true, "Verified is required"]
    },
    verificationCode: {
      type: String,
    },
    verificationExpiresIn: {
      type: Date,
      required: [true, "VerficationExpiresIn is required"],
    },
    invited: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

