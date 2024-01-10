import crypto from "crypto";
import multer from "multer";

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/photos/");
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomUUID() + "." + file.mimetype.split("/")[1]);
  },
});
export const upload = multer({
  storage: storage,
});
