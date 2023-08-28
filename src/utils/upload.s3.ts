import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import fileUpload from "express-fileupload";

export const uploadPhotoToS3 = async (file: fileUpload.UploadedFile) => {
  // Charge File
  const stream = fs.createReadStream(file.tempFilePath);

  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;
  const params = {
    Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
    Key: file.name, // The name of the object. For example, 'sample_upload.txt'.
    Body: stream, // The content of the object. For example, 'Hello world!".
  };
  try {
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return results; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
