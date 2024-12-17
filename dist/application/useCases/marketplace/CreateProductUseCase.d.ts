import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { CreateProductDTO } from '../../dto/CreateProductDTO';
export declare class CreateProductUseCase {
    private productRepository;
    private s3Service;
    constructor(productRepository: IProductRepository, s3Service: S3Service);
    execute(productData: CreateProductDTO, files: Express.Multer.File[]): Promise<any>;
}
