import { Request, Response, NextFunction } from 'express';
import { User } from '../../domain/entities/User'; 

export const checkUserBlockedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId; 
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked' });
    }

    next();
  } catch (error) {
    console.error('Error in checkUserBlockedMiddleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};