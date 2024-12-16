import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../application/useCases/post/CreatePostUseCase';
import { DeletePostUseCase } from '../../application/useCases/post/DeletePostUseCase';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { CreatePostDTO } from '../../application/dto/CreatePostDTO';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { UpdatePostUseCase } from '../../application/useCases/post/UpdatePostUseCase';
import { ReportPostUseCase } from '../../application/useCases/post/ReportPostUseCase';
import { ReportRepository } from '../../infrastructure/repositories/ReportRepository';
import { UpdateCommentUseCase } from '../../application/useCases/post/UpdateCommentUseCase';
import { GetCommentsUseCase } from '../../application/useCases/post/GetCommentsUseCase';
import { DeleteCommentUseCase } from '../../application/useCases/post/DeleteCommentUseCase';
import { CommentRepository } from '../../infrastructure/repositories/CommentRepository';
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';
import { LikePostNotificationUseCase } from '../../application/useCases/post/LikePostNotificationUseCase';
import { CreateCommentNotificationUseCase } from '../../application/useCases/post/CreateCommentNotificationUseCase';



export class PostController {
  private createPostUseCase: CreatePostUseCase;
  private deletePostUseCase: DeletePostUseCase;
  private updatePostUseCase: UpdatePostUseCase;
  private reportPostUseCase: ReportPostUseCase;
  private getCommentsUseCase: GetCommentsUseCase;
  private updateCommentUseCase: UpdateCommentUseCase;
  private deleteCommentUseCase: DeleteCommentUseCase;
  private likePostNotificationUseCase: LikePostNotificationUseCase;
  private createCommentNotificationUseCase: CreateCommentNotificationUseCase; 


  constructor(
    private postRepository: PostRepository,
    private s3Service: S3Service,
    private userRepository: UserRepository,
    private commentRepository: CommentRepository,
    private reportRepository: ReportRepository,
    private notificationRepository: NotificationRepository

  ) {
    this.createPostUseCase = new CreatePostUseCase(postRepository, s3Service);
    this.deletePostUseCase = new DeletePostUseCase(postRepository, s3Service, userRepository);
    this.updatePostUseCase = new UpdatePostUseCase(postRepository);
    this.reportPostUseCase = new ReportPostUseCase(reportRepository, postRepository);
    this.getCommentsUseCase = new GetCommentsUseCase(commentRepository);
    this.updateCommentUseCase = new UpdateCommentUseCase(commentRepository);
    this.deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);
    this.likePostNotificationUseCase = new LikePostNotificationUseCase(
      postRepository, 
      notificationRepository, 
      userRepository
    );
    this.createCommentNotificationUseCase = new CreateCommentNotificationUseCase(
      commentRepository,
      postRepository,
      notificationRepository,
      userRepository
    );
    
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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const result = await this.postRepository.findAllRelevantPosts({
        userId,
        page,
        limit
      });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async getPostsForProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId; 
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

      const updatedPost = await this.likePostNotificationUseCase.execute(postId, userId);

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
    //  console.log( 'userId : ', userId);
    //   console.log( 'postId : ', postId);
     // console.log( 'reason : ', reason);
      

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

  async getComments(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const comments = await this.getCommentsUseCase.execute(postId);
      console.log(comments);
      
      
      return res.status(200).json({
        success: true,
        message: 'Comments retrieved successfully',
        data: comments
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
  }

  async createComment(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const postId = req.params.postId;
      const { content } = req.body;

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required' });
      }

      const comment = await this.createCommentNotificationUseCase.execute(postId, userId, content);

      return res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: comment
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { postId, commentId } = req.params;
      const { content } = req.body;

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required' });
      }

      const updatedComment = await this.updateCommentUseCase.execute(commentId, userId, content);
      
      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: updatedComment
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
  }

async createReplyComment(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { postId, parentCommentId } = req.params;
      const { content } = req.body;

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required' });
      }

      const comment = await this.createCommentNotificationUseCase.execute(
        postId, 
        userId, 
        content, 
        parentCommentId
      );

      return res.status(201).json({
        success: true,
        message: 'Reply created successfully',
        data: comment
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
  }


  async deleteComment(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { postId, commentId } = req.params;

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      await this.deleteCommentUseCase.execute(commentId, userId);

      // Delete associated notifications
      await this.notificationRepository.deleteCommentNotification(commentId);

      return res.status(200).json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
  }

  async getSinglePost (req: Request, res: Response) {
    try {
      const postId = req.params.postId;
       console.log('post Id:  ', postId)
      if (!postId) {
        return res.status(400).json({ success: false, message: 'Post ID is required' });
      }

      const post = await this.postRepository.findById(postId)
      console.log('Fetched singlepost : ', post)
      return res.status(200).json(post);

    } catch (error) {
      return res.status(400).json({ message: 'error occured while fetching post' });
    }
  }
}  