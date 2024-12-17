"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnblockPostUseCase = void 0;
class UnblockPostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId) {
        const post = await this.postRepository.unblockPost(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        return post;
    }
}
exports.UnblockPostUseCase = UnblockPostUseCase;
//# sourceMappingURL=UnblockPostUseCase.js.map