import { v4 as uuidv4 } from "uuid";
import {
  DeleteObjectsCommand,
  ObjectIdentifier,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import imageServiceModel from "../models/imageService";


import { folders } from "../consts/s3Folders";
import { imageIdentityModel } from "../models/imageIdentity";



export const uploadIdentityDocumentsToS3 = async (files: Express.Multer.File[]) => {
  if (files.length == 0) {
    return {
      response: [],
      status: 200,
    };
  }

  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;

  const names: string[] = [];
  const promisesSendToS3 = files.map((file: Express.Multer.File) => {
    const name = `${uuidv4()}-${file.originalname}`; // create name
    names.push(name);
    const params = {
      Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
      Key: `${folders.identity}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
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

  const imagesSaved = await imageIdentityModel.insertMany(
    names.map((name: string) => {
      return {
        url: `${process.env.PREFIX_URI_UPLOADS_S3}/${folders.imagesOfService}/${name}`,
        name,
        Key: `${folders.imagesOfService}/${name}`,
      };
    }),
  );

  return {
    response: imagesSaved.map((imageSaved) => imageSaved._id),
    status: 200,
  };
};


