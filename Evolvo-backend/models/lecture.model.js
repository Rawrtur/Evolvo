import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lecture Title is required."],
      minLength: 1,
      maxLength: 100,
    },
    color: {
      type: String,
      enum: ["#c6a465", "#ba6363", "#5ec9d1", "#afba63"],
      default: "#ba6363",
    },
    type: {
      type: String,
      enum: ["Calculate", "Theory", "Practise", "Experimental", "Project"],
      default: "Practise",
    },
    icon: {
      type: String,
      enum: ["calculator", "book", "code", "pulse"],
      default: "book",
    },
    lastLecture: {
      type: Date,
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

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
