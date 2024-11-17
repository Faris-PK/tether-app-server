import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { UpdateProductDTO } from '../../dto/UpdateProductDTO ';
import { Product } from '../../../domain/entities/Product';

export class UpdateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private s3Service: S3Service
  ) {}

  async execute(productId: string, userId: string, productData: UpdateProductDTO, files?: Express.Multer.File[]): Promise<any> {
    try {
      const existingProduct = await this.productRepository.findById(productId);
      
      if (!existingProduct) {
        throw new Error('Product not found');
      }
      
      if (existingProduct.userId._id.toString() !== userId) {
        throw new Error('Unauthorized to update this product');
      }

      if (productData.location && 
          (!productData.location.name || 
           !productData.location.coordinates?.latitude || 
           !productData.location.coordinates?.longitude)) {
        throw new Error('Invalid location data');
      }

      // Parse existingImages from the request
      let existingImages: string[] = [];
      if (productData.existingImages) {
        try {
          existingImages = JSON.parse(productData.existingImages as string);
        } catch (error) {
          console.error('Error parsing existingImages:', error);
          existingImages = [];
        }
      }

      // Upload new images if any
      let newUploadedImages: string[] = [];
      if (files && files.length > 0) {
        const uploadPromises = files.map(file => 
          this.s3Service.uploadFile(file, 'products')
        );
        const uploadResults = await Promise.all(uploadPromises);
        newUploadedImages = uploadResults.map(result => result.Location);
      }

      // Combine existing and new images
      const finalImages = [...existingImages, ...newUploadedImages];

      // Remove deleted images from S3
      const deletedImages = existingProduct.images.filter(img => !existingImages.includes(img));
      await Promise.all(
        deletedImages.map(imageUrl => this.s3Service.deleteFile(imageUrl))
      );

      const updatedData = {
        ...productData,
        images: finalImages,
      };

      return await this.productRepository.update(productId, updatedData);
    } catch (error) {
      // Cleanup any newly uploaded images if there's an error
      if (files) {
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
      }
      
      throw error;
    }
  }
}