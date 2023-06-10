const multer = require("multer");
const path = require("path");

const Storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const allFilesFormats = [".jpeg", ".png", ".jpg"];
  const check = allFilesFormats.includes(
    path.extname(file.originalname).toLocaleLowerCase()
  );

  if (!check) {
    cb(new Error("Uploads only image files are allowed"));
  } else {
    cb(null, true);
  }
};
const Upload = multer({ storage: Storage, fileFilter });

module.exports = { Upload };
