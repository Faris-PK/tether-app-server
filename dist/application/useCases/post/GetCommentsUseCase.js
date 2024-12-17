"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommentsUseCase = void 0;
class GetCommentsUseCase {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async execute(postId) {
        const comments = await this.commentRepository.findByPostId(postId);
        const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
            const replies = await this.commentRepository.findRepliesByCommentId(comment._id);
            return { ...comment.toObject(), replies };
        }));
        return commentsWithReplies;
    }
}
exports.GetCommentsUseCase = GetCommentsUseCase;
//# sourceMappingURL=GetCommentsUseCase.js.map