import { IProduct } from '../entities/Product';
export interface IProductRepository {
    save(product: IProduct): Promise<IProduct>;
    findById(id: string): Promise<IProduct | null>;
    findByUserId(userId: string): Promise<IProduct[]>;
    update(id: string, productData: Partial<IProduct>): Promise<IProduct | null>;
    delete(id: string): Promise<void>;
    findAll(options: {
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
