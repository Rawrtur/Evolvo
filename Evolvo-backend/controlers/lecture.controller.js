import mongoose from "mongoose";
import Lecture from "../models/lecture.model.js";
import Question from "../models/question.model.js";
import User from "../models/user.model.js";

function daysBetween(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export const getLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find({ user: req.user._id }).select(
      "-password -verificationCode -verificationExpiresIn",
    );

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
    const lecture = await Lecture.findOne({
      user: req.user._id,
      _id: req.params.id,
    }).select("-__v -user -createdAt -updatedAt");

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
    const { title, color, icon, type } = req.body;

    const newLectures = await Lecture.create(
      [
        {
          title,
          color,
          type,
          icon,
          user: req.user._id,
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

    const lecture = await Lecture.findOne({
      user: req.user._id,
      _id: req.params.id,
    });

    if (!lecture) {
      const error = new Error("Lecture not found");
      error.statusCode = 404;
      throw error;
    }

    lecture.title = title;
    lecture.color = color;
    lecture.icon = icon;
    lecture.lastLecture = lastLecture;

    await lecture.save();

    res.status(200).json({
      success: true,
      message: "Lecture updatet successfully",
      lecture,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLecture = async (req, res, next) => {
    const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    await Lecture.deleteOne({ _id: req.params.id, user: req.user._id }).session(session);
    await Question.deleteMany({ lecture: req.params.id, user: req.user._id }).session(session);

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    await session.endSession()
  }
};

export const getAllUserLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find({ user: req.user._id }).select(
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

export const commitLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findOne({
      user: req.user._id,
      _id: req.params.id,
    });
    const user = await User.findById(lecture.user);

    if (user.lastStreakDate) {
      const diffDays = daysBetween(new Date(user.lastStreakDate), new Date());

      if (diffDays === 0) {
        // Heute schon aktiv gewesen – nichts tun
      } else if (diffDays === 1) {
        // Genau ein Tag später – Streak fortsetzen
        user.streak += 1;
      } else {
        // Mehr als 1 Tag Pause – Streak gebrochen
        user.streak = 1;
      }

      user.lastStreakDate = new Date();
    } else {
      // Erster Eintrag überhaupt
      user.streak = 1;
    }

    lecture.lastLecture = new Date();

    await lecture.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Updated User Lecture",
      lecture,
    });
  } catch (error) {
    next(error);
  }
};
