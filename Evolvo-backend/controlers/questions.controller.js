import mongoose from "mongoose";
import Question from "../models/question.model.js";
import Lecture from "../models/lecture.model.js";

export const getAllUserQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ user: req.user._id }).select(
      "-__v -createdAt -updatedAt",
    );
    res.status(200).json({
      success: true,
      message: "Got all User Questions",
      questions,
    });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { question, answer, lecture } = req.body;

    const ownedLecture = await Lecture.findOne({
      _id: lecture,
      user: req.user._id,
    });

    if (!ownedLecture) {
      const error = new Error("Lecture not found");
      error.statusCode = 404;
      throw error;
    }

    const newQuestions = await Question.create(
      [
        {
          question,
          answer,
          lecture,
          user: req.user._id,
          state: "short",
        },
      ],
      { session },
    );
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: newQuestions[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await Question.deleteOne({ _id: req.params.id, user: req.user._id });
    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { question, answer, state, lastAnswered } = req.body;

    const updatedQuestion = await Question.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!updatedQuestion) {
      const error = new Error("Question not found");
      error.statusCode = 404;
      throw error;
    }

    updatedQuestion.question = question;
    updatedQuestion.answer = answer;
    updatedQuestion.state = state;
    updatedQuestion.lastAnswered = lastAnswered;

    await updatedQuestion.save();

    res.status(200).json({
      success: true,
      message: "Question updatet successfully",
      updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};
