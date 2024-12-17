"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockPostUseCase = void 0;
class BlockPostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId) {
        const post = await this.postRepository.blockPost(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        return post;
    }
}
exports.BlockPostUseCase = BlockPostUseCase;
//# sourceMappingURL=BlockPostUseCase.js.map