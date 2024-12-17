import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { IUser } from '../../../domain/entities/User';
export declare class UploadImageUseCase {
    private userRepository;
    private s3Service;
    constructor(userRepository: UserRepository, s3Service: S3Service);
    execute(userId: string, file: Express.Multer.File, type: 'profile' | 'cover'): Promise<IUser>;
}
