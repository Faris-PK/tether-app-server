import { UserRepository } from '../../../infrastructure/repositories/UserRepository';

export class UnblockUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isBlocked = false;
    await this.userRepository.save(user);
  }
}