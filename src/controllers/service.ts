import serviceModel from "../models/service";
import mongoose, { LeanDocument, Schema } from "mongoose";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";
import likeServiceModel from "../models/likeService";
import commentServiceModel from "../models/commentService";
import {
  addDistancesToServices,
  deleteImagesService,
  updateImagesService,
  uploadImagesServiceToS3,
} from "../services/service";
import { Service } from "../interfaces/service";

export const createService = async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const { response, status } = await uploadImagesServiceToS3(files);
    if (status !== 200) return res.status(status).json(response);
    const { lng, lat, ...restService } = req.body;
    const service = restService;
    service.location = { type: "Point", coordinates: [lng, lat] };
    service.images = response;
    const serviceSaved = await serviceModel.create(service);
    res.status(201).json(serviceSaved);
  } catch (error) {
    handleHttp(res, "Error_Create_Service", error);
  }
};

/* export const getPersonalizedServices = async (req: Request, res: Response) => {
  const userId = req.userId;
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);

  try {
    const services = await serviceModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "authorId",
        select: "photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "authorId",
        select: "name isCompany accountType",
        populate: {
          path: "accountType",
          select: "role",
          populate: {
            path: "role",
            select: "name",
          },
        },
      })
      .populate({
        path: "images",
        select: "url", // Especifica el campo que deseas recuperar
      });

    const newServices = await addPropertiesWhenGetServicesPersonalized(
      services,
      userId
    ); //user with autentication
    let totalDocs = await serviceModel.count(); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: newServices,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Services", error);
  }
}; */

export const getServices = async (req: Request, res: Response) => {
  /* paginate */
  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);

  /* location */
  const lat =
    Number(req.query.lat) || Number(req?.geo?.ll?.[0] || 0) || 14.6349;
  const lng =
    Number(req.query.lng) || Number(req?.geo?.ll?.[1] || 0) || -90.5069;

  /* filters */
  let query = {};
  if (lat && lng) {
    query = {
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 100000, // opcional: filtrar hasta 100km
        },
      },
    };
  }

  try {
    const services = await serviceModel
      .find(query)
      .select(
        "categories authorId images price money title description deliberyTime quantity averageRating numReviews location",
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("categories")
      .populate({
        path: "authorId",
        select: "_id name photoUrl isCompany",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "images",
        select: "url", // Especifica el campo que deseas recuperar
      })
      .sort({ averageRating: -1 })
      .lean();

    const servicesWithDistance = addDistancesToServices(services, lat, lng);
    let totalDocs = await serviceModel.count(query); //Possible performance improvement: cache the value
    let totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: servicesWithDistance,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Get_Service", error);
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.serviceId)) {
      return res.status(400).json({ error: "invalid service id" });
    }
    const service = await serviceModel
      .findById(req.params.serviceId)
      .populate("categories")
      .populate({
        path: "authorId",
        select: "_id name photoUrl accountType",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "images",
        select: "url", // Especifica el campo que deseas recuperar
      });

    if (!service) {
      return res.status(404).json({ error: "404 service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    handleHttp(res, "Error_Get_Service", error);
  }
};

export const updateServiceById = async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const serviceId = req.params.serviceId;
  let { deletedImages, averageRating, numReviews, ...newService } = req.body;
  deletedImages = (deletedImages as Schema.Types.ObjectId[]) || [];

  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId))
      return res.status(400).json({ error: "invalid service id" });

    const service = await serviceModel.findById(serviceId).populate("images");

    if (!service)
      return res.status(404).json({ error: "404 service not found" });

    const { response, status } = await updateImagesService(
      files,
      service,
      deletedImages,
    );
    if (status !== 200) return res.status(status).json(response);
    newService.images = response;

    const serviceUpdated = await serviceModel.findByIdAndUpdate(
      serviceId,
      newService,
      { new: true },
    );

    res.status(200).json(serviceUpdated);
  } catch (error) {
    handleHttp(res, "Error_Update_Service", error);
  }
};

export const deleteServiceById = async (req: Request, res: Response) => {
  const serviceId = req.params.serviceId;
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: "invalid service id" });
    }
    const service = await serviceModel.findById(serviceId).populate("images");
    if (!service) {
      return res.status(404).json({ error: "404 service not found" });
    }

    const { response, status } = await deleteImagesService(service);
    if (status !== 200) return res.status(status).json(response);

    const serviceDeleted = await serviceModel.findByIdAndDelete(serviceId);
    await commentServiceModel.deleteMany({ serviceId });
    await likeServiceModel.deleteMany({ serviceId });

    res.status(204).json(serviceDeleted);
  } catch (error) {
    handleHttp(res, "Error_Delete_Service", error);
  }
};

export const likeService = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.serviceId;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: "invalid service id" });
    }
    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "404 service not found" });
    }

    const isLikeService = await likeServiceModel.findOne({
      userId,
      serviceId,
    }); // return document likeService or null

    if (isLikeService) {
      await likeServiceModel.findByIdAndDelete(isLikeService._id);
    } else {
      await likeServiceModel.create({ userId, serviceId });
    }
    res.status(201).json({ like: Boolean(!isLikeService) });
  } catch (error) {
    handleHttp(res, "Error_Like_Service", error);
  }
};

export const getServicesByAuthorId = async (req: Request, res: Response) => {
  const authorId = req.params.authorId;

  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ error: "invalid author id" });
  }

  const limit = 10;
  const queryPage = req.query.page ? `${req.query.page}` : "1";
  let page = Number(queryPage);
  try {
    const services = await serviceModel
      .find({ authorId })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("categories authorId images price money title description")
      .populate("categories")
      .populate({
        path: "authorId",
        select: "_id name photoUrl",
        populate: {
          path: "photoUrl",
          select: "url",
        },
      })
      .populate({
        path: "images",
        select: "url", // Especifica el campo que deseas recuperar
      });

    const totalDocs = await serviceModel.count({ authorId }); //Possible performance improvement: cache the value
    const totalPages = Math.ceil(totalDocs / limit); //Possible performance improvement: cache the value

    return res.status(200).json({
      docs: services,
      currentPage: page,
      limit,
      totalDocs,
      totalPages,
    });
  } catch (error) {
    handleHttp(res, "Error_Services_By_Author", error);
  }
};
