// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import axios from "axios";
import { BASE_URL } from "env";

export default function handler(
  clientReq: NextApiRequest,
  clientRes: NextApiResponse
) {
  const cookies = new Cookies(clientReq, clientRes);

  axios
    .post(`${BASE_URL}/api/student/login`, clientReq.body)
    .then((res) => {
      cookies.set("token", res.data.result.access_token, {
        httpOnly: true,
        sameSite: "lax", // CSRF protection
      });
      clientRes.status(200).send(res.data);
    })
    .catch((err) => {
      clientRes
        .status(err.response?.status ?? 505)
        .send(err.response.data ?? { err: "proxy error" });
    });
}
