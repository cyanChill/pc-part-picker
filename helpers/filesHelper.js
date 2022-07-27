const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
// Multer Logic
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/data/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.${file.mimetype.split("/")[1]}`);
  },
});

exports.upload = multer({ storage: storage });

/* Checks to see if uploaded file is an image */
exports.isImg = (fileObj) => {
  return /image\/.*/.test(fileObj.mimetype);
};

/* Checks whether the img size is <= the specified value */
exports.fileSizeIsLEQ = (fileObj, sizeMB) => {
  return fileObj.size <= sizeMB * 1000000;
};

/* To remove a file uploaded by multer */
exports.deleteFileByPath = async (filePath) => {
  try {
    const didDelete = await fs.unlink(filePath);
    if (didDelete) throw new Error("Failed to delete file.");
  } catch (err) {
    throw new Error("Failed to delete file.");
  }
};
