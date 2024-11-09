import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { CreateProductDTO } from '../../dto/CreateProductDTO';
import { Product } from '../../../domain/entities/Product';

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private s3Service: S3Service
  ) {}

  async execute(productData: CreateProductDTO, files: Express.Multer.File[]): Promise<any> {
    try {
      // Upload images to S3
      const uploadPromises = files.map(file => 
        this.s3Service.uploadFile(file, 'products')
      );
      
      const uploadResults = await Promise.all(uploadPromises);
      
      // Extract the image URLs from the upload results
      const imageUrls = uploadResults.map(result => result.Location);

      const product = new Product({
        ...productData,
        images: imageUrls,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      // Clean up any uploaded images if there's an error
      try {
        const uploadedImages = files.map(file => file.filename).filter(Boolean);
        await Promise.all(
          uploadedImages.map(imageUrl => 
            this.s3Service.deleteFile(imageUrl)
          )
        );
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded files:', cleanupError);
      }
      
      throw error;
    }
  }
}