import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: ["apple", "google", "stripe"],
      required: true,
      index: true,
    },

    productId: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "grace_period",
        "billing_retry",
        "paused",
        "cancelled",
        "expired",
        "revoked",
      ],
      required: true,
      default: "active",
      index: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    autoRenew: {
      type: Boolean,
      required: true,
      default: false,
    },

    providerSubscriptionId: {
      type: String,
      default: null,
      trim: true,
    },

    providerTransactionId: {
      type: String,
      default: null,
      trim: true,
    },

    providerOriginalTransactionId: {
      type: String,
      default: null,
      trim: true,
    },

    providerPurchaseToken: {
      type: String,
      default: null,
      trim: true,
    },

    lastVerifiedAt: {
      type: Date,
      default: null,
    },

    providerSignedDate: {
      type: Date,
      default: null,
    },

    environment: {
      type: String,
      enum: ["sandbox", "production"],
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    rawProviderData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);


subscriptionSchema.index({
  userId: 1,
  status: 1,
  expiresAt: 1,
});


subscriptionSchema.index(
  {
    provider: 1,
    providerTransactionId: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);


subscriptionSchema.index(
  {
    provider: 1,
    providerOriginalTransactionId: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);


subscriptionSchema.index(
  {
    provider: 1,
    providerPurchaseToken: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);


const Subscription = mongoose.model(
  "Subscription",
  subscriptionSchema,
);

export default Subscription;