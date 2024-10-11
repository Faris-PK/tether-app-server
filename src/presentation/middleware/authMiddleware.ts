import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedJwt {
  userId: string;
  iat: number;
  exp?: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;
 // console.log('token: ', token);
  
  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as DecodedJwt;
    //console.log('payload: ', payload);
    
    req.userId = payload.userId; // This should now work
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid access token' });
  }
};
