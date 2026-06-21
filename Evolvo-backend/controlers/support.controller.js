import mongoose from "mongoose";
import Support from "../models/support.model.js";

export const getAllProblems = async (req, res, next) => {
  try {
    const problems = await Support.find();

    res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error) {
    next(error);
  }
};

export const createSupport = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user, problem } = req.body;

    const newSupports = await Support.create(
      [
        {
          problem,
          status: "pending",
          user: user || "Non existing User",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Support created successfully",
      support: newSupports[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const support = await Support.findById(req.params.id);

    support.status = status;

    res.status(200).json({
      success: true,
      message: "Support status updated successfully",
    });

    await support.save();
  } catch (error) {
    next(error);
  }
};

export const deleteSupport = async (req, res, next) => {
  try {
    await Support.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Support deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
