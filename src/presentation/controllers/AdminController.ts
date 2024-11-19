import { Request, Response } from 'express';
import { AdminLoginUseCase } from '../../application/useCases/admin/AdminLoginUseCase';
import { BlockUserUseCase } from '../../application/useCases/admin/BlockUserUseCase';
import { UnblockUserUseCase } from '../../application/useCases/admin/UnblockUserUseCase';
import { AdminRepository } from '../../infrastructure/repositories/AdminRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { GetUsersUseCase } from '../../application/useCases/admin/GetUsersUseCase';
import { GetPostsUseCase } from '../../application/useCases/admin/GetPostsUseCase';
import { BlockPostUseCase } from '../../application/useCases/admin/BlockPostUseCase';
import { UnblockPostUseCase } from '../../application/useCases/admin/UnblockPostUseCase';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { GetAllReportsUseCase } from '../../application/useCases/admin/GetAllReportsUseCase';
import { UpdateReportStatusUseCase } from '../../application/useCases/admin/UpdateReportStatusUseCase';
import { ReportRepository } from '../../infrastructure/repositories/ReportRepository';
import { GetProductsUseCase } from '../../application/useCases/marketplace/GetProductsUseCase ';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';

export class AdminController {
  private adminLoginUseCase: AdminLoginUseCase;
  private blockUserUseCase: BlockUserUseCase;
  private unblockUserUseCase: UnblockUserUseCase;
  private getUsersUseCase: GetUsersUseCase;
  private getPostsUseCase: GetPostsUseCase;
  private blockPostUseCase: BlockPostUseCase;
  private unblockPostUseCase: UnblockPostUseCase;
  private getAllReportsUseCase: GetAllReportsUseCase;
  private updateReportStatusUseCase: UpdateReportStatusUseCase;
  private getProductsUseCase : GetProductsUseCase;




  constructor(
    private adminRepository: AdminRepository,
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private reportRepository: ReportRepository,
    private productRepository: ProductRepository
  ) {
    this.adminLoginUseCase = new AdminLoginUseCase(adminRepository);
    this.blockUserUseCase = new BlockUserUseCase(userRepository);
    this.unblockUserUseCase = new UnblockUserUseCase(userRepository);
    this.getUsersUseCase = new GetUsersUseCase(userRepository);
    this.getPostsUseCase = new GetPostsUseCase(postRepository);
    this.blockPostUseCase = new BlockPostUseCase(postRepository);
    this.unblockPostUseCase = new UnblockPostUseCase(postRepository);
    this.getAllReportsUseCase = new GetAllReportsUseCase(reportRepository);
    this.updateReportStatusUseCase = new UpdateReportStatusUseCase(reportRepository);
    this.getProductsUseCase = new GetProductsUseCase(productRepository)

  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
     // console.log('From body...',req.body);
      
      const { accessToken, refreshToken, admin } = await this.adminLoginUseCase.execute({ email, password });

      res.cookie('adminAccessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
      res.cookie('adminRefreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.status(200).json({ message: 'Admin login successful', admin });
    } catch (error) {
      if (error instanceof Error) {
        console.log('message', error.message);
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('adminAccessToken');
    res.clearCookie('adminRefreshToken');
    return res.status(200).json({ message: 'Admin logged out successfully' });
  }

  async blockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      await this.blockUserUseCase.execute(userId);
      return res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async unblockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      await this.unblockUserUseCase.execute(userId);
      return res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.getUsersUseCase.execute();
      return res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async getPosts(req: Request, res: Response) {
    try {
      const posts = await this.getPostsUseCase.execute();
      return res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async blockPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      await this.blockPostUseCase.execute(postId);
      return res.status(200).json({ message: 'Post blocked successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async unblockPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      await this.unblockPostUseCase.execute(postId);
      return res.status(200).json({ message: 'Post unblocked successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async getAllReports(req: Request, res: Response) {
    try {
      const filter = req.query.filter as string;
      const reports = await this.getAllReportsUseCase.execute(filter);
      return res.status(200).json(reports);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }

  async updateReportStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const report = await this.updateReportStatusUseCase.execute(id, status);
      return res.status(200).json(report);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.getProductsUseCase.execute();
    //  console.log('products : ', products);
      
      return res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async approveProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const product = await this.productRepository.update(productId, { isApproved: true });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json(product);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  async updateProductStatus(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { status } = req.body; 
      console.log(productId, status);
      
      
      if (!['block', 'unblock'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const isBlocked = status === 'block';
      const product = await this.productRepository.updateStatus(productId, isBlocked);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({
        message: `Product ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
        product
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
}