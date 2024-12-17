"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const GetUserProfileUseCase_1 = require("../../application/useCases/user/GetUserProfileUseCase");
const UpdateUserProfileUseCase_1 = require("../../application/useCases/user/UpdateUserProfileUseCase");
const UploadImageUseCase_1 = require("../../application/useCases/user/UploadImageUseCase");
const RemoveProfilePictureUseCase_1 = require("../../application/useCases/user/RemoveProfilePictureUseCase");
const S3Service_1 = require("../../infrastructure/services/S3Service");
const GetFollowRequestsUseCase_1 = require("../../application/useCases/user/GetFollowRequestsUseCase");
const GetPeopleSuggestionsUseCase_1 = require("../../application/useCases/user/GetPeopleSuggestionsUseCase");
const FollowUserUseCase_1 = require("../../application/useCases/user/FollowUserUseCase");
const UnfollowUserUseCase_1 = require("../../application/useCases/user/UnfollowUserUseCase");
const GetFollowersUseCase_1 = require("../../application/useCases/user/GetFollowersUseCase");
const GetFollowingUseCase_1 = require("../../application/useCases/user/GetFollowingUseCase");
const GetOtherUserProfileUseCase_1 = require("../../application/useCases/user/GetOtherUserProfileUseCase");
const GetUserNotificationsUseCase_1 = require("../../application/useCases/user/GetUserNotificationsUseCase");
const SpotifyService_1 = require("../../infrastructure/services/SpotifyService");
class UserController {
    constructor(userRepository, notificationRepository, stripeService) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.stripeService = stripeService;
        this.getUserProfileUseCase = new GetUserProfileUseCase_1.GetUserProfileUseCase(userRepository);
        this.updateUserProfileUseCase = new UpdateUserProfileUseCase_1.UpdateUserProfileUseCase(userRepository);
        const s3Service = new S3Service_1.S3Service();
        this.uploadImageUseCase = new UploadImageUseCase_1.UploadImageUseCase(userRepository, s3Service);
        this.removeProfilePictureUseCase = new RemoveProfilePictureUseCase_1.RemoveProfilePictureUseCase(userRepository);
        this.getFollowRequestsUseCase = new GetFollowRequestsUseCase_1.GetFollowRequestsUseCase(userRepository, notificationRepository);
        this.getPeopleSuggestionsUseCase = new GetPeopleSuggestionsUseCase_1.GetPeopleSuggestionsUseCase(userRepository);
        this.followUserUseCase = new FollowUserUseCase_1.FollowUserUseCase(userRepository, notificationRepository);
        this.unfollowUserUseCase = new UnfollowUserUseCase_1.UnfollowUserUseCase(userRepository, notificationRepository);
        this.getFollowersUseCase = new GetFollowersUseCase_1.GetFollowersUseCase(userRepository);
        this.getFollowingUseCase = new GetFollowingUseCase_1.GetFollowingUseCase(userRepository);
        this.getUserNotificationsUseCase = new GetUserNotificationsUseCase_1.GetUserNotificationsUseCase(notificationRepository);
        this.getOtherUserProfileUseCase = new GetOtherUserProfileUseCase_1.GetOtherUserProfileUseCase(userRepository);
        this.spotifyService = new SpotifyService_1.SpotifyService();
    }
    async getProfile(req, res) {
        try {
            const userId = req.params.userId; //from middleware
            // console.log('userId from controller : ', userId);
            const user = await this.getUserProfileUseCase.execute(userId !== null && userId !== void 0 ? userId : '');
            return res.status(200).json(user);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.userId;
            const updatedData = req.body;
            //  console.log('updatedData : ', updatedData)
            const UpdateUser = await this.updateUserProfileUseCase.execute(userId !== null && userId !== void 0 ? userId : '', updatedData);
            return res.status(200).json(updatedData);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async uploadImage(req, res) {
        try {
            // console.log('Request vannooooo');
            const userId = req.userId;
            const file = req.file;
            const { type } = req.body;
            if (!file || !type) {
                return res.status(400).json({ message: 'File and type are required' });
            }
            const result = await this.uploadImageUseCase.execute(userId !== null && userId !== void 0 ? userId : '', file, type);
            console.log('Enthokkend:', result);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async removeProfilePicture(req, res) {
        try {
            const userId = req.userId;
            const { type } = req.body;
            if (!type || (type !== 'profile' && type !== 'cover')) {
                return res.status(400).json({ message: 'Invalid picture type' });
            }
            const result = await this.removeProfilePictureUseCase.execute(userId !== null && userId !== void 0 ? userId : '', type);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async getFollowRequests(req, res) {
        try {
            const userId = req.userId;
            const requests = await this.getFollowRequestsUseCase.execute(userId !== null && userId !== void 0 ? userId : '');
            return res.status(200).json(requests);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async getPeopleSuggestions(req, res) {
        try {
            const userId = req.userId;
            const suggestions = await this.getPeopleSuggestionsUseCase.execute(userId !== null && userId !== void 0 ? userId : '');
            // console.log(' suggestions users: ', suggestions);
            return res.status(200).json(suggestions);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async followUser(req, res) {
        try {
            const followerId = req.userId;
            const { targetUserId } = req.params;
            // console.log('follower :',followerId);
            // console.log('targetUserId :',targetUserId);
            const result = await this.followUserUseCase.execute(followerId !== null && followerId !== void 0 ? followerId : '', targetUserId);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async unfollowUser(req, res) {
        try {
            const followerId = req.userId;
            const { targetUserId } = req.params;
            const result = await this.unfollowUserUseCase.execute(followerId !== null && followerId !== void 0 ? followerId : '', targetUserId);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async removeFollowRequest(req, res) {
        try {
            const userId = req.userId;
            const { requestId } = req.params;
            await this.notificationRepository.deleteNotification(requestId);
            return res.status(200).json({ success: true });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async removeSuggestion(req, res) {
        // This could be implemented to store user preferences about who they don't want to see in suggestions
        return res.status(200).json({ success: true });
    }
    async getFollowers(req, res) {
        // console.log('getFollowers triggered :');
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const followers = await this.getFollowersUseCase.execute(userId);
            return res.status(200).json({
                success: true,
                data: followers
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getFollowing(req, res) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const following = await this.getFollowingUseCase.execute(userId);
            //  console.log('following :', following);
            return res.status(200).json({
                success: true,
                data: following
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async createSubscription(req, res) {
        try {
            const { priceId, planType } = req.body;
            // console.log(' payment body : ', req.body);
            const userId = req.userId; // Assuming you have user data in request from auth middleware
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const sessionId = await this.stripeService.createCheckoutSession(priceId, userId);
            // console.log('sessionId : ', sessionId);
            return res.status(200).json({ sessionUrl: sessionId });
        }
        catch (error) {
            console.error('Subscription creation error:', error);
            return res.status(500).json({ message: 'Error creating subscription' });
        }
    }
    calculateExpirationDate(interval, intervalCount) {
        const now = new Date();
        const expirationDate = new Date(now);
        switch (interval) {
            case 'month':
                expirationDate.setMonth(expirationDate.getMonth() + intervalCount);
                break;
            case 'year':
                expirationDate.setFullYear(expirationDate.getFullYear() + intervalCount);
                break;
            default:
                throw new Error('Unsupported interval type');
        }
        return expirationDate;
    }
    async handleSuccess(req, res) {
        var _a, _b, _c, _d;
        try {
            const { session_id } = req.query;
            if (!session_id || typeof session_id !== 'string') {
                return res.status(400).json({ message: 'Invalid session ID' });
            }
            const session = await this.stripeService.retrieveSession(session_id);
            const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in session' });
            }
            // Get the price details to determine subscription duration
            const priceId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.priceId;
            const priceDetails = await this.stripeService.getSubscriptionDetails(priceId !== null && priceId !== void 0 ? priceId : "");
            // Calculate expiration date based on the subscription type
            const expirationDate = this.calculateExpirationDate(((_c = priceDetails.recurring) === null || _c === void 0 ? void 0 : _c.interval) || 'month', ((_d = priceDetails.recurring) === null || _d === void 0 ? void 0 : _d.interval_count) || 1);
            // Update user with premium status and expiration
            const updatedUser = await this.userRepository.update(userId, {
                premium_status: true,
                premium_expiration: expirationDate,
                stripeCustomerId: session.customer
            });
            return res.status(200).json({
                message: "Payment status updated",
                data: {
                    premium_status: updatedUser.premium_status,
                    premium_expiration: updatedUser.premium_expiration
                }
            });
        }
        catch (error) {
            console.error('Payment success handling error:', error);
            return res.status(500).json({ message: 'Error processing payment success' });
        }
    }
    async searchUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const searchTerm = req.query.searchTerm;
            console.log('searched: ', searchTerm);
            const result = await this.userRepository.searchUsers({
                page,
                limit,
                searchTerm,
            });
            return res.status(200).json({
                status: 'success',
                data: result
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ status: 'error', message: error.message });
            }
        }
    }
    async getUserNotifications(req, res) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const result = await this.getUserNotificationsUseCase.execute(userId, page, limit);
            return res.status(200).json({
                success: true,
                data: result.notifications,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalNotifications: result.totalNotifications
                }
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map