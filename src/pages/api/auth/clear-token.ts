import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const cookies = new Cookies(req, res);

    // Clear the token cookie by setting it to expire immediately
    cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: '/',
    });

    res.status(200).json({ message: 'Token cleared successfully' });
  } catch (error) {
    console.error('Error clearing token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 