import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import { generateVerficationCode } from "../utils/codegenerator.util.js";
import { sendVerificationEmail } from "../utils/sendEmail.util.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Logic to create a new User
    const { email, name, password } = req.body;

    // Check if User already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateVerficationCode();

    const newUsers = await User.create(
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

    if (user.verificationExpires < Date.now()) {
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
      },
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User Signed In successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  res.send({ message: "not implemented yet" });
};
