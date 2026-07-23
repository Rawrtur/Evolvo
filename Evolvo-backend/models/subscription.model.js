import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "trialing", "past_due"],
      default: "active",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    plan: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      default: "weekly",
    },
    provider: {
      type: String,
      enum: ["stripe", "apple", "google"],
      required: [true, "Provider is required"],
    },
    providerCustomerId: {
      type: String,
      required: [true, "Provider Customer Id is required"],
    },
    providerSubscriptionId: {
      type: String,
      required: [true, "Provider Subscription Id is required"],
    },
  },
  { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
