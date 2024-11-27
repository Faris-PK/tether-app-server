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
    dateSort,
    locationFilter
  }: {
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
    }
  }): Promise<{
    products: IProduct[];
    totalProducts: number;
    totalPages: number;
  }> {
    try {
      const query: any = { 
        isBlocked: false, 
        isApproved: true 
      };
      
      // Apply filters
      if (excludeUserId) {
        query.userId = { $ne: new Types.ObjectId(excludeUserId) };
      }
  
      // Search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
  
      // Price range filter
      if (minPrice !== undefined && maxPrice !== undefined) {
        query.price = { 
          $gte: minPrice, 
          $lte: maxPrice 
        };
      } else if (minPrice !== undefined) {
        query.price = { $gte: minPrice };
      } else if (maxPrice !== undefined) {
        query.price = { $lte: maxPrice };
      }
  
      // Category filter
      if (category) {
        query.category = category;
      }
  
      const aggregationPipeline: any[] = [
        { $match: query }
      ];
  
      // Location filter
      if (locationFilter) {
        const { latitude, longitude, radius } = locationFilter;
        
        aggregationPipeline.push({
          $addFields: {
            distance: {
              $multiply: [
                {
                  $acos: {
                    $add: [
                      { 
                        $multiply: [
                          { $sin: { $degreesToRadians: latitude } },
                          { $sin: { $degreesToRadians: '$location.coordinates.latitude' } }
                        ]
                      },
                      {
                        $multiply: [
                          { $cos: { $degreesToRadians: latitude } },
                          { $cos: { $degreesToRadians: '$location.coordinates.latitude' } },
                          { $cos: { $degreesToRadians: { $subtract: [longitude, '$location.coordinates.longitude'] } } }
                        ]
                      }
                    ]
                  }
                },
                6371 // Earth's radius in kilometers
              ]
            }
          }
        });
  
        // Filter by radius
        aggregationPipeline.push({
          $match: {
            distance: { $lte: radius }
          }
        });
      }
  
      // Sorting
      if (dateSort === 'newest') {
        aggregationPipeline.push({ $sort: { createdAt: -1 } });
      } else if (dateSort === 'oldest') {
        aggregationPipeline.push({ $sort: { createdAt: 1 } });
      } else {
        aggregationPipeline.push({ $sort: { createdAt: -1 } });
      }
  
      // Facet for pagination and total count
      aggregationPipeline.push({
        $facet: {
          products: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { 
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
              }
            },
            {
              $unwind: '$user'
            },
            {
              $project: {
                'user.password': 0,
                'user.email': 0
              }
            }
          ],
          totalProducts: [{ $count: 'count' }]
        }
      });
  
      const [results] = await Product.aggregate(aggregationPipeline);
  
      const products = results.products;
      const totalProducts = results.totalProducts[0]?.count || 0;
      const totalPages = Math.ceil(totalProducts / limit);
  
      return {
        products,
        totalProducts,
        totalPages
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
  
}  
