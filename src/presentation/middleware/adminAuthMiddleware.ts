import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedAdminJwt {
  adminId: string;
  iat: number;
  exp?: number;
}

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.adminRefreshToken;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Admin access token not found' });
    }
    const headerToken = authHeader.split(' ')[1];
    if (!headerToken) {
      return res.status(401).json({ message: 'Admin access token not found' });
    }
  }

  try {
    const finalToken = token || req.headers.authorization?.split(' ')[1];
    const payload = jwt.verify(
      finalToken as string,
      process.env.JWT_ADMIN_REFRESH_SECRET as string
    ) as DecodedAdminJwt;
    
    req.adminId = payload.adminId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid admin access token' });
  }
};  