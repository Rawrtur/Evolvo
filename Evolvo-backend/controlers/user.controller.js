import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateVerficationCode } from "../utils/codegenerator.util.js";
import { sendVerificationEmail } from "../utils/sendEmail.util.js";

import Lecture from "../models/lecture.model.js";
import Question from "../models/question.model.js";
import Subscription from "../models/subscription.model.js";
import AiUsage from "../models/ai-usage.model.js";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    role: user.role,
    streak: user.streak,
  };
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("_id name email verified role streak invited createdAt")
      .lean();

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
    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = normalizeEmail(email);

    session.startTransaction();

    const user = await User.findOne({ email: normalizedEmail }).session(
      session,
    );

    if (user) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUser] = await User.create(
      [
        {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          verified: true,
          appleAccountToken: crypto.randomUUID(),
          verificationCode: null,
          verificationExpiresIn: null,
          lastStreakDate: new Date(),
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: publicUser(newUser),
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    await session.endSession();
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { newPassword, password } = req.body;

    const user = await User.findById(req.user._id);

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
    const { newEmail, password } = req.body;

    const normalizedEmail = normalizeEmail(newEmail);

    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error("User was not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.email === normalizedEmail)
      return res.status(200).json({
        success: true,
        message: "Email is already up to date.",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Current Password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { pendingEmail: normalizedEmail }],
      _id: { $ne: user._id },
    });

    if (existingUser) {
      const error = new Error("Email address is already in use");
      error.statusCode = 409;
      throw error;
    }

    const verificationCode = generateVerficationCode();

    const salt = await bcrypt.genSalt(10);
    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt);

    user.pendingEmail = normalizedEmail;
    user.verified = false;
    user.verificationCode = hashedVerificationCode;
    user.verificationExpiresIn = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(normalizedEmail, verificationCode);

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
    const { newName, password } = req.body;

    const user = await User.findById(req.user._id);

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

    user.name = newName.trim();

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
  const session = await mongoose.startSession();

  try {
    const userId = req.user._id;

    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    await Lecture.deleteMany({ user: userId }, { session });
    await Question.deleteMany({ user: userId }, { session });
    await Subscription.deleteMany({ userId: userId }, { session });
    await AiUsage.deleteMany({ user: userId }, { session });
    await User.deleteOne({ _id: userId }, { session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Deleted User successfully",
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    await session.endSession();
  }
};

export const getLeaderBoard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

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

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });

    if (!user) {
      // Wichtig: Immer gleiche Antwort, egal ob E-Mail existiert!
      return res.json({
        message: "If the email address exists, a link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    await sendVerificationEmail(user.email, rawToken);

    res.status(201).json({
      success: true,
      message: "If the email address exists, a link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalid or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updatet Password successfully.",
    });
  } catch (error) {
    next(error);
  }
};
