import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([
      {
        name,
        email,
        password: hashedPassword,
        verified: true,
        verificationExpiresIn: new Date(),
      },
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUsers[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const { newPassword, password } = req.body;

    if (!user) {
      const error = new Error("User was not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Current Password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updated password successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const { newEmail, password } = req.body;

    if (!user) {
      const error = new Error("User was not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Current Password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    user.email = newEmail;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updated email successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateName = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const { newName, password } = req.body;

    if (!user) {
      const error = new Error("User was not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Current Password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    user.name = newName;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updated Name successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Deleted User successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaderBoard = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const above = await User.find({
      $or: [
        { invited: { $gt: user.invited } },
        {
          invited: user.invited,
          createdAt: { $lt: user.createdAt },
        },
      ],
    })
      .select("name invited")
      .sort({ invited: -1, createdAt: 1 })
      .limit(3);

    const below = await User.find({
      invited: { $lt: user.invited },
    })
      .select("name invited -_id")
      .sort({ invited: 1, createdAt: -1 })
      .limit(3);

    const rank =
      (await User.countDocuments({
        $or: [
          { invited: { $gt: user.invited } },
          {
            invited: user.invited,
            createdAt: { $lt: user.createdAt },
          },
        ],
      })) + 1;

    const top = await User.find({})
      .select("name invited")
      .sort({ invited: -1, _id: 1 })
      .limit(3);

    res.status(200).json({
      success: true,
      message: "Got Leaderboard",
      top,
      above,
      rank,
      invited: user.invited,
      below,
    });
  } catch (error) {
    next(error);
  }
};
