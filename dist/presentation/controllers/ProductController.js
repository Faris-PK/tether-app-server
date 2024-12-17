"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const CreateProductUseCase_1 = require("../../application/useCases/marketplace/CreateProductUseCase");
const StripeService_1 = require("../../infrastructure/services/StripeService");
const UpdateProductUseCase_1 = require("../../application/useCases/marketplace/UpdateProductUseCase");
const DeleteProductUseCase_1 = require("../../application/useCases/marketplace/DeleteProductUseCase");
class ProductController {
    constructor(productRepository, s3Service) {
        this.productRepository = productRepository;
        this.s3Service = s3Service;
        this.createProductUseCase = new CreateProductUseCase_1.CreateProductUseCase(productRepository, s3Service);
        this.updateProductUseCase = new UpdateProductUseCase_1.UpdateProductUseCase(productRepository, s3Service);
        this.deleteProductUseCase = new DeleteProductUseCase_1.DeleteProductUseCase(productRepository, s3Service);
        this.stripeService = new StripeService_1.StripeService(process.env.STRIPE_SECRET || '');
    }
    async createProduct(req, res) {
        try {
            const userId = req.userId;
            const files = req.files;
            const { title, price, category, location, description } = req.body;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            let locationData;
            try {
                locationData = typeof location === 'string' ? JSON.parse(location) : location;
            }
            catch (error) {
                return res.status(400).json({ message: 'Invalid location format' });
            }
            const productData = {
                userId,
                title,
                price: Number(price),
                category,
                location: locationData,
                description,
            };
            const newProduct = await this.createProductUseCase.execute(productData, files);
            return res.status(201).json(newProduct);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async updateProduct(req, res) {
        try {
            const userId = req.userId;
            const productId = req.params.productId;
            const files = req.files;
            const { title, price, category, location, description, existingImages, } = req.body;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            // Parse location object from request body
            let locationData;
            try {
                locationData = typeof location === 'string' ? JSON.parse(location) : location;
            }
            catch (error) {
                return res.status(400).json({ message: 'Invalid location format' });
            }
            const productData = {
                title,
                price: Number(price),
                category,
                location: locationData,
                description,
                existingImages
            };
            // console.log('productData : ',productData);
            const updatedProduct = await this.updateProductUseCase.execute(productId, userId, productData, files);
            // console.log(' updatedProduct : ', updatedProduct);
            return res.status(200).json(updatedProduct);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async deleteProduct(req, res) {
        try {
            const userId = req.userId;
            const productId = req.params.productId;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            await this.deleteProductUseCase.execute(productId, userId);
            return res.status(200).json({ message: 'Product deleted successfully' });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getProducts(req, res) {
        try {
            const currentUserId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const search = req.query.search;
            const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
            const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
            const category = req.query.category;
            const dateSort = req.query.dateSort;
            const latitude = req.query.latitude ? parseFloat(req.query.latitude) : undefined;
            const longitude = req.query.longitude ? parseFloat(req.query.longitude) : undefined;
            const radius = req.query.radius ? parseFloat(req.query.radius) : undefined;
            let locationFilter;
            if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
                locationFilter = { latitude, longitude, radius };
            }
            const result = await this.productRepository.findAll({
                page,
                limit,
                excludeUserId: currentUserId,
                search,
                minPrice,
                maxPrice,
                category,
                dateSort,
                locationFilter
            });
            //console.log('results : ', result);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getUserProducts(req, res) {
        try {
            const userId = req.params.userId;
            //  // console.log( ' userID from getUserProducts : ', userId)
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const products = await this.productRepository.findByUserId(userId);
            // console.log( 'Products : ', products)
            return res.status(200).json(products);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async createPromotionSession(req, res) {
        try {
            //  console.log( ' createPromotionSession function triggered')
            const { productId } = req.params;
            const userId = req.userId;
            // console.log('userId : ', userId)
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const product = await this.productRepository.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (product.userId._id.toString() !== userId) {
                return res.status(403).json({ message: 'Not authorized to promote this product' });
            }
            // console.log('verification completed');
            const sessionId = await this.stripeService.createPromotionCheckoutSession(userId, productId);
            //  console.log('sessionId : ', sessionId)
            return res.status(200).json({ sessionUrl: sessionId });
        }
        catch (error) {
            console.error('Promotion session creation error:', error);
            return res.status(500).json({ message: 'Error creating promotion session' });
        }
    }
    async handlePromotionSuccess(req, res) {
        var _a;
        try {
            console.log(' handlePromotionSuccess riggered');
            const { session_id } = req.query;
            console.log(' sessionid : ', session_id);
            if (!session_id || typeof session_id !== 'string') {
                return res.status(400).json({ message: 'Invalid session ID' });
            }
            const session = await this.stripeService.retrieveSession(session_id);
            const productId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.productId;
            if (!productId) {
                return res.status(400).json({ message: 'Product ID not found in session' });
            }
            const promotionExpiry = new Date();
            promotionExpiry.setDate(promotionExpiry.getDate() + 30);
            const updatedProduct = await this.productRepository.update(productId, {
                isPromoted: true,
                promotionExpiry
            });
            return res.status(200).json({
                message: "Product promotion activated successfully",
                data: {
                    isPromoted: updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.isPromoted,
                    promotionExpiry: updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.promotionExpiry
                }
            });
        }
        catch (error) {
            console.error('Promotion success handling error:', error);
            return res.status(500).json({ message: 'Error processing promotion payment' });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map