import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer'
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';
import { StripeService } from '../../infrastructure/services/StripeService';

const userRouter = Router();
const userRepository = new UserRepository();
const notificationRepository = new NotificationRepository();
const stripeService = new StripeService(process.env.STRIPE_SECRET!);

const userController = new UserController(userRepository, notificationRepository, stripeService);

const upload = multer({ storage: multer.memoryStorage() });

//user profile

userRouter.get('/profile/:userId', authMiddleware, (req, res) => userController.getProfile(req, res));
userRouter.put('/profile', authMiddleware,(req, res) => userController.updateProfile(req, res));
userRouter.post('/upload-image', authMiddleware, upload.single('file'), (req, res) => userController.uploadImage(req, res));
userRouter.post('/remove-profile-picture', authMiddleware, (req, res) => userController.removeProfilePicture(req, res));

//user connections
userRouter.get('/followers/:userId', authMiddleware, (req, res) => userController.getFollowers(req, res));
userRouter.get('/following/:userId', authMiddleware, (req, res) => userController.getFollowing(req, res));
userRouter.get('/follow-requests', authMiddleware, (req, res) => userController.getFollowRequests(req, res));
userRouter.get('/suggestions', authMiddleware, (req, res) => userController.getPeopleSuggestions(req, res));
userRouter.post('/follow/:targetUserId', authMiddleware, (req, res) => userController.followUser(req, res));
userRouter.post('/unfollow/:targetUserId', authMiddleware, (req, res) => userController.unfollowUser(req, res));
userRouter.delete('/remove-request/:requestId', authMiddleware, (req, res) => userController.removeFollowRequest(req, res));
userRouter.delete('/remove-suggestion/:userId', authMiddleware, (req, res) => userController.removeSuggestion(req, res));


userRouter.post('/create-subscription', authMiddleware, (req, res) => userController.createSubscription(req, res));
userRouter.get('/success', authMiddleware, (req, res) => userController.handleSuccess(req, res));
userRouter.get('/search', authMiddleware, (req, res,) => userController.searchUsers(req, res));





export default userRouter;      