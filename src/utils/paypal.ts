import axios from "axios";
import {
  PAYPAL_API,
  PAYPAL_API_CLIENT_ID,
  PAYPAL_API_SECRET_KEY,
} from "../config/paypal";

export const getPayPalToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  const {
    data: { access_token },
  } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
    auth: {
      username: PAYPAL_API_CLIENT_ID,
      password: PAYPAL_API_SECRET_KEY,
    },
  });
  return access_token;
};
