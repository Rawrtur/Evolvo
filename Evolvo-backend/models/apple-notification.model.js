import mongoose from "mongoose";


const appleNotificationSchema = new mongoose.Schema(
  {
    notificationUUID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    notificationType: {
      type: String,
      required: true,
    },

    subtype: {
      type: String,
      default: null,
    },

    environment: {
      type: String,
      enum: ["sandbox", "production"],
      required: true,
    },

    signedDate: {
      type: Date,
      required: true,
      index: true,
    },

    originalTransactionId: {
      type: String,
      default: null,
      index: true,
    },

    processed: {
      type: Boolean,
      default: false,
      index: true,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    processingError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);


const AppleNotification = mongoose.model(
  "AppleNotification",
  appleNotificationSchema,
);

export default AppleNotification;