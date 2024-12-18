import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedJwt {
  userId: string;
  iat: number;
  exp?: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    console.log( 'No tokens provided');
    return res.status(401).json({ message: 'No tokens provided' });
  }

  try {

    const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as DecodedJwt;
    req.userId = decodedAccessToken.userId;
    return next();

  } catch (accessTokenError) {.000

    if (!refreshToken) {
      return res.status(401).json({ message: 'Access token expired and no refresh token provided' });
    }

    try {
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as DecodedJwt;
      
      const newAccessToken = jwt.sign(
        { userId: decodedRefreshToken.userId },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: '15m' }
      );

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000
      });

      req.userId = decodedRefreshToken.userId;
      return next();
    } catch (refreshTokenError) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
  }
};
