import { IProduct } from '../entities/Product';

export interface IProductRepository {
  save(product: IProduct): Promise<IProduct>;
  findById(id: string): Promise<IProduct | null>;
  findByUserId(userId: string): Promise<IProduct[]>;
  update(id: string, productData: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<void>;
  findAll(filters?: any): Promise<IProduct[]>;
}