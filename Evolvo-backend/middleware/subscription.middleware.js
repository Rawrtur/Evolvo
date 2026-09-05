import { getActiveSubscription } from "../services/subscription/subscription.service.js";

const requireSubscription = async (req, res, next) => {
  try {
    const subscription = await getActiveSubscription(req.user._id);

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "Active Subscription required",
      });
    }

    req.subscription = subscription;

    next();
  } catch (error) {
    next(error)
  }
};

export default requireSubscription;
