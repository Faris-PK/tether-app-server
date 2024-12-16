import { Types } from 'mongoose';
import { Admin, IAdmin } from '../../domain/entities/Admin';
import { IUser, User } from '../../domain/entities/User';
import { IAdminRepository } from '../../domain/interfaces/IAdminRepository';
import { IPost, Post } from '../../domain/entities/Post';
import { IProduct, Product } from '../../domain/entities/Product';

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  }
  async findAllUsers({
    page = 1, 
    limit = 10,
    searchTerm = '',
    sortField = 'createdAt',
    sortOrder = 'desc'
  }: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    users: IUser[];
    totalUsers: number;
    totalPages: number;
  }> {
    const query = User.find();

    if (searchTerm) {
      query.find({
        $or: [
          { username: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }

    const sortOptions: { [key: string]: 1 | -1 } = {
      createdAt: sortOrder === 'asc' ? 1 : -1,
      username: sortOrder === 'asc' ? 1 : -1,
      email: sortOrder === 'asc' ? 1 : -1
    };

    const skip = (page - 1) * limit;
    const [users, totalUsers] = await Promise.all([
      query
        .select('username email profile_picture bio isBlocked createdAt') 
        .sort(sortOptions[sortField] ? { [sortField]: sortOptions[sortField] } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query.getFilter())
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      totalUsers,
      totalPages
    };
  }

  async toggleUserBlockStatus(userId: string, blockStatus: boolean): Promise<IUser> {
    const objectId = new Types.ObjectId(userId);
    const updatedUser = await User.findByIdAndUpdate(
      objectId, 
      { isBlocked: blockStatus }, 
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async findAllPosts({
    page = 1,
    limit = 10,
    searchTerm = '',
    sortField = 'createdAt',
    sortOrder = 'desc'
  }: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    posts: IPost[];
    totalPosts: number;
    totalPages: number;
  }> {
    const query = Post.find();

    // Search filter for caption or location
    if (searchTerm) {
      query.find({
        $or: [
          { caption: { $regex: searchTerm, $options: 'i' } },
          { location: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }

    // Sorting
    const sortOptions: { [key: string]: 1 | -1 } = {
      createdAt: sortOrder === 'asc' ? 1 : -1,
      caption: sortOrder === 'asc' ? 1 : -1,
      location: sortOrder === 'asc' ? 1 : -1
    };

    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      query
        .select('userId caption mediaUrl postType location likes isBlocked createdAt commentCount') 
        .populate('userId', 'username profile_picture')
        .sort(sortOptions[sortField] ? { [sortField]: sortOptions[sortField] } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query.getFilter())
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts,
      totalPosts,
      totalPages
    };
  }

  async togglePostBlockStatus(postId: string, blockStatus: boolean): Promise<IPost> {
    const objectId = new Types.ObjectId(postId);
    const updatedPost = await Post.findByIdAndUpdate(
      objectId,
      { isBlocked: blockStatus },
      { new: true }
    );

    if (!updatedPost) {
      throw new Error('Post not found');
    }

    return updatedPost;
  }

  async findAllProducts({
    page = 1,
    limit = 10,
    search,
    sortOrder = 'desc',
    category,
    minPrice,
    maxPrice
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sortOrder?: 'asc' | 'desc';
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  } = {}): Promise<{
    products: IProduct[];
    totalProducts: number;
    totalPages: number;
  }> {
    try {
      const query: any = {};
      
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

      // Sorting
    // Sorting
    const sortOptions: { [key: string]: 1 | -1 } = {
      createdAt: sortOrder === 'asc' ? 1 : -1,
      caption: sortOrder === 'asc' ? 1 : -1,
      location: sortOrder === 'asc' ? 1 : -1
    };

      // Pagination
      const skip = (page - 1) * limit;

      // Fetch products
      const products = await Product.find(query)
        .populate('userId', 'username profile_picture')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();

      // Count total products
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        products,
        totalProducts,
        totalPages
      };
    } catch (error) {
      console.error('Error in findAllProducts:', error);
      throw error;
    }
  }
}