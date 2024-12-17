"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCommentUseCase = void 0;
class DeleteCommentUseCase {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async execute(commentId, userId) {
        const isOwner = await this.commentRepository.isCommentOwner(commentId, userId);
        if (!isOwner) {
            throw new Error('Unauthorized to delete this comment');
        }
        await this.commentRepository.delete(commentId);
    }
}
exports.DeleteCommentUseCase = DeleteCommentUseCase;
//# sourceMappingURL=DeleteCommentUseCase.js.map