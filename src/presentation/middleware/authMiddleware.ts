// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface DecodedJwt {
//   userId: string;
//   iat: number;
//   exp?: number;
// }

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.refreshToken;
                    
//  // console.log('token: ', token);
  
//   if (!token) {
//     return res.status(401).json({ message: 'Access token not found' });
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as DecodedJwt;
//     //console.log('payload: ', payload);
    
//     req.userId = payload.userId; // This should now work
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid access token' });
//   }
// };



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
    return res.status(401).json({ message: 'No tokens provided' });
  }

  // First, try to verify access token
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as DecodedJwt;
      req.userId = decoded.userId;
      return next();
    } catch (error) {
      // Access token is invalid or expired, we'll try refresh token below
      // Don't return here - continue to refresh token logic
    }
  }

  // If we reach here, either:
  // 1. We had no access token, or
  // 2. Access token was invalid/expired
  // In either case, we'll try to use the refresh token

  if (!refreshToken) {
    return res.status(401).json({ message: 'Access token expired and no refresh token provided' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as DecodedJwt;
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' }
    );

    // Set new access token in cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Set userId in request
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    // If refresh token is invalid, clear both cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};