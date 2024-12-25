import { v4 as uuidv4 } from "uuid";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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
  const cvExist = await cvModel.findOne({ userId });
  if (cvExist) {
    return {
      response: { error: "You already have a CV created" },
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
export const updateCvInS3 = async (
  file: Express.Multer.File | undefined,
  userId: string
) => {
  if (!file) {
    return {
      response: { error: "No file provided" },
      status: 400,
    };
  }

  const oldcv = await cvModel.findOne({ userId }).lean();
  const oldcvName = oldcv?.name;
  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;

  const bucketParams = { Bucket: BUKET, Key: `${folders.cv}/${oldcvName}` };

  const deleted = await s3Client.send(new DeleteObjectCommand(bucketParams));
  console.log(deleted);

  if (!(deleted.$metadata.httpStatusCode === 204)) {
    return {
      response: { error: "Error updating cv" },
      status: 400,
    };
  }
  await cvModel.findByIdAndDelete(oldcv?._id);
  console.log(cvModel, userId);

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
