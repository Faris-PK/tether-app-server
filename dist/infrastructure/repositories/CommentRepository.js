"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const Comment_1 = require("../../domain/entities/Comment");
class CommentRepository {
    async create(comment) {
        const newComment = new Comment_1.Comment(comment);
        return await newComment.save();
    }
    async findById(commentId) {
        return await Comment_1.Comment.findById(commentId)
            .populate('userId', 'username profile_picture');
    }
    async findByPostId(postId) {
        return await Comment_1.Comment.find({ postId, isDeleted: false, parentCommentId: null })
            .populate('userId', 'username profile_picture')
            .sort({ createdAt: -1 });
    }
    async update(commentId, content) {
        return await Comment_1.Comment.findByIdAndUpdate(commentId, { content }, { new: true }).populate('userId', 'username profile_picture');
    }
    async delete(commentId) {
        await Comment_1.Comment.findByIdAndUpdate(commentId, { isDeleted: true });
    }
    async isCommentOwner(commentId, userId) {
        const comment = await Comment_1.Comment.findById(commentId);
        return (comment === null || comment === void 0 ? void 0 : comment.userId.toString()) === userId;
    }
    async findRepliesByCommentId(commentId) {
        return await Comment_1.Comment.find({
            parentCommentId: commentId,
            isDeleted: false
        })
            .populate('userId', 'username profile_picture')
            .sort({ createdAt: 1 });
    }
}
exports.CommentRepository = CommentRepository;
//# sourceMappingURL=CommentRepository.js.map