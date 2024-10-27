import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../application/useCases/post/CreatePostUseCase';
import { DeletePostUseCase } from '../../application/useCases/post/DeletePostUseCase';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { CreatePostDTO } from '../../application/dto/CreatePostDTO';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { LikePostUseCase } from '../../application/useCases/post/LikePostUseCase';
import { UpdatePostUseCase } from '../../application/useCases/post/UpdatePostUseCase';
import { ReportPostUseCase } from '../../application/useCases/post/ReportPostUseCase';
import { ReportRepository } from '../../infrastructure/repositories/ReportRepository';



export class PostController {
  private createPostUseCase: CreatePostUseCase;
  private deletePostUseCase: DeletePostUseCase;
  private updatePostUseCase: UpdatePostUseCase;
  private likePostUseCase: LikePostUseCase;
  private reportPostUseCase: ReportPostUseCase;

  constructor(
    private postRepository: PostRepository,
    private s3Service: S3Service,
    private userRepository: UserRepository,
    private reportRepository: ReportRepository
  ) {
    this.createPostUseCase = new CreatePostUseCase(postRepository, s3Service);
    this.deletePostUseCase = new DeletePostUseCase(postRepository, s3Service, userRepository);
    this.updatePostUseCase = new UpdatePostUseCase(postRepository);
    this.likePostUseCase = new LikePostUseCase(postRepository);
    this.reportPostUseCase = new ReportPostUseCase(reportRepository, postRepository);
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

  async getPostsForHome(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const type = req.query.type as string; // 'following' or 'all'
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      let posts;
      switch (type) {
        case 'following':
          // Get only posts from followed users
          posts = await this.postRepository.findFollowingPosts(userId);
          break;
        case 'profile':
          // Get only user's own posts
          posts = await this.postRepository.findWithUserDetails(userId);
          break;
        case 'all':
        default:
          // Get both user's posts and followed users' posts
          posts = await this.postRepository.findAllRelevantPosts(userId);
          break;
      }
      
      return res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async getPostsForProfile(req: Request, res: Response) {
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



  async deletePost(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const postId = req.params.id;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      await this.deletePostUseCase.execute(postId, userId);
     // console.log('What happend here');  
      return res.status(200).json({ message: 'Post deleted successfully' });
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
      const { caption, location } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const updatedPost = await this.updatePostUseCase.execute(postId, userId, { caption, location });
      
      return res.status(200).json(updatedPost);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async likePost(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const postId = req.params.id;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const updatedPost = await this.likePostUseCase.execute(postId, userId);
      return res.status(200).json(updatedPost);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async reportPost(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const postId = req.params.id;
      const { reason } = req.body;
      console.log( 'userId : ', userId);
      console.log( 'postId : ', postId);
      console.log( 'reason : ', reason);
      

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      if (!reason) {
        return res.status(400).json({ message: 'Reason is required' });
      }

      const report = await this.reportPostUseCase.execute(postId, userId, reason);
      return res.status(201).json(report);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
}  