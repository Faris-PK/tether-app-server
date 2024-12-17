"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryRepository = void 0;
const Story_1 = require("../../domain/entities/Story");
const User_1 = require("../../domain/entities/User");
class StoryRepository {
    async save(story) {
        return await story.save();
    }
    async findById(id) {
        return await Story_1.Story.findById(id);
    }
    async findByUserId(userId) {
        return await Story_1.Story.find({ userId: userId });
    }
    async delete(id) {
        await Story_1.Story.findByIdAndDelete(id);
    }
    async findFollowingStories(userId) {
        const user = await User_1.User.findById(userId).select("following");
        if (!user)
            return [];
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return (await Story_1.Story.find({
            userId: { $in: [...user.following, userId] },
            createdAt: { $gte: twentyFourHoursAgo },
        })
            .populate("userId", "username profile_picture")
            .populate({
            path: "viewedUsers likedUsers", // Changed from views to viewedUsers
            select: "username profile_picture",
        })
            .sort({ createdAt: -1 })
            .lean());
    }
    async addView(storyId, userId) {
        const story = await Story_1.Story.findById(storyId);
        if (!story)
            return null;
        // Don't add view if it's the story owner
        if (story.userId.toString() === userId) {
            return story;
        }
        return await Story_1.Story.findByIdAndUpdate(storyId, { $addToSet: { viewedUsers: userId } }, // Changed from views to viewedUsers
        { new: true }).populate("viewedUsers", "username profile_picture"); // Changed from views to viewedUsers
    }
    async toggleLike(storyId, userId) {
        const story = await Story_1.Story.findById(storyId);
        if (!story)
            return null;
        const isLiked = story.likedUsers.includes(userId);
        return await Story_1.Story.findByIdAndUpdate(storyId, isLiked
            ? { $pull: { likedUsers: userId } }
            : { $addToSet: { likedUsers: userId } }, { new: true }).populate("likedUsers viewedUsers", "username profile_picture");
    }
}
exports.StoryRepository = StoryRepository;
//# sourceMappingURL=StoryRepository.js.map