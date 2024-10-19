import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { IPost } from '../../../domain/entities/Post';

export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(postId: string, userId: string, updateData: { caption?: string; location?: string }): Promise<IPost> {
    const existingPost = await this.postRepository.findById(postId);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (existingPost.userId.toString() !== userId) {
      throw new Error('Unauthorized to update this post');
    }

    const updatedPost = await this.postRepository.update(postId, updateData);

    if (!updatedPost) {
      throw new Error('Failed to update post');
    }

    return updatedPost;
  }
}
