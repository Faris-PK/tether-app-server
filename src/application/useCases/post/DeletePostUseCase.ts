import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { Types } from 'mongoose';

export class DeletePostUseCase {
  constructor(
    private postRepository: PostRepository,
    private s3Service: S3Service,
    private userRepository: UserRepository
  ) {}

  async execute(postId: string, userId: string): Promise<void> {
    const existingPost = await this.postRepository.findById(postId);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (existingPost.userId.toString() !== userId) {
      throw new Error('Unauthorized to delete this post');
    }

    // Delete associated file if it exists
    if (existingPost.mediaUrl) {
      await this.s3Service.deleteFile(existingPost.mediaUrl);
    }

    // Delete the post
    await this.postRepository.delete(postId);

    // Remove the post ID from the user's posts array
    const user = await this.userRepository.findById(userId);
    console.log('user for deleting the post: ',user);
    
    if (user) {
      user.posts = user.posts.filter((id) => id.toString() !== postId);
      await this.userRepository.save(user);
    }
  }
}