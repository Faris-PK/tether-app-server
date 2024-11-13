import { Request, Response } from "express";
import { GetUserProfileUseCase } from '../../application/useCases/user/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/useCases/user/UpdateUserProfileUseCase';
import { UploadImageUseCase } from '../../application/useCases/user/UploadImageUseCase';
import { RemoveProfilePictureUseCase } from '../../application/useCases/user/RemoveProfilePictureUseCase';
import { S3Service } from '../../infrastructure/services/S3Service';
import { GetFollowRequestsUseCase } from "../../application/useCases/user/GetFollowRequestsUseCase";
import { GetPeopleSuggestionsUseCase } from "../../application/useCases/user/GetPeopleSuggestionsUseCase";
import { FollowUserUseCase } from "../../application/useCases/user/FollowUserUseCase";
import { UnfollowUserUseCase } from "../../application/useCases/user/UnfollowUserUseCase";
import { GetFollowersUseCase } from '../../application/useCases/user/GetFollowersUseCase';
import { GetFollowingUseCase } from '../../application/useCases/user/GetFollowingUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository";
import { StripeService } from '../../infrastructure/services/StripeService';
import { GetOtherUserProfileUseCase } from "../../application/useCases/user/GetOtherUserProfileUseCase";

export class UserController {
    private getUserProfileUseCase: GetUserProfileUseCase;
    private updateUserProfileUseCase: UpdateUserProfileUseCase;
    private uploadImageUseCase: UploadImageUseCase;
    private removeProfilePictureUseCase: RemoveProfilePictureUseCase;
    private getFollowRequestsUseCase: GetFollowRequestsUseCase ;
    private getPeopleSuggestionsUseCase: GetPeopleSuggestionsUseCase ;
    private followUserUseCase: FollowUserUseCase ;
    private unfollowUserUseCase: UnfollowUserUseCase ;
    private getFollowersUseCase: GetFollowersUseCase;
    private getFollowingUseCase: GetFollowingUseCase;
    private getOtherUserProfileUseCase: GetOtherUserProfileUseCase;
  
    constructor(
      private userRepository: UserRepository,
      private notificationRepository: NotificationRepository,
      private stripeService: StripeService,

    ) {
        this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
        this.updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
        const s3Service = new S3Service();
        this.uploadImageUseCase = new UploadImageUseCase(userRepository, s3Service);
        this.removeProfilePictureUseCase = new RemoveProfilePictureUseCase(userRepository);
        this.getFollowRequestsUseCase = new GetFollowRequestsUseCase(userRepository, notificationRepository);
        this.getPeopleSuggestionsUseCase = new GetPeopleSuggestionsUseCase(userRepository);
        this.followUserUseCase = new FollowUserUseCase(userRepository, notificationRepository);
        this.unfollowUserUseCase = new UnfollowUserUseCase(userRepository, notificationRepository);
        this.getFollowersUseCase = new GetFollowersUseCase(userRepository);
        this.getFollowingUseCase = new GetFollowingUseCase(userRepository);
        this.getOtherUserProfileUseCase = new GetOtherUserProfileUseCase(userRepository);

            
    }

    async getProfile (req: Request, res: Response, ) {
        try {
            const userId = req.params.userId //from middleware
            console.log('userId from controller : ', userId);
            
            const user = await this.getUserProfileUseCase.execute(userId??'');
           return res.status(200).json(user)

        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
           const updatedData = req.body;
            console.log('updatedData : ', updatedData)
  
           const UpdateUser = await this.updateUserProfileUseCase.execute(userId??'', updatedData);
           return res.status(200).json(updatedData)
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message:error.message})
            }
            
        }
    }
    async uploadImage(req: Request, res: Response) {
        try {
            console.log('Request vannooooo');
            
          const userId = req.userId;
          const file = req.file;
          const { type } = req.body;
    
          if (!file || !type) {
            return res.status(400).json({ message: 'File and type are required' });
          }
    
          const result = await this.uploadImageUseCase.execute(userId ?? '', file, type);
          console.log('Enthokkend:', result)
          return res.status(200).json(result);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      }

      async removeProfilePicture(req: Request, res: Response) {
        try {
          const userId = req.userId;
          const { type } = req.body;
    
          if (!type || (type !== 'profile' && type !== 'cover')) {
            return res.status(400).json({ message: 'Invalid picture type' });
          }
    
          const result = await this.removeProfilePictureUseCase.execute(userId ?? '', type);
          return res.status(200).json(result);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      }

      async getFollowRequests(req: Request, res: Response) {
        try {
          const userId = req.userId;
          const requests = await this.getFollowRequestsUseCase.execute(userId ?? '');
          return res.status(200).json(requests);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      }
    
      async getPeopleSuggestions(req: Request, res: Response) {
        try {
          
          const userId = req.userId;
          const suggestions = await this.getPeopleSuggestionsUseCase.execute(userId ?? '');
         // console.log(' suggestions users: ', suggestions);
          
          return res.status(200).json(suggestions);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      }
    
      async followUser(req: Request, res: Response) {
        try {
          const followerId = req.userId;
          const { targetUserId } = req.params;
          console.log('follower :',followerId);
          console.log('targetUserId :',targetUserId);
          const result = await this.followUserUseCase.execute(followerId ?? '', targetUserId);
          return res.status(200).json(result);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      }
    
      async unfollowUser(req: Request, res: Response) {
        try {
          const followerId = req.userId;
          const { targetUserId } = req.params;
          const result = await this.unfollowUserUseCase.execute(followerId ?? '', targetUserId);
          return res.status(200).json(result);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      }
    
      async removeFollowRequest(req: Request, res: Response) {
        try {
          const userId = req.userId;
          const { requestId } = req.params;
          await this.notificationRepository.deleteNotification(requestId);
          return res.status(200).json({ success: true });
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      }
    
      async removeSuggestion(req: Request, res: Response) {
        // This could be implemented to store user preferences about who they don't want to see in suggestions
        return res.status(200).json({ success: true });
      } 
      
      async getFollowers(req: Request, res: Response) {
        console.log('getFollowers triggered :');
          
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
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
          return res.status(500).json({ message: 'Internal server error' });
        }
      }
    
      async getFollowing(req: Request, res: Response) {
        try {
          const userId = req.params.userId;
          if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
          }
    
          const following = await this.getFollowingUseCase.execute(userId);
          console.log('following :', following);
          
          return res.status(200).json({
            success: true,
            data: following
          });
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
          return res.status(500).json({ message: 'Internal server error' });
        }
      }


      async createSubscription(req: Request, res: Response) {
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
    
        } catch (error) {
          console.error('Subscription creation error:', error);
          return res.status(500).json({ message: 'Error creating subscription' });
        }
      }
    
      async handleSuccess(req: Request, res: Response) {
        try {
          const { session_id } = req.query;
          console.log( 'Session Id : ', session_id);
          
          if (!session_id || typeof session_id !== 'string') {
            return res.status(400).json({ message: 'Invalid session ID' });
          }
    
          // Retrieve the session to get metadata
          const session = await this.stripeService.retrieveSession(session_id);
          const userId = session.metadata?.userId;
          console.log( 'Session ', session);
          console.log( 'userId ', userId);
    
          if (!userId) {
            return res.status(400).json({ message: 'User ID not found in session' });
          }
    
          // Calculate expiration date based on the subscription type
          const now = new Date();
          const expirationDate = new Date(now);
          
          // Determine subscription duration from the price ID or custom logic
          const isYearly = session.amount_total === 9999; // Example: checking if yearly plan ($99.99)
          expirationDate.setMonth(expirationDate.getMonth() + (isYearly ? 12 : 1));
    
          // Update user premium status
          let updatedUser = await this.userRepository.update(userId, {
            premium_status: true,
            premium_expiration: expirationDate
          });
    
          return res.status(200).json({message: "Payment status Updated",data : updatedUser}, );
    
        } catch (error) {
          console.error('Payment success handling error:', error);
          //return res.redirect(`${process.env.FRONTEND_URL}/user/payment/error`);
        }
      }

      async getOtherUserProfile(req: Request, res: Response) {
        try {

         
          
            const targetUserId = req.params.userId;
            const currentUserId = '67137b0bc69660d37ac1db84';
            console.log('targetUserId : ', targetUserId);
            console.log('currentUserId :', currentUserId);

            if (!targetUserId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const userProfile = await this.getOtherUserProfileUseCase.execute(targetUserId, currentUserId??'');
            return res.status(200).json(userProfile);

        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
      
}