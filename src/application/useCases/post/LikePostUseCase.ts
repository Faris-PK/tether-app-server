import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { IPost } from '../../../domain/entities/Post';

export class LikePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(postId: string, userId: string): Promise<IPost> {
    const isLiked = await this.postRepository.isLikedByUser(postId, userId);
    
    if (isLiked) {
      const updatedPost = await this.postRepository.unlikePost(postId, userId);
      if (!updatedPost) throw new Error('Failed to unlike post');
      return updatedPost;
    } else {
      const updatedPost = await this.postRepository.likePost(postId, userId);
      if (!updatedPost) throw new Error('Failed to like post');
      return updatedPost;
    }
  }
}