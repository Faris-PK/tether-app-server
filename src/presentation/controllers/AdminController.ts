import { Request, Response } from 'express';
import { AdminLoginUseCase } from '../../application/useCases/admin/AdminLoginUseCase';
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
    this.getUsersUseCase = new GetUsersUseCase(adminRepository);
    this.getPostsUseCase = new GetPostsUseCase(adminRepository);
    this.blockPostUseCase = new BlockPostUseCase(postRepository);
    this.unblockPostUseCase = new UnblockPostUseCase(postRepository);
    this.getAllReportsUseCase = new GetAllReportsUseCase(reportRepository);
    this.updateReportStatusUseCase = new UpdateReportStatusUseCase(reportRepository);
    this.getProductsUseCase = new GetProductsUseCase(adminRepository)

  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, admin } = await this.adminLoginUseCase.execute({ email, password });

      res.cookie('adminAccessToken', accessToken, { 
        httpOnly: true, 
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'none', 
        secure: true,     
        path: '/'
      });
      
      res.cookie('adminRefreshToken', refreshToken, { 
        httpOnly: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: 'none', 
        secure: true,
        path: '/'
      });

     // res.cookie('adminAccessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
     // res.cookie('adminRefreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      

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

  async getUsers(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        searchTerm = '', 
        sortField = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;

      const users = await this.getUsersUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        searchTerm: searchTerm as string,
        sortField: sortField as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      return res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async toggleUserBlock(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { block } = req.body;
  
      if (typeof block !== 'boolean') {
        return res.status(400).json({ message: 'Invalid block status' });
      }

      const user = await this.adminRepository.toggleUserBlockStatus(userId, block);
      
      return res.status(200).json({ 
        message: block ? 'User blocked successfully' : 'User unblocked successfully',
        user 
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPosts(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        searchTerm = '', 
        sortField = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;

      const posts = await this.getPostsUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        searchTerm: searchTerm as string,
        sortField: sortField as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      return res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async togglePostBlock(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { block } = req.body;
      console.log(postId, block);
      
  
      if (typeof block !== 'boolean') {
        return res.status(400).json({ message: 'Invalid block status' });
      }

      const user = await this.adminRepository.togglePostBlockStatus(postId, block);
      
      return res.status(200).json({ 
        message: block ? 'User blocked successfully' : 'User unblocked successfully',
        user 
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllReports(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter as string || 'all';
      const search = req.query.search as string || '';

      const reports = await this.getAllReportsUseCase.execute({
        page,
        limit,
        filter,
        search
      });
      return res.status(200).json(reports);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
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
      const { 
        page, 
        limit, 
        search, 
        sortOrder, 
        category, 
        minPrice, 
        maxPrice 
      } = req.query;
  
      const products = await this.getProductsUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        category: category as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
      });      
      return res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
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