import { v4 as uuidv4 } from "uuid";
import {
  DeleteObjectsCommand,
  ObjectIdentifier,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import likeServiceModel from "../models/likeService";
import followerModel from "../models/follower";
import imageServiceModel from "../models/imageService";
import { LikeService } from "../interfaces/likeService";
import { User } from "../interfaces/user.interface";
import { Service } from "../interfaces/service";
import { ImageService } from "../interfaces/imageService";
import { folders } from "../consts/s3Folders";
import reviewModel from "../models/review";

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

export const addRatingWhenGetServices = async (services: Service[] | any) => {
  if (!services?.length) return [];

  const promiseAverageRatings = services.map(
    (service: Service, index: number) => {
      return reviewModel.aggregate([
        { $match: { serviceId: service._id } },
        {
          $group: {
            _id: "$serviceId",
            averageRating: { $avg: "$value" },
          },
        },
      ]);
    }
  );

  const averages = await Promise.all(promiseAverageRatings);

  return services.map((service: Service, index: number) => {
    service.averageRating = averages.flat()[index]
      ? averages.flat()[index].averageRating
      : 0;
    return service;
  });
};

export const uploadImagesServiceToS3 = async (files: Express.Multer.File[]) => {
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
      Key: `${folders.imagesOfService}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
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
        url: `${process.env.PREFIX_URI_UPLOADS_S3}/${folders.imagesOfService}/${name}`,
        name,
        Key: `${folders.imagesOfService}/${name}`,
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
  service: Service,
  deletedImages: string[]
) => {
  // Get Old Images
  const oldImages = service.images as ImageService[];
  //LOOKING DELETED IMAGES
  const Keys: ObjectIdentifier[] = await imageServiceModel
    .find({
      _id: { $in: deletedImages },
    })
    .select("Key -_id")
    .lean();

  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;

  if (!(Keys.length == 0)) {
    const params = {
      Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
      Delete: {
        Objects: Keys,
      },
    };
    const deleted = await s3Client.send(new DeleteObjectsCommand(params));

    if (!(deleted.$metadata.httpStatusCode === 200)) {
      return {
        response: { error: "Error updating files" },
        status: 400,
      };
    }

    await imageServiceModel.deleteMany({
      _id: { $in: deletedImages },
    });
  }

  const names: string[] = [];
  const promisesSendToS3 = files.map((file: Express.Multer.File) => {
    const name = `${uuidv4()}-${file.originalname}`; // create name
    names.push(name);
    const params = {
      Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
      Key: `${folders.imagesOfService}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
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
        url: `${process.env.PREFIX_URI_UPLOADS_S3}/${folders.imagesOfService}/${name}`,
        name,
        Key: `${folders.imagesOfService}/${name}`,
      };
    })
  );

  const filterImages = oldImages.filter(
    (oldImage: ImageService) => !deletedImages.includes(oldImage._id.toString())
  );
  filterImages.push(...imagesSaved);

  return {
    response: filterImages.map((filterImage) => filterImage._id),
    status: 200,
  };
};

export const deleteImagesService = async (service: Service) => {
  // Get Old Images
  const oldImages = service.images as ImageService[];

  if (oldImages.length == 0) {
    return {
      response: { message: "succes deliting files" },
      status: 200,
    };
  }

  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;
  const Objects: ObjectIdentifier[] = oldImages.map(
    (oldImage: ImageService) => {
      return { Key: oldImage.name };
    }
  );

  const params = {
    Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
    Delete: {
      Objects,
    },
  };
  const deleted = await s3Client.send(new DeleteObjectsCommand(params));

  if (!(deleted.$metadata.httpStatusCode === 200)) {
    return {
      response: { error: "Error deliting files" },
      status: 400,
    };
  }
  const promisesImagesDeleted = oldImages.map((oldImage: ImageService) =>
    imageServiceModel.findByIdAndDelete(oldImage._id)
  );
  await Promise.all(promisesImagesDeleted);

  return {
    response: { message: "succes deliting files" },
    status: 200,
  };
};
