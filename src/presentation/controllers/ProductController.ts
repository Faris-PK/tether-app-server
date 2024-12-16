import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/useCases/marketplace/CreateProductUseCase';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { CreateProductDTO } from '../../application/dto/CreateProductDTO';
import { StripeService } from '../../infrastructure/services/StripeService';
import { UpdateProductUseCase } from '../../application/useCases/marketplace/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../application/useCases/marketplace/DeleteProductUseCase';


export class ProductController {
  private createProductUseCase: CreateProductUseCase;
  private updateProductUseCase: UpdateProductUseCase;
  private deleteProductUseCase: DeleteProductUseCase;
  private stripeService: StripeService;


  constructor(
    private productRepository: ProductRepository,
    private s3Service: S3Service
  ) {
    this.createProductUseCase = new CreateProductUseCase(productRepository, s3Service);
    this.updateProductUseCase = new UpdateProductUseCase(productRepository, s3Service);
    this.deleteProductUseCase = new DeleteProductUseCase(productRepository, s3Service);
    this.stripeService = new StripeService(process.env.STRIPE_SECRET || '');

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
 
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      let locationData;
      try {
        locationData = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (error) {

        return res.status(400).json({ message: 'Invalid location format' });
      }

      const productData: CreateProductDTO = {
        userId,
        title,
        price: Number(price),
        category,
        location: locationData,
        description,
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


  async updateProduct(req: Request, res: Response) {
    try {
      
      const userId = req.userId;
      const productId = req.params.productId;
      const files = req.files as Express.Multer.File[];
      
      
      const { 
        title, 
        price, 
        category, 
        location, 
        description ,
        existingImages,
      } = req.body;
      

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Parse location object from request body
      let locationData;
      try {
        locationData = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (error) {
        return res.status(400).json({ message: 'Invalid location format' });
      }

      const productData = {
        title,
        price: Number(price),
        category,
        location: locationData,
        description,
        existingImages
      };
     // console.log('productData : ',productData);
      

      const updatedProduct = await this.updateProductUseCase.execute(
        productId,
        userId,
        productData,
        files
      );

     // console.log(' updatedProduct : ', updatedProduct);
      
      
      return res.status(200).json(updatedProduct);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const productId = req.params.productId;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      await this.deleteProductUseCase.execute(productId, userId);
      
      return res.status(200).json({ message: 'Product deleted successfully' });
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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const search = req.query.search as string | undefined;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const category = req.query.category as string | undefined;
      const dateSort = req.query.dateSort as string | undefined;
      const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
      const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;
      const radius = req.query.radius ? parseFloat(req.query.radius as string) : undefined;

  
      let locationFilter: { latitude: number; longitude: number; radius: number } | undefined;
      if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
        locationFilter = { latitude, longitude, radius };
      }
  
      const result = await this.productRepository.findAll({
        page,
        limit,
        excludeUserId: currentUserId,
        search,
        minPrice,
        maxPrice,
        category,
        dateSort,
        locationFilter
      });
      //console.log('results : ', result);
  
      return res.status(200).json(result);
      
      
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

  async createPromotionSession(req: Request, res: Response) {
    try {
    //  console.log( ' createPromotionSession function triggered')
      const { productId } = req.params;
      const userId = req.userId;
     // console.log('userId : ', userId)

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const product = await this.productRepository.findById(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.userId._id.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to promote this product' });
      }
      
     // console.log('verification completed');
      
      const sessionId = await this.stripeService.createPromotionCheckoutSession(
        userId,
        productId
      );
     //  console.log('sessionId : ', sessionId)
      return res.status(200).json({ sessionUrl: sessionId });
    } catch (error) {
      console.error('Promotion session creation error:', error);
      return res.status(500).json({ message: 'Error creating promotion session' });
    }
  }


  

  async handlePromotionSuccess(req: Request, res: Response) {
    try {
      console.log(' handlePromotionSuccess riggered')
      const { session_id } = req.query;
      console.log(' sessionid : ', session_id);
      

      if (!session_id || typeof session_id !== 'string') {
        return res.status(400).json({ message: 'Invalid session ID' });
      }

      const session = await this.stripeService.retrieveSession(session_id);
      const productId = session.metadata?.productId;

      if (!productId) {
        return res.status(400).json({ message: 'Product ID not found in session' });
      }

      
      const promotionExpiry = new Date();
      promotionExpiry.setDate(promotionExpiry.getDate() + 30);

    
      const updatedProduct = await this.productRepository.update(productId, {
        isPromoted: true,
        promotionExpiry
      });

      return res.status(200).json({
        message: "Product promotion activated successfully",
        data: {
          isPromoted: updatedProduct?.isPromoted,
          promotionExpiry: updatedProduct?.promotionExpiry
        }
      });
    } catch (error) {
      console.error('Promotion success handling error:', error);
      return res.status(500).json({ message: 'Error processing promotion payment' });
    }
  }
}