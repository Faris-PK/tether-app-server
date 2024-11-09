import { Types } from 'mongoose';
import { Post, IPost } from '../../domain/entities/Post';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { User } from '../../domain/entities/User';

export class PostRepository implements IPostRepository {
  async save(post: IPost): Promise<IPost> {
    return await post.save();
  }

  async findById(id: string): Promise<IPost | null> {
    return await Post.findById(id);
  }

  async findByUserId(userId: string): Promise<IPost[]> {
    return await Post.find({ userId });
  }

  async findWithUserDetails(userId: string): Promise<any[]> {
    return await Post.find({ userId })
      .populate('userId', 'username profile_picture')
      .populate('commentCount')
      .lean();
  }

  async update(id: string, postData: Partial<IPost>): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(id, postData, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Post.findByIdAndDelete(id);
  }

  async likePost(postId: string, userId: string): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  async unlikePost(postId: string, userId: string): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
  }

  async isLikedByUser(postId: string, userId: string): Promise<boolean> {
    const post = await Post.findById(postId);
    return post ? post.likes.includes(new Types.ObjectId(userId)) : false;
  }

  async findUserPosts(userId: string): Promise<any[]> {
    return await Post.find({ userId })
      .populate('userId', 'username profile_picture')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findFollowingPosts(userId: string): Promise<any[]> {
    // First find the user to get their following list
    const user = await User.findById(userId).select('following');
    if (!user) return [];

    // Find posts from followed users
    return await Post.find({
      userId: { $in: user.following }
    })
    .populate('userId', 'username profile_picture')
    .sort({ createdAt: -1 }) // Sort by newest first
    .lean();
  }

  async findAllRelevantPosts(userId: string): Promise<any[]> {
    // Get user's following list
    const user = await User.findById(userId).select('following');
    if (!user) return [];

    // Find posts from both the user and their followed users
    return await Post.find({
      $or: [
        { userId: userId }, // User's own posts
        { userId: { $in: user.following } } // Posts from followed users
      ]
    })
    .populate('userId', 'username profile_picture')
    .populate('commentCount')
    .sort({ createdAt: -1 })
    .lean();
  }

  async findAllPosts(): Promise<any[]> {
    return await Post.find()
      .populate('userId', 'username profile_picture')
      .populate('commentCount')
      .sort({ createdAt: -1 })
      .lean();
  }

  async blockPost(postId: string): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(
      postId,
      { isBlocked: true },
      { new: true }
    );
  }

  async unblockPost(postId: string): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(
      postId,
      { isBlocked: false },
      { new: true }
    );
  }

}