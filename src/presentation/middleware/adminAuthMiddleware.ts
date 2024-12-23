import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedAdminJwt {
  adminId: string;
  iat: number;
  exp?: number;
}

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const adminAccessToken = req.cookies.adminAccessToken;
  const adminRefreshToken = req.cookies.adminRefreshToken;

  if (!adminAccessToken && !adminRefreshToken) {
    console.log('No admin tokens provided');
    return res.status(401).json({ message: 'No admin tokens provided' });
  }

  try {
    const decodedAccessToken = jwt.verify(
      adminAccessToken,
      process.env.JWT_ADMIN_ACCESS_SECRET as string
    ) as DecodedAdminJwt;

    req.adminId = decodedAccessToken.adminId;
    return next();
  } catch (accessTokenError) {
    // If access token is invalid or expired
    if (!adminRefreshToken) {
      return res
        .status(401)
        .json({ message: 'Admin access token expired and no refresh token provided' });
    }

    try {
      const decodedRefreshToken = jwt.verify(
        adminRefreshToken,
        process.env.JWT_ADMIN_REFRESH_SECRET as string
      ) as DecodedAdminJwt;

      const newAdminAccessToken = jwt.sign(
        { adminId: decodedRefreshToken.adminId },
        process.env.JWT_ADMIN_ACCESS_SECRET as string,
        { expiresIn: '15m' }
      );

      res.cookie('adminAccessToken', newAdminAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
      });

      req.adminId = decodedRefreshToken.adminId;
      return next();
    } catch (refreshTokenError) {
      res.clearCookie('adminAccessToken');
      res.clearCookie('adminRefreshToken');
      return res.status(403).json({ message: 'Invalid admin refresh token' });
    }
  }
};
