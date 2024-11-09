import { UserRepository } from '../../../infrastructure/repositories/UserRepository';

export class GetPeopleSuggestionsUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const suggestions = await this.userRepository.findPotentialConnections(
      userId,
      user.following,
      10
    );

    return suggestions.map(suggestion => ({
      _id: suggestion._id,
      username: suggestion.username,
      profile_picture: suggestion.profile_picture,
      mutualFriends: 0, 
      isFollowing: false,
      createdAt: suggestion.createdAt ,
    }));
  }
}