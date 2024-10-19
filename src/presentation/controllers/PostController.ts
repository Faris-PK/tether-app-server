import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../application/useCases/post/CreatePostUseCase';
import { UpdatePostUseCase } from '../../application/useCases/post/UpdatePostUseCase';
import { DeletePostUseCase } from '../../application/useCases/post/DeletePostUseCase';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { CreatePostDTO } from '../../application/dto/CreatePostDTO';
import { UpdatePostDTO } from '../../application/dto/UpdatePostDTO';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export class PostController {
  private createPostUseCase: CreatePostUseCase;
  private updatePostUseCase: UpdatePostUseCase;
  private deletePostUseCase: DeletePostUseCase;

  constructor(
    private postRepository: PostRepository,
    private s3Service: S3Service,
    private userRepository: UserRepository

  ) {
    this.createPostUseCase = new CreatePostUseCase(postRepository, s3Service);
    this.updatePostUseCase = new UpdatePostUseCase(postRepository, s3Service);
    this.deletePostUseCase = new DeletePostUseCase(postRepository, s3Service, userRepository);
  }

  async createPost(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const file = req.file;
      let { caption, audience, postType, location } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const postData: CreatePostDTO = {
        userId,
        caption,
        postType,
        location,
        audience,
      };
      const newPost = await this.createPostUseCase.execute(postData, file);
      if(newPost) {
        console.log(' Post id:', newPost)
      }
      return res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async getPosts(req: Request, res: Response) {
    try {
      const userId = req.userId; 
      let posts;
      if (userId) {
         posts = await this.postRepository.findWithUserDetails(userId);
      } 
      
      return res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const postId = req.params.id;
      const file = req.file;
      let { caption, audience, postType, location } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const postData: UpdatePostDTO = {
        userId,
        caption,
        postType,
        location,
        audience,
        mediarUrl: ''
      };

      const updatedPost = await this.updatePostUseCase.execute(postId, postData, file);
      
      return res.status(200).json(updatedPost);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const postId = req.params.id;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      await this.deletePostUseCase.execute(postId, userId);
      
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
}