import crypto from "crypto";
import multer from "multer";

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos/");
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomUUID());
  },
});
export const upload = multer({
  storage: storage,
});
