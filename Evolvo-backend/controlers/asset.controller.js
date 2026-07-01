import mongoose from "mongoose";
import Asset from "../models/asset.model.js";

export const getAssetCount = async (req, res, next) => {
  try {

    const asset = await Asset.findOne({ name: req.params.name });

    if (!asset) {
      const error = new Error("Asset Not Found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

export const increaseAssetCount = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {name} = req.body;
    const asset = await Asset.findOne({ name });

    if (!asset) {
      const newAsset = await Asset.create(
        [
          {
            name,
            count: 0,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        message: "Asset Monitor created successfully",
      });
    }

    asset.count += 1;
    await asset.save();

    res.status(200).json({
      success: true,
      message: "Asset Monitor increased successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find();
    res.status(200).json({
      success: true,
      data: assets,
    });
  } catch (error) {
    next(error);
  }
}