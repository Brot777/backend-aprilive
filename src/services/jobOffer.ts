import { JobOffer } from "../interfaces/jobOffers";
import likeJobOfferModel from "../models/likeJobOffer";
import favoriteJobOfferModel from "../models/favoriteJobOffer";
import followerModel from "../models/follower";
import { LikeJobOffer } from "../interfaces/likeJobOffer";
import { User } from "../interfaces/user.interface";
import { FavoriteJobOffer } from "../interfaces/favoriteJobOffer";

export const convertTitleNormalize = (title: string): string => {
  // Replace accented characters
  let titleNormalize = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Convert to lowercase
  titleNormalize = titleNormalize.toLowerCase();
  // Delete especial characters
  titleNormalize = titleNormalize.replace(/[^\w\s]/gi, "");
  return titleNormalize;
};

/* export const addPropertiesWhenGetJobOffer = async (
  jobOffers: JobOffer[] | any,
  userId: string
) => {
  if (!jobOffers?.length) return [];
  const promises = jobOffers.map((jobOffer: JobOffer, index: number) => {
    return likeJobOfferModel.findOne({ userId, jobOfferId: jobOffer._id });
  });

  const isLikes = await Promise.all(promises);
  return jobOffers.map((jobOffer: JobOffer, index: number) => {
    jobOffer.isLike = Boolean(isLikes[index]);
    return jobOffer;
  });
}; */

export const addPropertiesWhenGetJobOffer = async (
  jobOffers: JobOffer[] | any,
  userId: string
) => {
  if (!jobOffers?.length) return [];
  const promisesLikes = jobOffers.map((jobOffer: JobOffer, index: number) => {
    return likeJobOfferModel.find({ jobOfferId: jobOffer._id });
  });

  const likes = await Promise.all(promisesLikes);

  const promisesFavorites = jobOffers.map(
    (jobOffer: JobOffer, index: number) => {
      return favoriteJobOfferModel.find({ jobOfferId: jobOffer._id });
    }
  );
  const favorites = await Promise.all(promisesFavorites);

  const promisesFollowing = jobOffers.map(
    (jobOffer: JobOffer, index: number) => {
      if (typeof jobOffer.authorId === "object") {
        // Verificamos si authorId es un objeto
        const authorId = jobOffer.authorId as User;
        // Usamos 'as' para decirle a TypeScript que estamos seguros de que authorId es un objeto con una propiedad 'userId'
        return followerModel.find({ userId: authorId._id, followerId: userId });
      }
    }
  );

  const followings = await Promise.all(promisesFollowing);

  return jobOffers.map((jobOffer: JobOffer, index: number) => {
    jobOffer.numLikes = likes[index].length;
    const isLike = likes[index].find(
      (likeJobOffer: LikeJobOffer, index: number) =>
        likeJobOffer.userId == userId
    );
    jobOffer.isLike = Boolean(isLike);

    const isFavorite = favorites[index].find(
      (favoriteJobOffer: FavoriteJobOffer, index: number) =>
        favoriteJobOffer.userId == userId
    );
    jobOffer.isFavorite = Boolean(isFavorite);

    return jobOffer;
  });
};
