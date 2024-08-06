import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import cvModel from "../models/cv";
import personAccountModel from "../models/personAccount";
import { folders } from "../consts/s3Folders";

export const uploadCvToS3 = async (
  file: Express.Multer.File | undefined,
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

  const name = `${uuidv4()}-${file.originalname}`; // create name
  const params = {
    Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
    Key: `${folders.cv}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
    Body: file.buffer,
    contentType: file.mimetype, // The content of the object. For example, 'Hello world!".
  };

  const results = await s3Client.send(new PutObjectCommand(params));
  if (!(results.$metadata.httpStatusCode === 200)) {
    return {
      response: { error: "Error uploading file" },
      status: 400,
    };
  }

  const cvSaved = await cvModel.create({
    url: `${process.env.PREFIX_URI_UPLOADS_S3}/${params.Key}`,
    name,
    userId,
  });

  await personAccountModel.findOneAndUpdate(
    {
      userId,
    },
    {
      cv: cvSaved?._id,
    }
  );

  return {
    response: cvSaved,
    status: 200,
  };
};
