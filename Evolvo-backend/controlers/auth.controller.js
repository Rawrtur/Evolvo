import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import { generateVerficationCode } from "../utils/codegenerator.util.js";
// import { sendVerificationEmail } from "../utils/sendEmail.util.js";
import Lecture from "../models/lecture.model.js";
import Question from "../models/question.model.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Logic to create a new User
    const { email, name, password, ref } = req.body;

    // Check if User already exists
    const existingUser = await User.findOne({ email });

    if (ref && mongoose.Types.ObjectId.isValid(ref)) {
      console.log("increased")
      await User.findByIdAndUpdate(ref, { $inc: { invited: 1 } });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateVerficationCode();

    if (existingUser) {
      const isCorrectPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (existingUser.verified) {
        const error = new Error("User already exists.");
        error.statusCode = 409;
        throw error;
      }

      if (!isCorrectPassword) {
        const error = new Error("User already exists with other details.");
        error.statusCode = 409;
        throw error;
      }

      existingUser.verificationCode = verificationCode;
      existingUser.verificationExpiresIn = Date.now() + 15 * 60 * 10000;

      await existingUser.save();
    } else {
      await User.create(
        [
          {
            name,
            email,
            password: hashedPassword,
            verified: false,
            verificationCode,
            verificationExpiresIn: Date.now() + 15 * 60 * 10000,
          },
        ],
        {
          session,
        },
      );
    }
    // await sendVerificationEmail(email, verificationCode);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "VerificationCode sended",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (user.verificationExpiresIn < Date.now()) {
      return res.status(400).json({
        error: "Code is expired",
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        error: "wrong code",
      });
    }

    user.verified = true;
    user.verificationCode = null;

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      success: true,
      data: {
        token,
        user,
        questions: [],
        lectures: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User does not exist. Create a Accoutn first");
      error.statusCode = 409;
      throw error;
    }

    const verificationCode = generateVerficationCode();

    user.verificationCode = verificationCode;
    user.verificationExpiresIn = Date.now() + 15 * 60 * 10000;

    await user.save();

    res.status(200).json({
      success: true,
      message: "VerificationCode sended",
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Incorrect Password");
      error.statusCode = 401;
      throw error;
    }

    const lectures = await Lecture.find({ user: user._id });
    const questions = await Question.find({ user: user._id });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User Signed In successfully",
      data: {
        token,
        user,
        lectures,
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  res.send({ message: "not implemented yet" });
};
