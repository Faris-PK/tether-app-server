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

  async findAll(filters?: any): Promise<IProduct[]> {
    let query = Product.find({ isBlocked: false });

    // Exclude current user's products
    if (filters?.excludeUserId) {
      query = query.find({ userId: { $ne: filters.excludeUserId } });
    }

    if (filters) {
      if (filters.search) {
        query = query.find({
          $or: [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } }
          ]
        });
      }

      if (filters.category) {
        query = query.find({ category: filters.category });
      }

      if (filters.minPrice || filters.maxPrice) {
        const priceFilter: any = {};
        if (filters.minPrice) priceFilter.$gte = filters.minPrice;
        if (filters.maxPrice) priceFilter.$lte = filters.maxPrice;
        query = query.find({ price: priceFilter });
      }

      if (filters.location) {
        query = query.find({ location: { $regex: filters.location, $options: 'i' } });
      }
    }

    return await query
      .populate('userId', 'username profile_picture')
      .sort({ createdAt: -1 })
      .lean();
  }
}
