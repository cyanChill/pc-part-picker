const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");
// Libraries to help img conversion to .webp
const ffmpeg = require("fluent-ffmpeg");
const { Readable } = require("stream");
// Multer Logic
const multer = require("multer");

// Save file data into buffer instead of creating it (for efficiency)
exports.upload = multer({ storage: multer.memoryStorage() });

/* Checks to see if uploaded file is an image */
exports.isImg = (fileObj) => {
  return /image\/.*/.test(fileObj.mimetype);
};

/* Checks whether the img size is <= the specified value */
exports.fileSizeIsLEQ = (fileObj, sizeMB) => {
  return fileObj.size <= sizeMB * 1000000;
};

/* Quick Validation Handler For Our Use */
exports.validateImg = (fileObj, errArr) => {
  if (!fileObj) {
    errArr.push({ msg: "User must submit an image." });
  } else {
    if (!this.isImg(fileObj)) {
      errArr.push({ msg: "Uploaded file is not an image." });
    }
    if (!this.fileSizeIsLEQ(fileObj, 0.5)) {
      errArr.push({ msg: "Uploaded file is not <= 500KB in size." });
    }
  }
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

/* Logic for converting images to webp */
const convertImage = (img, outputName) => {
  // Takes a stream input and convert it to the file specified in "outputName"
  ffmpeg().input(img).saveToFile(outputName);
};

// Converts buffer to ReadableStream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Expect input such as "req.file.buffer"
exports.convertImgToWEBP = (fileBuffer) => {
  // Where we want to save the file
  const imgPath = `public\\data\\uploads\\${uuidv4()}.webp`;
  const stream = bufferToStream(fileBuffer);
  convertImage(stream, `.\\${imgPath}`);

  return imgPath;
};
