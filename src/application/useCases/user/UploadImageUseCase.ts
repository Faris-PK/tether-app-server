import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { IUser } from '../../../domain/entities/User';

export class UploadImageUseCase {
  constructor(
    private userRepository: UserRepository,
    private s3Service: S3Service
  ) {}

  async execute(userId: string, file: Express.Multer.File, type: 'profile' | 'cover'): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const uploadResult = await this.s3Service.uploadFile(file);

    if (type === 'profile') {
      user.profile_picture = uploadResult.Location;
    } else {
      user.cover_photo = uploadResult.Location;
    }

    await this.userRepository.save(user);
    return user;
  }
}