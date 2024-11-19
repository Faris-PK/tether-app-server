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

  async updateStatus(productId: string, isBlocked: boolean): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      productId,
      { isBlocked },
      { new: true }
    ).populate('userId', 'username profile_picture');
  }

  
  async findAllProducts(): Promise<any[]> {
    return await Product.find()
      .populate('userId', 'username profile_picture')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findAll({ 
    page = 1, 
    limit = 8, 
    excludeUserId,
    search,
    minPrice,
    maxPrice,
    category,
    dateSort
  }: {
    page: number;
    limit: number;
    excludeUserId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    dateSort?: string;
  }): Promise<{
    products: IProduct[];
    totalProducts: number;
    totalPages: number;
  }> {
    const query = Product.find({ isBlocked: false, isApproved: true });
  
    // Apply filters
    if (excludeUserId) {
      query.find({ userId: { $ne: excludeUserId } });
    }
  
    // Search filter
    if (search) {
      query.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }
  
    // Price range filter
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.find({ 
        price: { 
          $gte: minPrice, 
          $lte: maxPrice 
        } 
      });
    } else if (minPrice !== undefined) {
      query.find({ price: { $gte: minPrice } });
    } else if (maxPrice !== undefined) {
      query.find({ price: { $lte: maxPrice } });
    }
  
    // Category filter
    if (category) {
      query.find({ category });
    }
  
    // Sorting
    if (dateSort === 'newest') {
      query.sort({ createdAt: -1 });
    } else if (dateSort === 'oldest') {
      query.sort({ createdAt: 1 });
    } else {
      query.sort({ createdAt: -1 });
    }
  
    const skip = (page - 1) * limit;
  
    const [products, totalProducts] = await Promise.all([
      query
        .populate('userId', 'username profile_picture')
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query.getFilter())
    ]);
  
    const totalPages = Math.ceil(totalProducts / limit);
  
    return {
      products,
      totalProducts,
      totalPages
    };
  }
}
