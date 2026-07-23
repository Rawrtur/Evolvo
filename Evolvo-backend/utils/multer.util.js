import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + extension);
  },
});

const upload = multer({ storage });

export default upload;