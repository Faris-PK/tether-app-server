import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer'
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';

const userRouter = Router();
const userRepository = new UserRepository();
const notificationRepository = new NotificationRepository()
const userController = new UserController(userRepository, notificationRepository);

const upload = multer({ storage: multer.memoryStorage() });

//user profile

userRouter.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
userRouter.put('/profile', authMiddleware,(req, res) => userController.updateProfile(req, res));
userRouter.post('/upload-image', authMiddleware, upload.single('file'), (req, res) => userController.uploadImage(req, res));
userRouter.post('/remove-profile-picture', authMiddleware, (req, res) => userController.removeProfilePicture(req, res));

//user connections
userRouter.get('/follow-requests', authMiddleware, (req, res) => userController.getFollowRequests(req, res));
userRouter.get('/suggestions', authMiddleware, (req, res) => userController.getPeopleSuggestions(req, res));
userRouter.post('/follow/:targetUserId', authMiddleware, (req, res) => userController.followUser(req, res));
userRouter.post('/unfollow/:targetUserId', authMiddleware, (req, res) => userController.unfollowUser(req, res));
userRouter.delete('/remove-request/:requestId', authMiddleware, (req, res) => userController.removeFollowRequest(req, res));
userRouter.delete('/remove-suggestion/:userId', authMiddleware, (req, res) => userController.removeSuggestion(req, res));

export default userRouter;