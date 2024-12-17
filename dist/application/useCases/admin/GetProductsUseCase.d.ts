import { ProductRepository } from '../../../infrastructure/repositories/ProductRepository';
import { IProduct } from '../../../domain/entities/Product';
export declare class GetUsersUseCase {
    private productRepository;
    constructor(productRepository: ProductRepository);
    execute(): Promise<IProduct[]>;
}
