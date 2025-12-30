// backend/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filepath);
    fs.unlink(filepath, (err) => {
      if (err) console.log("Error deleting temp file:", err);
    });
    return uploadResult.secure_url;
  } catch (error) {
    fs.unlink(filepath, (err) => {
      if (err) console.log("Error deleting temp file:", err);
    });
    console.log(error);
    throw error;
  }
};

export default uploadOnCloudinary;
