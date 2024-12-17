"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePostUseCase = void 0;
class DeletePostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        await this.postRepository.delete(postId);
    }
}
exports.DeletePostUseCase = DeletePostUseCase;
//# sourceMappingURL=DeletePostUseCase.js.map