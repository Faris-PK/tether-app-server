import { Post, IPost } from '../../../domain/entities/Post';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { User } from '../../../domain/entities/User'; // Import the User model
import { S3Service } from '../../../infrastructure/services/S3Service';
import { CreatePostDTO } from '../../dto/CreatePostDTO';
import { Types } from 'mongoose';  // Import Types for ObjectId

export class CreatePostUseCase {
  constructor(
    private postRepository: PostRepository,
    private s3Service: S3Service
  ) {}

  async execute(postData: CreatePostDTO, file?: Express.Multer.File): Promise<IPost> {
    let mediaUrl: string | undefined;

    if (file && (postData.postType === 'image' || postData.postType === 'video')) {
      const uploadResult = await this.s3Service.uploadFile(file, `posts/${postData.postType}s`);
      mediaUrl = uploadResult.Location;
    } else {
      // If there's no file, ensure the postType is set to 'note'
      postData.postType = 'note';
    }

    const newPost = new Post({
      ...postData,
      mediaUrl,
    });

    const savedPost = await this.postRepository.save(newPost);

    // Update the user's post list
    const user = await User.findById(postData.userId);
    if (user) {
      user.posts.push(savedPost._id as Types.ObjectId); // Explicitly cast savedPost._id to ObjectId
      await user.save(); // Save the updated user
    }

    return savedPost;
  }
}
