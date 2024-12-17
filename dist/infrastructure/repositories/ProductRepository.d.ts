import { IProduct } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/interfaces/IProductRepository';
export declare class ProductRepository implements IProductRepository {
    save(product: IProduct): Promise<IProduct>;
    findById(id: string): Promise<IProduct | null>;
    findByUserId(userId: string): Promise<IProduct[]>;
    update(id: string, productData: Partial<IProduct>): Promise<IProduct | null>;
    delete(id: string): Promise<void>;
    updateStatus(productId: string, isBlocked: boolean): Promise<IProduct | null>;
    findAllProducts(): Promise<any[]>;
    findAll({ page, limit, excludeUserId, search, minPrice, maxPrice, category, dateSort, locationFilter }: {
        page: number;
        limit: number;
        excludeUserId?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        category?: string;
        dateSort?: string;
        locationFilter?: {
            latitude: number;
            longitude: number;
            radius: number;
        };
    }): Promise<{
        products: IProduct[];
        totalProducts: number;
        totalPages: number;
    }>;
}
