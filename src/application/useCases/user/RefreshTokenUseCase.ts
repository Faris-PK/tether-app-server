import jwt from 'jsonwebtoken';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';

export class RefreshTokenUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(refreshToken: string): Promise<string> {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string };
      const user = await this.userRepository.findById(payload.userId);

      if (!user) {
        throw new Error('User not found');
      }

      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: '15m' }
      );

      return accessToken;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}