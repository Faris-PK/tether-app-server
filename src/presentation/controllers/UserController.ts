import { NextFunction, Request, Response } from "express";
import { GetUserProfileUseCase } from '../../application/useCases/user/GetUserProfileUseCase'
import { UpdateUserProfileUseCase } from '../../application/useCases/user/UpdateUserProfileUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export class UserController {
    private getUserProfileUseCase: GetUserProfileUseCase;
    private updateUserProfileUseCase: UpdateUserProfileUseCase;


    constructor(private userRepository: UserRepository) {
        this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
        this.updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

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
}