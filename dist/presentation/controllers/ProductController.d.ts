import { Request, Response } from 'express';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
export declare class ProductController {
    private productRepository;
    private s3Service;
    private createProductUseCase;
    private updateProductUseCase;
    private deleteProductUseCase;
    private stripeService;
    constructor(productRepository: ProductRepository, s3Service: S3Service);
    createProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getUserProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createPromotionSession(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    handlePromotionSuccess(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
