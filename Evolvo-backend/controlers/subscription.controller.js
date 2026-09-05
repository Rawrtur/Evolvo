import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      plan,
      provider,
      providerCustomerId,
      providerSubscriptionId,
    } = req.body;

    const user = await Subscription.findOne({userId: req.user._id, status: "active"});

    if (user) {
      const error = new Error("User already has a subscription");
      error.statusCode = 409;
      throw error;
    }

    const nextPaymentInDays =
      plan === "weekly" ? 7 : plan === "monthly" ? 30 : 365;

    const newSubscriptions = await Subscription.create([
      {
        userId: req.user._id,
        status: "active",
        startDate: new Date(),
        endDate: Date.now() + nextPaymentInDays * 24 * 60 * 60 * 1000,
        plan,
        provider,
        providerCustomerId,
        providerSubscriptionId,
      },
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      subscription: newSubscriptions[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { status, autoRenew, plan } = req.body;

    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      const error = new Error("No subscription was found");
      error.statusCode = 409;
      throw error;
    }

    if (status) {
      subscription.status = status;
    }

    if (autoRenew) {
      subscription.autoRenew = autoRenew;
    }

    if (plan) {
      subscription.plan = plan;
    }

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id, status: "active" });

    if (!subscription) {
      const error = new Error("This user has no subscription");
      error.statusCode = 409;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Subscription found",
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    await Subscription.deleteOne({ userId: req.user._id, status: "active" });

    res.status(200).json({
      success: true,
      message: "Deleted Subscription successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();

    res.status(200).json({
      success: true,
      message: "Got all subscriptions",
      subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
