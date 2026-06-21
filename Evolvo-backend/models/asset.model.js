import  mongoose  from "mongoose";

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Asset Name ist required"],
  },
  count: {
    type: Number,
    default: 0,
  },
});
const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
