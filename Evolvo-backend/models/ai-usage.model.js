import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        feature: {
            type: String,
            enum: ["question-generation", "feynman-feedback"],
            required: [true, "Feature is required"],
        },
        requestId: {
            type: String,
            required: [true, "Request ID is required"],
        },
        inputTokens: {
            type: Number,
            required: [true, "Input tokens are required"],
        },
        outputTokens: {
            type: Number,
            required: [true, "Output tokens are required"],
        },
        totalTokens: {
            type: Number,
            required: [true, "Total tokens are required"],
        },
        processingTime: {
            type: Number,
            required: [true, "Processing time is required"],
        },
    },
    { timestamps: true
    }
)
const AIUsage = mongoose.model("AIUsage", aiUsageSchema);

export default AIUsage;