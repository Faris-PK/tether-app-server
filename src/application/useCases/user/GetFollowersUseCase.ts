import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { PopulatedUser } from '../../../domain/types/PopulatedUser';

export class GetFollowersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<PopulatedUser[]> {
    return await this.userRepository.getFollowers(userId);
  }
}