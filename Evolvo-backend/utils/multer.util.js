import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + extension);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["audio/mp3", "audio/wav", "audio/ogg"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error(
        "Invalid file type. Only MP3, WAV, and OGG are allowed.",
      );
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

export default upload;
