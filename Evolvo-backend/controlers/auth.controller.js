import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import { generateVerficationCode } from "../utils/codegenerator.util.js";
import { sendVerificationEmail } from "../utils/sendEmail.util.js";

import Lecture from "../models/lecture.model.js";
import Question from "../models/question.model.js";

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

function createToken(userId) {
  return jwt.sign(
    {
      userId: userId.toString(),
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
}

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    // Logic to create a new User
    const { email, name, password, ref } = req.body;

    const normalizedEmail = normalizeEmail(email);

    session.startTransaction();
    // Check if User already exists
    const existingUser = await User.findOne({ email: normalizedEmail }).session(
      session,
    );

    const verificationCode = generateVerficationCode();

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt);

    if (existingUser) {
      if (existingUser.verified) {
        const error = new Error("User already exists.");
        error.statusCode = 409;
        throw error;
      }

      const isCorrectPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!isCorrectPassword) {
        const error = new Error("User already exists with other details.");
        error.statusCode = 409;
        throw error;
      }

      existingUser.verificationCode = hashedVerificationCode;
      existingUser.verificationExpiresIn = new Date(
        Date.now() + 15 * 60 * 1000,
      );

      await existingUser.save({ session });
    } else {
      const hashedPassword = await bcrypt.hash(password, salt);

      const [newUser] = await User.create(
        [
          {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            verified: false,
            verificationCode: hashedVerificationCode,
            verificationExpiresIn: new Date(Date.now() + 15 * 60 * 1000),
            lastStreakDate: new Date(),
            appleAccountToken: crypto.randomUUID(),
          },
        ],
        {
          session,
        },
      );

      if (
        ref &&
        mongoose.Types.ObjectId.isValid(ref) &&
        ref.toString() !== newUser._id.toString()
      ) {
        // console.log("increased");
        await User.findByIdAndUpdate(
          ref,
          { $inc: { invited: 1 } },
          { session },
        );
      }
    }

    await session.commitTransaction();
    await sendVerificationEmail(normalizedEmail, verificationCode);

    res.status(201).json({
      success: true,
      message: "VerificationCode sended",
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

export const verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verfication data",
      });
    }

    if (
      !user.verificationExpiresIn ||
      user.verificationExpiresIn.getTime() < Date.now()
    ) {
      return res.status(400).json({
        error: "Code is expired",
      });
    }

    const isCodeValid = await bcrypt.compare(code, user.verificationCode);

    if (!isCodeValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid Verification Code.",
      });
    }

    if (user.pendingEmail) {
      user.email = user.pendingEmail;
      user.pendingEmail = null;
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationExpiresIn = null;

    await user.save();

    const token = createToken(user._id);

    const [lectures, questions] = await Promise.all([
      Lecture.find({ user: user._id }),
      Question.find({ user: user._id }),
    ]);

    res.json({
      success: true,
      data: {
        token,
        user: publicUser(user),
        questions,
        lectures,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.verified) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, a verification code has been sent.",
      });
    }

    const verificationCode = generateVerficationCode();
    const salt = await bcrypt.genSalt(10);
    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt);

    user.verificationCode = hashedVerificationCode;
    user.verificationExpiresIn = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    await sendVerificationEmail(normalizedEmail, verificationCode);

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

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address first.",
      });
    }

    const token = createToken(user._id);

    const [lectures, questions] = await Promise.all([
      Lecture.find({ user: user._id }),
      Question.find({ user: user._id }),
    ]);

    res.status(200).json({
      success: true,
      message: "User Signed In successfully",
      data: {
        token,
        user: publicUser(user),
        lectures,
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    /*
     * With a stateless JWT, the client removes the token.
     *
     * If you later introduce refresh tokens, implement
     * server-side refresh-token revocation here.
     */
    return res.status(200).json({
      success: true,
      message: "User signed out successfully.",
    });
  } catch (error) {
    next(error);
  }
};
