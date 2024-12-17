"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const mongoose_1 = require("mongoose");
const Product_1 = require("../../domain/entities/Product");
class ProductRepository {
    async save(product) {
        return await product.save();
    }
    async findById(id) {
        return await Product_1.Product.findById(id).populate('userId', 'username profile_picture');
    }
    async findByUserId(userId) {
        return await Product_1.Product.find({ userId }).populate('userId', 'username profile_picture');
    }
    async update(id, productData) {
        return await Product_1.Product.findByIdAndUpdate(id, productData, { new: true });
    }
    async delete(id) {
        await Product_1.Product.findByIdAndDelete(id);
    }
    async updateStatus(productId, isBlocked) {
        return await Product_1.Product.findByIdAndUpdate(productId, { isBlocked }, { new: true }).populate('userId', 'username profile_picture');
    }
    async findAllProducts() {
        return await Product_1.Product.find()
            .populate('userId', 'username profile_picture')
            .sort({ createdAt: -1 })
            .lean();
    }
    async findAll({ page = 1, limit = 8, excludeUserId, search, minPrice, maxPrice, category, dateSort, locationFilter }) {
        var _a;
        try {
            const query = {
                isBlocked: false,
                isApproved: true
            };
            // Apply filters
            if (excludeUserId) {
                query.userId = { $ne: new mongoose_1.Types.ObjectId(excludeUserId) };
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
            const aggregationPipeline = [
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
            }
            else if (dateSort === 'oldest') {
                aggregationPipeline.push({ $sort: { createdAt: 1 } });
            }
            else {
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
            const [results] = await Product_1.Product.aggregate(aggregationPipeline);
            const products = results.products;
            const totalProducts = ((_a = results.totalProducts[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            const totalPages = Math.ceil(totalProducts / limit);
            return {
                products,
                totalProducts,
                totalPages
            };
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map