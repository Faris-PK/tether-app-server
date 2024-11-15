import { Types } from 'mongoose';
import { Product, IProduct } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/interfaces/IProductRepository';

export class ProductRepository implements IProductRepository {
  async save(product: IProduct): Promise<IProduct> {
    return await product.save();
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id).populate('userId', 'username profile_picture');
  }

  async findByUserId(userId: string): Promise<IProduct[]> {
    return await Product.find({ userId }).populate('userId', 'username profile_picture');
  }

  async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Product.findByIdAndDelete(id);
  }

  async findAll(filters?: { excludeUserId?: string }): Promise<IProduct[]> {
    const query = Product.find({ isBlocked: false });

    if (filters?.excludeUserId) {
      query.find({ userId: { $ne: filters.excludeUserId } });
    }

    return await query
      .populate('userId', 'username profile_picture')
      .sort({ createdAt: -1 })
      .lean();
  }
}
