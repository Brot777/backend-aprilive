import { uploadPhotoToS3 } from "./../utils/upload.s3.js";

export const uploadPhoto = (req, res) => {
  console.log(req.files);
  console.log(uploadPhotoToS3);
  console.log(req.files["photo"]);
  res.status(200).json(req.files);
};
