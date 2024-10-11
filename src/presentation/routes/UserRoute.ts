import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { authMiddleware } from '../middleware/authMiddleware';

const userRouter = Router();
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

userRouter.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
userRouter.put('/profile', authMiddleware,(req, res) => userController.updateProfile(req, res));

export default userRouter;