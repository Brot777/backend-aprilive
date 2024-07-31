import { v4 as uuidv4 } from "uuid";
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import likeServiceModel from "../models/likeService";
import followerModel from "../models/follower";
import serviceModel from "../models/service";
import imageServiceModel from "../models/imageService";
import { LikeService } from "../interfaces/likeService";
import { User } from "../interfaces/user.interface";
import { Service } from "../interfaces/service";
import { ImageService } from "../interfaces/imageService";
import { Schema } from "mongoose";

export const addPropertiesWhenGetServicesPersonalized = async (
  services: Service[] | any,
  userId: string
) => {
  if (!services?.length) return [];
  const promisesLikes = services.map((service: Service, index: number) => {
    return likeServiceModel.find({ serviceId: service._id });
  });

  const likes = await Promise.all(promisesLikes);

  const promisesFollowing = services.map((service: Service, index: number) => {
    if (typeof service.authorId === "object") {
      // Verificamos si authorId es un objeto
      const authorId = service.authorId as User;
      // Usamos 'as' para decirle a TypeScript que estamos seguros de que authorId es un objeto con una propiedad 'userId'
      return followerModel.findOne({
        userId: authorId?._id,
        followerId: userId,
      });
    }
  });

  const followings = await Promise.all(promisesFollowing);

  return services.map((service: Service, index: number) => {
    service.numLikes = likes[index].length;
    const isLike = likes[index].find(
      (likeService: LikeService, index: number) => likeService.userId == userId
    );
    service.isLike = Boolean(isLike);
    service.following = Boolean(followings[index]);

    return service;
  });
};
export const addPropertiesWhenGetServices = async (
  services: Service[] | any
) => {
  if (!services?.length) return [];
  const promisesCountLikes = services.map((service: Service, index: number) => {
    return likeServiceModel.count({ serviceId: service._id });
  });

  const countLikes = await Promise.all(promisesCountLikes);

  return services.map((service: Service, index: number) => {
    service.numLikes = countLikes[index];
    return service;
  });
};

export const uploadImagesServiceToS3 = async (
  files: Express.Multer.File[],
  destinationFolder: string
) => {
  if (!files) {
    return {
      response: { error: "No files provided" },
      status: 400,
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
      Key: `${destinationFolder}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
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

  const imagesSaved = await imageServiceModel.insertMany(
    names.map((name: string) => {
      return {
        url: `${process.env.PREFIX_URI_UPLOADS_S3}/${destinationFolder}/${name}`,
        name,
      };
    })
  );

  return {
    response: imagesSaved.map((imageSaved) => imageSaved._id),
    status: 200,
  };
};

export const updateImagesService = async (
  files: Express.Multer.File[],
  destinationFolder: string,
  service: Service
) => {
  // Get Old Images
  const oldImages = service.images as ImageService[];
  oldImages.map((image: ImageService) => {
    console.log(image);
  });
  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;

  const names: string[] = [];
  const promisesSendToS3 = files.map((file: Express.Multer.File) => {
    const name = `${uuidv4()}-${file.originalname}`; // create name
    names.push(name);
    const params = {
      Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
      Key: `${destinationFolder}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
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

  const imagesSaved = await imageServiceModel.insertMany(
    names.map((name: string) => {
      return {
        url: `${process.env.PREFIX_URI_UPLOADS_S3}/${destinationFolder}/${name}`,
        name,
      };
    })
  );

  return {
    response: imagesSaved.map((imageSaved) => imageSaved._id),
    status: 200,
  };
};
