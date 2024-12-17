"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const mongoose_1 = require("mongoose");
const Admin_1 = require("../../domain/entities/Admin");
const User_1 = require("../../domain/entities/User");
const Post_1 = require("../../domain/entities/Post");
const Product_1 = require("../../domain/entities/Product");
class AdminRepository {
    async findByEmail(email) {
        return await Admin_1.Admin.findOne({ email });
    }
    async findAllUsers({ page = 1, limit = 10, searchTerm = '', sortField = 'createdAt', sortOrder = 'desc' } = {}) {
        const query = User_1.User.find();
        if (searchTerm) {
            query.find({
                $or: [
                    { username: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } }
                ]
            });
        }
        const sortOptions = {
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
            User_1.User.countDocuments(query.getFilter())
        ]);
        const totalPages = Math.ceil(totalUsers / limit);
        return {
            users,
            totalUsers,
            totalPages
        };
    }
    async toggleUserBlockStatus(userId, blockStatus) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        const updatedUser = await User_1.User.findByIdAndUpdate(objectId, { isBlocked: blockStatus }, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    async findAllPosts({ page = 1, limit = 10, searchTerm = '', sortField = 'createdAt', sortOrder = 'desc' } = {}) {
        const query = Post_1.Post.find();
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
        const sortOptions = {
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
            Post_1.Post.countDocuments(query.getFilter())
        ]);
        const totalPages = Math.ceil(totalPosts / limit);
        return {
            posts,
            totalPosts,
            totalPages
        };
    }
    async togglePostBlockStatus(postId, blockStatus) {
        const objectId = new mongoose_1.Types.ObjectId(postId);
        const updatedPost = await Post_1.Post.findByIdAndUpdate(objectId, { isBlocked: blockStatus }, { new: true });
        if (!updatedPost) {
            throw new Error('Post not found');
        }
        return updatedPost;
    }
    async findAllProducts({ page = 1, limit = 10, search, sortOrder = 'desc', category, minPrice, maxPrice } = {}) {
        try {
            const query = {};
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
            }
            else if (minPrice !== undefined) {
                query.price = { $gte: minPrice };
            }
            else if (maxPrice !== undefined) {
                query.price = { $lte: maxPrice };
            }
            // Category filter
            if (category) {
                query.category = category;
            }
            // Sorting
            // Sorting
            const sortOptions = {
                createdAt: sortOrder === 'asc' ? 1 : -1,
                caption: sortOrder === 'asc' ? 1 : -1,
                location: sortOrder === 'asc' ? 1 : -1
            };
            // Pagination
            const skip = (page - 1) * limit;
            // Fetch products
            const products = await Product_1.Product.find(query)
                .populate('userId', 'username profile_picture')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean();
            // Count total products
            const totalProducts = await Product_1.Product.countDocuments(query);
            const totalPages = Math.ceil(totalProducts / limit);
            return {
                products,
                totalProducts,
                totalPages
            };
        }
        catch (error) {
            console.error('Error in findAllProducts:', error);
            throw error;
        }
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=AdminRepository.js.map