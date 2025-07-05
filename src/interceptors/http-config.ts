import axios from "axios";
import { BASE_URL } from "env";

export const _axios = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    // Authorization: `Bearer ${BASE_URL_TOKEN_KEY}`,
  },
});
