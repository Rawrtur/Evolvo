import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: [true, "Problem is required"],
      minLength: 15,
    },
    status: {
      type: String,
      enum: ["pending", "working", "closed"],
      default: "pending",
    },
    user: {
      type: String,
      required: [true, "User is required"],
    },
  },
  { timestamps: true },
);

const Support = mongoose.model("Support", supportSchema);

export default Support;
