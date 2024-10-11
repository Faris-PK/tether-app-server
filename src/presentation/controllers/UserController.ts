import { Request, Response } from "express";
import { GetUserProfileUseCase } from '../../application/useCases/user/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/useCases/user/UpdateUserProfileUseCase';
import { UploadImageUseCase } from '../../application/useCases/user/UploadImageUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
export class UserController {
    private getUserProfileUseCase: GetUserProfileUseCase;
    private updateUserProfileUseCase: UpdateUserProfileUseCase;
    private uploadImageUseCase: UploadImageUseCase;


    constructor(private userRepository: UserRepository) {
        this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
        this.updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
        const s3Service = new S3Service();
        this.uploadImageUseCase = new UploadImageUseCase(userRepository, s3Service);

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
            console.log('userId from controller : ', userId);

           const updatedData = req.body;
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
      
}