"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostUseCase = void 0;
class UpdatePostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, userId, updateData) {
        const existingPost = await this.postRepository.findById(postId);
        if (!existingPost) {
            throw new Error('Post not found');
        }
        if (existingPost.userId.toString() !== userId) {
            throw new Error('Unauthorized to update this post');
        }
        const updatedPost = await this.postRepository.update(postId, updateData);
        if (!updatedPost) {
            throw new Error('Failed to update post');
        }
        return updatedPost;
    }
}
exports.UpdatePostUseCase = UpdatePostUseCase;
//# sourceMappingURL=UpdatePostUseCase.js.map