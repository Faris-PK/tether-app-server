import { Request, Response } from "express";
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository";
import { StripeService } from '../../infrastructure/services/StripeService';
export declare class UserController {
    private userRepository;
    private notificationRepository;
    private stripeService;
    private getUserProfileUseCase;
    private updateUserProfileUseCase;
    private uploadImageUseCase;
    private removeProfilePictureUseCase;
    private getFollowRequestsUseCase;
    private getPeopleSuggestionsUseCase;
    private followUserUseCase;
    private unfollowUserUseCase;
    private getFollowersUseCase;
    private getFollowingUseCase;
    private getOtherUserProfileUseCase;
    private getUserNotificationsUseCase;
    private spotifyService;
    constructor(userRepository: UserRepository, notificationRepository: NotificationRepository, stripeService: StripeService);
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    uploadImage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeProfilePicture(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getFollowRequests(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPeopleSuggestions(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    followUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    unfollowUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeFollowRequest(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeSuggestion(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getFollowers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getFollowing(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private calculateExpirationDate;
    handleSuccess(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    searchUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
