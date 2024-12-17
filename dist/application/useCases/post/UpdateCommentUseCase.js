"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentUseCase = void 0;
class UpdateCommentUseCase {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async execute(commentId, userId, content) {
        const isOwner = await this.commentRepository.isCommentOwner(commentId, userId);
        if (!isOwner) {
            throw new Error('Unauthorized to edit this comment');
        }
        const updatedComment = await this.commentRepository.update(commentId, content);
        if (!updatedComment) {
            throw new Error('Failed to update comment');
        }
        return updatedComment;
    }
}
exports.UpdateCommentUseCase = UpdateCommentUseCase;
//# sourceMappingURL=UpdateCommentUseCase.js.map