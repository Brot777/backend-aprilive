import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import presentationVideoModel from "../models/presentationVideo";
import userModel from "../models/user";

export const uploadVideoS3 = async (
  file: Express.Multer.File | undefined,
  destinationFolder: string,
  userId: string
) => {
  if (!file) {
    return {
      response: { error: "No file provided" },
      status: 400,
    };
  }
  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;
  const params = {
    Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
    Key: `${destinationFolder}/${uuidv4()}-${file.originalname}`, // The name of the object. For example, 'sample_upload.txt'.
    Body: file.buffer, // The content of the object. For example, 'Hello world!".
  };

  const results = await s3Client.send(new PutObjectCommand(params));
  if (!(results.$metadata.httpStatusCode === 200)) {
    return {
      response: { error: "Error uploading file" },
      status: 400,
    };
  }

  const presentationVideoSaved = await presentationVideoModel.create({
    url: `${process.env.PREFIX_URI_UPLOADS_S3}/${params.Key}`,
  });

  await userModel.findByIdAndUpdate(
    userId,
    { videoUrl: presentationVideoSaved._id },
    {
      new: true,
    }
  );

  return {
    response: presentationVideoSaved,
    status: 200,
  }; // For unit tests.
};
