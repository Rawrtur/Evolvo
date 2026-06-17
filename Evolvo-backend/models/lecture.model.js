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
      enum: ["#f5c542","#e8def8","#b8d4e3","#b8e8d0"],
      default: "#f5c542",
    },
    type: {
      type: String,
      enum: ["Calculate", "Theory", "Practise", "Experimental", "Project"],
      default: "Practise",
    },
    icon: {
      type: String,
      enum: ["book", "calculator", "pulse", "flask", "code"],
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
