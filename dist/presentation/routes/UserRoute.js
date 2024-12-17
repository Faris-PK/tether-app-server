"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const NotificationRepository_1 = require("../../infrastructure/repositories/NotificationRepository");
const StripeService_1 = require("../../infrastructure/services/StripeService");
const userRouter = (0, express_1.Router)();
const userRepository = new UserRepository_1.UserRepository();
const notificationRepository = new NotificationRepository_1.NotificationRepository();
const stripeService = new StripeService_1.StripeService(process.env.STRIPE_SECRET);
const userController = new UserController_1.UserController(userRepository, notificationRepository, stripeService);
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
//user profile
userRouter.get('/profile/:userId', authMiddleware_1.authMiddleware, (req, res) => userController.getProfile(req, res));
userRouter.put('/profile', authMiddleware_1.authMiddleware, (req, res) => userController.updateProfile(req, res));
userRouter.post('/upload-image', authMiddleware_1.authMiddleware, upload.single('file'), (req, res) => userController.uploadImage(req, res));
userRouter.post('/remove-profile-picture', authMiddleware_1.authMiddleware, (req, res) => userController.removeProfilePicture(req, res));
//user connections
userRouter.get('/followers/:userId', authMiddleware_1.authMiddleware, (req, res) => userController.getFollowers(req, res));
userRouter.get('/following/:userId', authMiddleware_1.authMiddleware, (req, res) => userController.getFollowing(req, res));
userRouter.get('/follow-requests', authMiddleware_1.authMiddleware, (req, res) => userController.getFollowRequests(req, res));
userRouter.get('/suggestions', authMiddleware_1.authMiddleware, (req, res) => userController.getPeopleSuggestions(req, res));
userRouter.post('/follow/:targetUserId', authMiddleware_1.authMiddleware, (req, res) => userController.followUser(req, res));
userRouter.post('/unfollow/:targetUserId', authMiddleware_1.authMiddleware, (req, res) => userController.unfollowUser(req, res));
userRouter.delete('/remove-request/:requestId', authMiddleware_1.authMiddleware, (req, res) => userController.removeFollowRequest(req, res));
userRouter.delete('/remove-suggestion/:userId', authMiddleware_1.authMiddleware, (req, res) => userController.removeSuggestion(req, res));
userRouter.post('/create-subscription', authMiddleware_1.authMiddleware, (req, res) => userController.createSubscription(req, res));
userRouter.get('/success', authMiddleware_1.authMiddleware, (req, res) => userController.handleSuccess(req, res));
userRouter.get('/search', authMiddleware_1.authMiddleware, (req, res) => userController.searchUsers(req, res));
userRouter.get('/notifications', authMiddleware_1.authMiddleware, (req, res) => userController.getUserNotifications(req, res));
exports.default = userRouter;
//# sourceMappingURL=UserRoute.js.map