import {
  verifyAndSavePurchase,
  processAppleNotification,
} from "../services/subscription/apple.service.js";


export const verifyApplePurchase = async (
  req,
  res,
  next,
) => {
  try {
    const {
      transactionId,
      environment = "production",
    } = req.body;


    if (
      typeof transactionId !== "string" ||
      !transactionId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Apple transaction ID is required",
      });
    }


    if (
      environment !== "production" &&
      environment !== "sandbox"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Apple environment",
      });
    }


    const subscription =
      await verifyAndSavePurchase({
        userId: req.user._id,

        transactionId:
          transactionId.trim(),

        environment,
      });


    return res.status(200).json({
      success: true,

      subscription: {
        id: subscription._id,
        provider:
          subscription.provider,
        productId:
          subscription.productId,
        status:
          subscription.status,
        startedAt:
          subscription.startedAt,
        expiresAt:
          subscription.expiresAt,
        autoRenew:
          subscription.autoRenew,
        environment:
          subscription.environment,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const appleWebhook = async (
  req,
  res,
  next,
) => {
  try {
    const { signedPayload } = req.body;


    if (
      typeof signedPayload !== "string" ||
      !signedPayload.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Apple signed payload is required",
      });
    }


    await processAppleNotification(
      signedPayload,
    );


    /*
     * Apple expects 200-206 for successful
     * processing.
     */
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    /*
     * Important:
     * returning 4xx/5xx tells Apple that the
     * notification failed and should be retried.
     */
    next(error);
  }
};