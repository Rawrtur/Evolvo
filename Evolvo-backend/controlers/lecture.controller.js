import mongoose from "mongoose";
import Lecture from "../models/lecture.model.js";
import Question from "../models/question.model.js";
import User from "../models/user.model.js";

export const getLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find().select("-__v -createdAt -updatedAt");

    res.status(200).json({
      success: true,
      message: "Lectures collected successfully",
      data: {
        lectures,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findById(req.params.id).select(
      "-__v -user -createdAt -updatedAt",
    );

    res.status(200).json({
      success: true,
      message: "Lecture found",
      data: {
        lecture,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createLecture = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, color, icon, user, type } = req.body;

    const newLectures = await Lecture.create(
      [
        {
          title,
          color,
          type,
          icon,
          user,
          lastLecture: new Date(),
        },
      ],
      {
        session,
      },
    );
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture: newLectures[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const updateLecture = async (req, res, next) => {
  try {
    const { title, color, icon, lastLecture } = req.body;

    const lecture = await Lecture.findById(req.params.id);

    lecture.title = title;
    lecture.color = color;
    lecture.icon = icon;
    lecture.lastLecture = lastLecture;

    res.status(200).json({
      success: true,
      message: "Lecture updatet successfully",
      lecture,
    });

    await lecture.save();
  } catch (error) {
    next(error);
  }
};

export const deleteLecture = async (req, res, next) => {
  try {
    await Lecture.deleteOne({ _id: req.params.id });
    await Question.deleteMany({ lecture: req.params.id });

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUserLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find({ user: req.params.id }).select(
      "-__v -user -createdAt -updatedAt",
    );

    res.status(200).json({
      success: true,
      message: "Got all User lectures",
      data: {
        lectures,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const commitLecture = async (req,res,next) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    const user = await User.findById(lecture.user);

    user.streak = user.streak + 1;

    if (user.lastStreakDate) {
      const lastStreakDate = new Date(user.lastStreakDate);
      const today = new Date();
      const diffTime = Math.abs(today - lastStreakDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        user.streak = 1;
      }
    }

    lecture.lastLecture = new Date();

    await lecture.save()

    res.status(200).json({
      success: true,
      message: "Updated User Lecture",
      lecture
    });

  } catch (error) {
    next(error);
  }
}