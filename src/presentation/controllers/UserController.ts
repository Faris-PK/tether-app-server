import { Request, Response } from "express";
import { GetUserProfileUseCase } from '../../application/useCases/user/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/useCases/user/UpdateUserProfileUseCase';
import { UploadImageUseCase } from '../../application/useCases/user/UploadImageUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { RemoveProfilePictureUseCase } from '../../application/useCases/user/RemoveProfilePictureUseCase';
import { S3Service } from '../../infrastructure/services/S3Service';
import { GetFollowRequestsUseCase } from "../../application/useCases/user/GetFollowRequestsUseCase";
import { GetPeopleSuggestionsUseCase } from "../../application/useCases/user/GetPeopleSuggestionsUseCase";
import { FollowUserUseCase } from "../../application/useCases/user/FollowUserUseCase";
import { UnfollowUserUseCase } from "../../application/useCases/user/UnfollowUserUseCase";
import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository";
export class UserController {
    private getUserProfileUseCase: GetUserProfileUseCase;
    private updateUserProfileUseCase: UpdateUserProfileUseCase;
    private uploadImageUseCase: UploadImageUseCase;
    private removeProfilePictureUseCase: RemoveProfilePictureUseCase;
    private getFollowRequestsUseCase: GetFollowRequestsUseCase ;
    private getPeopleSuggestionsUseCase: GetPeopleSuggestionsUseCase ;
    private followUserUseCase: FollowUserUseCase ;
    private unfollowUserUseCase: UnfollowUserUseCase ;
      
    constructor(private userRepository: UserRepository,
      private notificationRepository: NotificationRepository
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
            
    }

    async getProfile (req: Request, res: Response, ) {
        try {
            const userId = req.userId //from middleware
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
           console.log('updatedData : ', updatedData);
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
      
}