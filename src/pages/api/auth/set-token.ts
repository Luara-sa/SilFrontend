import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { JwtUtils } from "utils/jwtUtils";

interface RequestBody {
  token: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token }: RequestBody = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Validate token format and expiration
    if (!JwtUtils.isValidTokenFormat(token)) {
      return res.status(400).json({ message: 'Invalid token format' });
    }

    if (JwtUtils.isTokenExpired(token)) {
      return res.status(400).json({ message: 'Token is expired' });
    }

    const cookies = new Cookies(req, res);

    // Set httpOnly cookie with security options
    cookies.set("token", token, {
      httpOnly: true, // Not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: "lax", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      path: '/', // Available for all routes
    });

    res.status(200).json({ message: 'Token stored successfully' });
  } catch (error) {
    console.error('Error setting token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 