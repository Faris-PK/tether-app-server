import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer'

const userRouter = Router();
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const upload = multer({ storage: multer.memoryStorage() });

userRouter.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
userRouter.put('/profile', authMiddleware,(req, res) => userController.updateProfile(req, res));
userRouter.post('/upload-image', authMiddleware, upload.single('file'), (req, res) => userController.uploadImage(req, res));
userRouter.post('/remove-profile-picture', authMiddleware, (req, res) => userController.removeProfilePicture(req, res));

export default userRouter;