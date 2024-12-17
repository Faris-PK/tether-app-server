"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const mongoose_1 = require("mongoose");
const Post_1 = require("../../domain/entities/Post");
const User_1 = require("../../domain/entities/User");
class PostRepository {
    async save(post) {
        return await post.save();
    }
    async findById(id) {
        return await Post_1.Post.findById(id)
            .populate('userId', 'username profile_picture')
            .populate('commentCount')
            .lean();
    }
    async findByUserId(userId) {
        return await Post_1.Post.find({ userId });
    }
    async findWithUserDetails(userId) {
        return await Post_1.Post.find({ userId })
            .populate('userId', 'username profile_picture')
            .populate('commentCount')
            .lean();
    }
    async update(id, postData) {
        return await Post_1.Post.findByIdAndUpdate(id, postData, { new: true });
    }
    async delete(id) {
        await Post_1.Post.findByIdAndDelete(id);
    }
    async likePost(postId, userId) {
        return await Post_1.Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
    }
    async unlikePost(postId, userId) {
        return await Post_1.Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
    }
    async isLikedByUser(postId, userId) {
        const post = await Post_1.Post.findById(postId);
        return post ? post.likes.includes(new mongoose_1.Types.ObjectId(userId)) : false;
    }
    async findUserPosts(userId) {
        return await Post_1.Post.find({ userId })
            .populate('userId', 'username profile_picture')
            .sort({ createdAt: -1 })
            .lean();
    }
    async findFollowingPosts(userId) {
        // First find the user to get their following list
        const user = await User_1.User.findById(userId).select('following');
        if (!user)
            return [];
        // Find posts from followed users
        return await Post_1.Post.find({
            userId: { $in: user.following }
        })
            .populate('userId', 'username profile_picture')
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean();
    }
    async findAllRelevantPosts({ userId, page = 1, limit = 5 }) {
        const user = await User_1.User.findById(userId).select('following');
        if (!user)
            return { posts: [], totalPosts: 0, totalPages: 0 };
        const query = Post_1.Post.find({
            $or: [
                { userId: userId },
                { userId: { $in: user.following } }
            ]
        });
        const skip = (page - 1) * limit;
        const [posts, totalPosts] = await Promise.all([
            query
                .populate('userId', 'username profile_picture')
                .populate('commentCount')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Post_1.Post.countDocuments({
                $or: [
                    { userId: userId },
                    { userId: { $in: user.following } }
                ]
            })
        ]);
        const totalPages = Math.ceil(totalPosts / limit);
        return {
            posts,
            totalPosts,
            totalPages
        };
    }
    async findAllPosts() {
        return await Post_1.Post.find()
            .populate('userId', 'username profile_picture')
            .populate('commentCount')
            .sort({ createdAt: -1 })
            .lean();
    }
    async blockPost(postId) {
        return await Post_1.Post.findByIdAndUpdate(postId, { isBlocked: true }, { new: true });
    }
    async unblockPost(postId) {
        return await Post_1.Post.findByIdAndUpdate(postId, { isBlocked: false }, { new: true });
    }
}
exports.PostRepository = PostRepository;
//# sourceMappingURL=PostRepository.js.map