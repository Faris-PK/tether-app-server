import { IStory, Story } from "../../domain/entities/Story";
import { User } from "../../domain/entities/User";
import { IStoryRepository } from "../../domain/interfaces/IStoryRepository";

export class StoryRepository implements IStoryRepository {
  async save(story: IStory): Promise<IStory> {
    return await story.save();
  }

  async findById(id: string): Promise<IStory | null> {
    return await Story.findById(id);
  }

  async findByUserId(userId: string): Promise<IStory[]> {
    return await Story.find({ userId: userId });
  }

  async delete(id: string): Promise<void> {
    await Story.findByIdAndDelete(id);
  }

  async findFollowingStories(userId: string): Promise<IStory[]> {
    const user = await User.findById(userId).select("following");
    if (!user) return [];

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return (await Story.find({
      userId: { $in: [...user.following, userId] },
      createdAt: { $gte: twentyFourHoursAgo },
    })
      .populate("userId", "username profile_picture")
      .populate({
        path: "viewedUsers likedUsers",  // Changed from views to viewedUsers
        select: "username profile_picture",
      })
      .sort({ createdAt: -1 })
      .lean()) as IStory[];
  }

  async addView(storyId: string, userId: string): Promise<IStory | null> {
    const story = await Story.findById(storyId);
    if (!story) return null;

    // Don't add view if it's the story owner
    if (story.userId.toString() === userId) {
      return story;
    }

    return await Story.findByIdAndUpdate(
      storyId,
      { $addToSet: { viewedUsers: userId } },  // Changed from views to viewedUsers
      { new: true }
    ).populate("viewedUsers", "username profile_picture");  // Changed from views to viewedUsers
  }

  async toggleLike(storyId: string, userId: string): Promise<IStory | null> {
    const story = await Story.findById(storyId);
    if (!story) return null;

    const isLiked = story.likedUsers.includes(userId as any);

    return await Story.findByIdAndUpdate(
      storyId,
      isLiked 
        ? { $pull: { likedUsers: userId } }
        : { $addToSet: { likedUsers: userId } },
      { new: true }
    ).populate("likedUsers viewedUsers", "username profile_picture");
  }

  


  
}
