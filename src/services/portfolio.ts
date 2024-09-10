import { v4 as uuidv4 } from "uuid";
import {
  DeleteObjectsCommand,
  ObjectIdentifier,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Client";
import likePortfolioModel from "../models/likePortfolio";
import followerModel from "../models/follower";
import imagePortfolioModel from "../models/imagePortfolio";
import { LikePortfolio } from "../interfaces/likePortfolio";
import { User } from "../interfaces/user.interface";
import { Portfolio } from "../interfaces/portfolio";
import { folders } from "../consts/s3Folders";
import { ImagePortfolio } from "../interfaces/imagePortfolio";

export const addPropertiesWhenGetPortfoliosPersonalized = async (
  portfolios: Portfolio[] | any,
  userId: string
) => {
  if (!portfolios?.length) return [];
  const promisesLikes = portfolios.map(
    (portfolio: Portfolio, index: number) => {
      return likePortfolioModel.find({ portfolioId: portfolio._id });
    }
  );

  const likes = await Promise.all(promisesLikes);

  const promisesFollowing = portfolios.map(
    (portfolio: Portfolio, index: number) => {
      if (typeof portfolio.authorId === "object") {
        // Verificamos si authorId es un objeto
        const authorId = portfolio.authorId as User;
        // Usamos 'as' para decirle a TypeScript que estamos seguros de que authorId es un objeto con una propiedad 'userId'
        return followerModel.findOne({
          userId: authorId?._id,
          followerId: userId,
        });
      }
    }
  );

  const followings = await Promise.all(promisesFollowing);

  return portfolios.map((portfolio: Portfolio, index: number) => {
    portfolio.numLikes = likes[index].length;
    const isLike = likes[index].find(
      (likePortfolio: LikePortfolio, index: number) =>
        likePortfolio.userId == userId
    );
    portfolio.isLike = Boolean(isLike);
    portfolio.following = Boolean(followings[index]);

    return portfolio;
  });
};
export const addPropertiesWhenGetPortfolios = async (
  portfolios: Portfolio[] | any
) => {
  if (!portfolios?.length) return [];
  const promisesCountLikes = portfolios.map(
    (portfolio: Portfolio, index: number) => {
      return likePortfolioModel.count({ portfolioId: portfolio._id });
    }
  );

  const countLikes = await Promise.all(promisesCountLikes);

  return portfolios.map((portfolio: Portfolio, index: number) => {
    portfolio.numLikes = countLikes[index];
    return portfolio;
  });
};
export const uploadImagesPortfolioToS3 = async (
  files: Express.Multer.File[]
) => {
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
      Key: `${folders.imagesOfPortfolio}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
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

  const imagesSaved = await imagePortfolioModel.insertMany(
    names.map((name: string) => {
      return {
        url: `${process.env.PREFIX_URI_UPLOADS_S3}/${folders.imagesOfPortfolio}/${name}`,
        name,
        key: `${folders.imagesOfPortfolio}/${name}`,
      };
    })
  );

  return {
    response: imagesSaved.map((imageSaved) => imageSaved._id),
    status: 200,
  };
};
export const updateImagesPortfolio = async (
  files: Express.Multer.File[],
  portfolio: Portfolio
) => {
  // Get Old Images
  const oldImages = portfolio.images as ImagePortfolio[];
  if (files.length == 0) {
    return {
      response: oldImages,
      status: 200,
    };
  }

  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;
  const Objects: ObjectIdentifier[] = oldImages.map(
    (oldImage: ImagePortfolio) => {
      return { Key: `${folders.imagesOfPortfolio}/${oldImage.name}` };
    }
  );
  console.log(Objects);

  const params = {
    Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
    Delete: {
      Objects,
    },
  };
  const deleted = await s3Client.send(new DeleteObjectsCommand(params));

  if (!(deleted.$metadata.httpStatusCode === 200)) {
    return {
      response: { error: "Error updating files" },
      status: 400,
    };
  }
  const promisesImagesDeleted = oldImages.map((oldImage: ImagePortfolio) =>
    imagePortfolioModel.findByIdAndDelete(oldImage._id)
  );
  await Promise.all(promisesImagesDeleted);

  const names: string[] = [];
  const promisesSendToS3 = files.map((file: Express.Multer.File) => {
    const name = `${uuidv4()}-${file.originalname}`; // create name
    names.push(name);
    const params = {
      Bucket: BUKET, // The name of the bucket. For example, 'sample-bucket-101'.
      Key: `${folders.imagesOfPortfolio}/${name}`, // The name of the object. For example, 'sample_upload.txt'.
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

  const imagesSaved = await imagePortfolioModel.insertMany(
    names.map((name: string) => {
      return {
        url: `${process.env.PREFIX_URI_UPLOADS_S3}/${folders.imagesOfPortfolio}/${name}`,
        name,
        key: `${folders.imagesOfPortfolio}/${name}`,
      };
    })
  );

  return {
    response: imagesSaved.map((imageSaved) => imageSaved._id),
    status: 200,
  };
};
export const deleteImagesPortfolio = async (portfolio: Portfolio) => {
  // Get Old Images
  const oldImages = portfolio.images as ImagePortfolio[];

  if (oldImages.length == 0) {
    return {
      response: { message: "succes deliting files" },
      status: 200,
    };
  }

  // Set the parameters
  const BUKET = process.env.AWS_BUCKET_NAME;
  const Objects: ObjectIdentifier[] = oldImages.map(
    (oldImage: ImagePortfolio) => {
      return { Key: oldImage.key };
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
  const promisesImagesDeleted = oldImages.map((oldImage: ImagePortfolio) =>
    imagePortfolioModel.findByIdAndDelete(oldImage._id)
  );
  await Promise.all(promisesImagesDeleted);

  return {
    response: { message: "succes deliting files" },
    status: 200,
  };
};
