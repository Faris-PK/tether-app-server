import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/useCases/marketplace/CreateProductUseCase';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { CreateProductDTO } from '../../application/dto/CreateProductDTO';

export class ProductController {
  private createProductUseCase: CreateProductUseCase;

  constructor(
    private productRepository: ProductRepository,
    private s3Service: S3Service
  ) {
    this.createProductUseCase = new CreateProductUseCase(productRepository, s3Service);
  }

  async createProduct(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const files = req.files as Express.Multer.File[];
      const { title, price, category, location, description } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const productData: CreateProductDTO = {
        userId,
        title,
        price: Number(price),
        category,
        location,
        description
      };
      

      const newProduct = await this.createProductUseCase.execute(productData, files);
      
      return res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const { search, category, minPrice, maxPrice, location } = req.query;
      const currentUserId = req.userId;
      
      const filters = {
        search: search as string,
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        location: location as string,
        excludeUserId: currentUserId
      };

      const products = await this.productRepository.findAll(filters);
      return res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
}
