import axios from "axios";
import { handleHttp } from "../utils/error.handle";
import { Request, Response } from "express";

export const getCountries = async (req: Request, res: Response) => {
  const userEmail = process.env.USER_EMAIL;
  const userToken = process.env.API_TOKEN;
  try {
    const { data } = await axios.get(
      "https://www.universal-tutorial.com/api/getaccesstoken",
      {
        headers: {
          Accept: "application/json",
          "api-token": userToken,
          "user-email": userEmail,
        },
      }
    );

    const response = await axios.get(
      "https://www.universal-tutorial.com/api/countries/",
      {
        headers: {
          Authorization: `Bearer ${data.auth_token}`,
          Accept: "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    handleHttp(res, "Error_Get_Countries", error);
  }
};

export const getStates = async (req: Request, res: Response) => {
  const userEmail = process.env.USER_EMAIL;
  const userToken = process.env.API_TOKEN;
  try {
    const { data } = await axios.get(
      "https://www.universal-tutorial.com/api/getaccesstoken",
      {
        headers: {
          Accept: "application/json",
          "api-token": userToken,
          "user-email": userEmail,
        },
      }
    );

    const response = await axios.get(
      `https://www.universal-tutorial.com/api/states/${req.params.countryName}`,
      {
        headers: {
          Authorization: `Bearer ${data.auth_token}`,
          Accept: "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    handleHttp(res, "Error_Get_Countries", error);
  }
};
export const getCities = async (req: Request, res: Response) => {
  const userEmail = process.env.USER_EMAIL;
  const userToken = process.env.API_TOKEN;
  try {
    const { data } = await axios.get(
      "https://www.universal-tutorial.com/api/getaccesstoken",
      {
        headers: {
          Accept: "application/json",
          "api-token": userToken,
          "user-email": userEmail,
        },
      }
    );

    const response = await axios.get(
      `https://www.universal-tutorial.com/api/cities/${req.params.stateName}`,
      {
        headers: {
          Authorization: `Bearer ${data.auth_token}`,
          Accept: "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    handleHttp(res, "Error_Get_Countries", error);
  }
};
