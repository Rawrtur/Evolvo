import Subscription from "../models/subscription.model.js";

const requireSubscription = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res
        .status(401)
        .json({ message: "No Subscription for this user", success: false });
    }

    if (subscription.status !== "active") {
      return res.status(400).json({
        message: "Please renew your subscription",
        success: false,
      });
    }

    req.subscription = subscription;

    next();
  } catch (error) {
    res.status(401).json({
      message: "No Subscription for this user",
      error: error.message,
    });
  }
};

export default requireSubscription;
