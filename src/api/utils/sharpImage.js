const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const sharpImage = async (file, uploadsDir) => {
  const originalFilePath = file.path;
  const resizedImageDir = path.join(uploadsDir, "resized");

  if (!fs.existsSync(resizedImageDir)) {
    fs.mkdirSync(resizedImageDir, { recursive: true });
  }

  const resizedImagePath = path.join(
    resizedImageDir,
    `resized-${file.filename.replace(/\.[^/.]+$/, "")}.webp`
  );

  await sharp(originalFilePath)
    .resize({ width: 615, height: 350 })
    .toFormat("webp")
    .toFile(resizedImagePath);

  console.log(`Image successfully resized to: ${resizedImagePath}`);

  fs.unlink(originalFilePath, (err) => {
    if (err) {
      console.error(
        ` Error deleting the original file: ${originalFilePath}`,
        err
      );
    } else {
      console.log(`Original file deleted: ${originalFilePath}`);
    }
  });

  file.path = resizedImagePath;
  file.filename = path.basename(resizedImagePath);

  return file;
};

module.exports = {
  sharpImage,
};
