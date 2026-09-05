import Subscription from "../../models/subscription.model.js";
import PRODUCTS from "../../config/products.js";

const getProductById = (productId) => {
  return Object.values(PRODUCTS).find(
    (product) => product.id === productId
  );
};

export const getActiveSubscription = async (userId) => {
  return Subscription.findOne({
    userId,

    status: {
      $in: [
        "active",
        "cancelled",
        "grace_period",
        "billing_retry",
      ],
    },

    expiresAt: {
      $gt: new Date(),
    },
  }).sort({ expiresAt: -1 });
};

export const hasPremiumAccess = async (userId) => {
  const subscription = await getActiveSubscription(userId);

  return Boolean(subscription);
};

export const upsertSubscription = async ({
  userId,
  provider,
  productId,
  status,
  startedAt,
  expiresAt,
  autoRenew,
  providerSubscriptionId = null,
  providerTransactionId = null,
  providerOriginalTransactionId = null,
  providerPurchaseToken = null,
  environment = null,
  providerSignedDate = null,
  rawProviderData = null,
}) => {
  const product = getProductById(productId);

  if (!product) {
    throw new Error("Unsupported subscription product");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!expiresAt) {
    throw new Error("Subscription expiration date is required");
  }

  const filter = {
    provider,
  };

  if (provider === "apple" && providerOriginalTransactionId) {
    filter.providerOriginalTransactionId =
      providerOriginalTransactionId;
  } else if (provider === "google" && providerPurchaseToken) {
    filter.providerPurchaseToken =
      providerPurchaseToken;
  } else if (provider === "stripe" && providerSubscriptionId) {
    filter.providerSubscriptionId =
      providerSubscriptionId;
  } else {
    throw new Error(
      "Missing provider subscription identifier"
    );
  }

  // Prevent a provider subscription from being
  // assigned to another Evolvo account.
  const existingSubscription =
    await Subscription.findOne(filter);

  if (
    existingSubscription &&
    existingSubscription.userId.toString() !==
      userId.toString()
  ) {
    throw new Error(
      "Subscription belongs to another user",
    );
  }

  return Subscription.findOneAndUpdate(
    filter,
    {
      $set: {
        userId,
        provider,
        productId,
        status,
        startedAt,
        expiresAt,
        autoRenew,
        providerSubscriptionId,
        providerTransactionId,
        providerOriginalTransactionId,
        providerPurchaseToken,
        lastVerifiedAt: new Date(),
        providerSignedDate,
        environment,
        rawProviderData,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );
};


export const cancelSubscription = async (
  subscriptionId,
  userId,
) => {
  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    userId,
    provider: { $ne: "apple" },
  });

  if (!subscription) {
    throw new Error(
      "Apple subscriptions must be cancelled through Apple",
    );
  }

  subscription.autoRenew = false;
  subscription.status = "cancelled";
  subscription.cancelledAt = new Date();

  await subscription.save();

  return subscription;
};


export default {
  getActiveSubscription,
  hasPremiumAccess,
  upsertSubscription,
  cancelSubscription,
};