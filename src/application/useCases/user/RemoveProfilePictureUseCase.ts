import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { IUser } from '../../../domain/entities/User';

export class RemoveProfilePictureUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, type: 'profile' | 'cover'): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const defaultImage = type === 'profile'
      ? 'https://www.trendycovers.com/default_propic.jpg'
      : 'https://notepd.s3.amazonaws.com/default-cover.png';

    if (type === 'profile') {
      user.profile_picture = defaultImage;
    } else {
      user.cover_photo = defaultImage;
    }

    await this.userRepository.save(user);
    return user;
  }
}