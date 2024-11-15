import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/useCases/marketplace/CreateProductUseCase';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { CreateProductDTO } from '../../application/dto/CreateProductDTO';

interface FilterParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: 'price' | 'date';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

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
      const { 
        title, 
        price, 
        category, 
        location, 
        description 
      } = req.body;
    //  console.log('req.body : ', req.body)

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Parse location object from request body
      let locationData;
      try {
        locationData = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (error) {
      //  console.log('Invalid location format');
        
        return res.status(400).json({ message: 'Invalid location format' });
      }

      const productData: CreateProductDTO = {
        userId,
        title,
        price: Number(price),
        category,
        location: locationData,
        description
      };

      const newProduct = await this.createProductUseCase.execute(productData, files);
      
      return res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const currentUserId = req.userId;
      
      const products = await this.productRepository.findAll({ excludeUserId: currentUserId });
      return res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserProducts(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
   //  // console.log( ' userID from getUserProducts : ', userId)
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const products = await this.productRepository.findByUserId(userId);
     // console.log( 'Products : ', products)
      return res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}