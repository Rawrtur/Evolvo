import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
    state: {
      type: String,
      enum: ["short", "long", "medium", "none"],
      default: "short",
    },
    lastAnswered: {
      type: Date,
    },
    lecture: {
      type: mongoose.Schema.ObjectId,
      ref: "Lecture",
      required: [true, "Lecture is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
  },
  { timestamps: true },
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
