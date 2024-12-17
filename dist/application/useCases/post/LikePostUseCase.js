"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikePostUseCase = void 0;
class LikePostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, userId) {
        const isLiked = await this.postRepository.isLikedByUser(postId, userId);
        if (isLiked) {
            const updatedPost = await this.postRepository.unlikePost(postId, userId);
            if (!updatedPost)
                throw new Error('Failed to unlike post');
            return updatedPost;
        }
        else {
            const updatedPost = await this.postRepository.likePost(postId, userId);
            if (!updatedPost)
                throw new Error('Failed to like post');
            return updatedPost;
        }
    }
}
exports.LikePostUseCase = LikePostUseCase;
//# sourceMappingURL=LikePostUseCase.js.map