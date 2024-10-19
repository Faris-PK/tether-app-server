import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { UpdatePostDTO } from '../../dto/UpdatePostDTO';
import { IPost } from '../../../domain/entities/Post';

export class UpdatePostUseCase {
  constructor(
    private postRepository: PostRepository,
    private s3Service: S3Service
  ) {}

  async execute(postId: string, postData: UpdatePostDTO, file?: Express.Multer.File): Promise<IPost> {
    const existingPost = await this.postRepository.findById(postId);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (existingPost.userId.toString() !== postData.userId) {
      throw new Error('Unauthorized to update this post');
    }

    let mediaUrl: string | undefined = existingPost.mediaUrl;

    if (file && (postData.postType === 'image' || postData.postType === 'video')) {
      // Delete old file if it exists
      if (existingPost.mediaUrl) {
        await this.s3Service.deleteFile(existingPost.mediaUrl);
      }

      // Upload new file
      const uploadResult = await this.s3Service.uploadFile(file, `posts/${postData.postType}s`);
      mediaUrl = uploadResult.Location;
    } else if (!file && postData.postType === 'note') {
      // If changing to a note post, remove the mediaUrl
      mediaUrl = undefined;
    }

    const updatedPost = {
      ...existingPost.toObject(),
      ...postData,
      mediaUrl,
    };

    const result = await this.postRepository.update(postId, updatedPost);
    
    if (!result) {
      throw new Error('Failed to update post');
    }

    return result;
  }
}