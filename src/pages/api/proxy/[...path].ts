import { NextApiRequest, NextApiResponse } from "next";
import { createProxyServer } from "http-proxy";
import Cookies from "cookies";

const proxy = createProxyServer();

const BACKEND_URL = process.env.BACKEND_URL;

// eslint-disable-next-line import/no-anonymous-default-export
export default (
  clientReq: NextApiRequest,
  clientRes: NextApiResponse
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const cookies = new Cookies(clientReq, clientRes);
    const token = cookies.get("token");

    // Rewrite URL, strip out leading '/api'
    // '/api/proxy/*' becomes 'http://127.0.0.1:8000/api*'
    clientReq.url = `${BACKEND_URL}/api${clientReq.url!.replace(
      /^\/api\/proxy/,
      ""
    )}`;

    // Don't forward cookies to API
    clientReq.headers.cookie = "";

    // Set auth-token header from cookie
    if (token) clientReq.headers.authorization = `Bearer ${token}`;

    proxy.once("error", reject).web(
      clientReq,
      clientRes,
      {
        target: BACKEND_URL,
        secure: true,
        selfHandleResponse: false,
        changeOrigin: true,
      },
      reject
    );
    proxy.on("error", () => reject());
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
