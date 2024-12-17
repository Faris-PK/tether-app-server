"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const CreatePostUseCase_1 = require("../../application/useCases/post/CreatePostUseCase");
const DeletePostUseCase_1 = require("../../application/useCases/post/DeletePostUseCase");
const UpdatePostUseCase_1 = require("../../application/useCases/post/UpdatePostUseCase");
const ReportPostUseCase_1 = require("../../application/useCases/post/ReportPostUseCase");
const UpdateCommentUseCase_1 = require("../../application/useCases/post/UpdateCommentUseCase");
const GetCommentsUseCase_1 = require("../../application/useCases/post/GetCommentsUseCase");
const DeleteCommentUseCase_1 = require("../../application/useCases/post/DeleteCommentUseCase");
const LikePostNotificationUseCase_1 = require("../../application/useCases/post/LikePostNotificationUseCase");
const CreateCommentNotificationUseCase_1 = require("../../application/useCases/post/CreateCommentNotificationUseCase");
class PostController {
    constructor(postRepository, s3Service, userRepository, commentRepository, reportRepository, notificationRepository) {
        this.postRepository = postRepository;
        this.s3Service = s3Service;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.reportRepository = reportRepository;
        this.notificationRepository = notificationRepository;
        this.createPostUseCase = new CreatePostUseCase_1.CreatePostUseCase(postRepository, s3Service);
        this.deletePostUseCase = new DeletePostUseCase_1.DeletePostUseCase(postRepository, s3Service, userRepository);
        this.updatePostUseCase = new UpdatePostUseCase_1.UpdatePostUseCase(postRepository);
        this.reportPostUseCase = new ReportPostUseCase_1.ReportPostUseCase(reportRepository, postRepository);
        this.getCommentsUseCase = new GetCommentsUseCase_1.GetCommentsUseCase(commentRepository);
        this.updateCommentUseCase = new UpdateCommentUseCase_1.UpdateCommentUseCase(commentRepository);
        this.deleteCommentUseCase = new DeleteCommentUseCase_1.DeleteCommentUseCase(commentRepository);
        this.likePostNotificationUseCase = new LikePostNotificationUseCase_1.LikePostNotificationUseCase(postRepository, notificationRepository, userRepository);
        this.createCommentNotificationUseCase = new CreateCommentNotificationUseCase_1.CreateCommentNotificationUseCase(commentRepository, postRepository, notificationRepository, userRepository);
    }
    async createPost(req, res) {
        try {
            const userId = req.userId;
            const file = req.file;
            let { caption, audience, postType, location } = req.body;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const postData = {
                userId,
                caption,
                postType,
                location,
                audience,
            };
            const newPost = await this.createPostUseCase.execute(postData, file);
            if (newPost) {
                console.log(' Post id:', newPost);
            }
            return res.status(201).json(newPost);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async getPostsForHome(req, res) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const result = await this.postRepository.findAllRelevantPosts({
                userId,
                page,
                limit
            });
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async getPostsForProfile(req, res) {
        try {
            const userId = req.params.userId;
            let posts;
            if (userId) {
                posts = await this.postRepository.findWithUserDetails(userId);
            }
            return res.status(200).json(posts);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async deletePost(req, res) {
        try {
            const userId = req.userId;
            const postId = req.params.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            await this.deletePostUseCase.execute(postId, userId);
            // console.log('What happend here');  
            return res.status(200).json({ message: 'Post deleted successfully' });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async updatePost(req, res) {
        try {
            const userId = req.userId;
            const postId = req.params.id;
            const { caption, location } = req.body;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const updatedPost = await this.updatePostUseCase.execute(postId, userId, { caption, location });
            return res.status(200).json(updatedPost);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async likePost(req, res) {
        try {
            const userId = req.userId;
            const postId = req.params.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const updatedPost = await this.likePostNotificationUseCase.execute(postId, userId);
            return res.status(200).json(updatedPost);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async reportPost(req, res) {
        try {
            const userId = req.userId;
            const postId = req.params.id;
            const { reason } = req.body;
            //  console.log( 'userId : ', userId);
            //   console.log( 'postId : ', postId);
            // console.log( 'reason : ', reason);
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            if (!reason) {
                return res.status(400).json({ message: 'Reason is required' });
            }
            const report = await this.reportPostUseCase.execute(postId, userId, reason);
            return res.status(201).json(report);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async getComments(req, res) {
        try {
            const postId = req.params.postId;
            const comments = await this.getCommentsUseCase.execute(postId);
            console.log(comments);
            return res.status(200).json({
                success: true,
                message: 'Comments retrieved successfully',
                data: comments
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ success: false, message: error.message });
            }
        }
    }
    async createComment(req, res) {
        try {
            const userId = req.userId;
            const postId = req.params.postId;
            const { content } = req.body;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }
            if (!content) {
                return res.status(400).json({ success: false, message: 'Content is required' });
            }
            const comment = await this.createCommentNotificationUseCase.execute(postId, userId, content);
            return res.status(201).json({
                success: true,
                message: 'Comment created successfully',
                data: comment
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ success: false, message: error.message });
            }
        }
    }
    async updateComment(req, res) {
        try {
            const userId = req.userId;
            const { postId, commentId } = req.params;
            const { content } = req.body;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }
            if (!content) {
                return res.status(400).json({ success: false, message: 'Content is required' });
            }
            const updatedComment = await this.updateCommentUseCase.execute(commentId, userId, content);
            return res.status(200).json({
                success: true,
                message: 'Comment updated successfully',
                data: updatedComment
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ success: false, message: error.message });
            }
        }
    }
    async createReplyComment(req, res) {
        try {
            const userId = req.userId;
            const { postId, parentCommentId } = req.params;
            const { content } = req.body;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }
            if (!content) {
                return res.status(400).json({ success: false, message: 'Content is required' });
            }
            const comment = await this.createCommentNotificationUseCase.execute(postId, userId, content, parentCommentId);
            return res.status(201).json({
                success: true,
                message: 'Reply created successfully',
                data: comment
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ success: false, message: error.message });
            }
        }
    }
    async deleteComment(req, res) {
        try {
            const userId = req.userId;
            const { postId, commentId } = req.params;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }
            await this.deleteCommentUseCase.execute(commentId, userId);
            // Delete associated notifications
            await this.notificationRepository.deleteCommentNotification(commentId);
            return res.status(200).json({
                success: true,
                message: 'Comment deleted successfully'
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ success: false, message: error.message });
            }
        }
    }
    async getSinglePost(req, res) {
        try {
            const postId = req.params.postId;
            console.log('post Id:  ', postId);
            if (!postId) {
                return res.status(400).json({ success: false, message: 'Post ID is required' });
            }
            const post = await this.postRepository.findById(postId);
            console.log('Fetched singlepost : ', post);
            return res.status(200).json(post);
        }
        catch (error) {
            return res.status(400).json({ message: 'error occured while fetching post' });
        }
    }
}
exports.PostController = PostController;
//# sourceMappingURL=PostController.js.map