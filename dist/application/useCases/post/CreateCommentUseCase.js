"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentUseCase = void 0;
const mongoose_1 = require("mongoose");
class CreateCommentUseCase {
    constructor(commentRepository, postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }
    async execute(postId, userId, content, parentCommentId) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (parentCommentId) {
            const parentComment = await this.commentRepository.findById(parentCommentId);
            if (!parentComment) {
                throw new Error('Parent comment not found');
            }
        }
        return await this.commentRepository.create({
            postId: new mongoose_1.Types.ObjectId(postId),
            userId: new mongoose_1.Types.ObjectId(userId),
            content,
            parentCommentId: parentCommentId
                ? new mongoose_1.Types.ObjectId(parentCommentId)
                : undefined
        });
    }
}
exports.CreateCommentUseCase = CreateCommentUseCase;
//# sourceMappingURL=CreateCommentUseCase.js.map