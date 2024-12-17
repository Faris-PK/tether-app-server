"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPeopleSuggestionsUseCase = void 0;
class GetPeopleSuggestionsUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new Error('User not found');
        const suggestions = await this.userRepository.findPotentialConnections(userId, user.following, 10);
        return suggestions.map(suggestion => ({
            _id: suggestion._id,
            username: suggestion.username,
            profile_picture: suggestion.profile_picture,
            mutualFriends: 0,
            isFollowing: false,
            createdAt: suggestion.createdAt,
            premiumStatus: suggestion.premium_status,
        }));
    }
}
exports.GetPeopleSuggestionsUseCase = GetPeopleSuggestionsUseCase;
//# sourceMappingURL=GetPeopleSuggestionsUseCase.js.map