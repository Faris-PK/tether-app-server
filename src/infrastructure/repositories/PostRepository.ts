import { Post, IPost } from '../../domain/entities/Post';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';

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
      .lean();
  }

  async update(id: string, postData: Partial<IPost>): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(id, postData, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Post.findByIdAndDelete(id);
  }
}