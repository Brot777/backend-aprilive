import { v4 as uuidv4 } from "uuid";
import {
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import { folders } from "../consts/s3Folders";
import { imageVerificationModel } from "../models/imageVerification";



export const uploadVerificationDocumentsToS3 = async (files: Express.Multer.File[],userId:string) => {
  if (files.length == 0) {
     return {
        response: { error: "Verification documents are required" },
        status: 400,
      };
  }

   if (userId==null) {//null o undefined
    return {
      response: { error: "404 user not found" },
      status: 404,
    }
  }

  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;

  const names: string[] = [];
  const promisesSendToS3 = files.map((file: Express.Multer.File) => {
    const name = `${uuidv4()}-${file.originalname}`; // create name
    names.push(name);
    const params = {
      Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
      Key: `${folders.verification}/${userId}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
      Body: file.buffer,
      contentType: file.mimetype, // The content of the object. For example, 'Hello world!".
    };

    return s3Client.send(new PutObjectCommand(params));
  });
  const results = await Promise.all(promisesSendToS3);
  results.forEach((result) => {
    if (!(result.$metadata.httpStatusCode === 200)) {
      return {
        response: { error: "Error uploading files" },
        status: 400,
      };
    }
  });

  const imagesSaved = await imageVerificationModel.insertMany(
    names.map((name: string) => {
      return {
        url: `${process.env.PREFIX_URI_UPLOADS_S3}/${folders.verification}/${userId}/${name}`,
        name,
        Key: `${folders.verification}/${userId}/${name}`,
      };
    }),
  );

  return {
    response: imagesSaved.map((imageSaved) => imageSaved._id),
    status: 200,
  };
};


