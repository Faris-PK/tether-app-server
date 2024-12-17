"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const AdminLoginUseCase_1 = require("../../application/useCases/admin/AdminLoginUseCase");
const GetUsersUseCase_1 = require("../../application/useCases/admin/GetUsersUseCase");
const GetPostsUseCase_1 = require("../../application/useCases/admin/GetPostsUseCase");
const BlockPostUseCase_1 = require("../../application/useCases/admin/BlockPostUseCase");
const UnblockPostUseCase_1 = require("../../application/useCases/admin/UnblockPostUseCase");
const GetAllReportsUseCase_1 = require("../../application/useCases/admin/GetAllReportsUseCase");
const UpdateReportStatusUseCase_1 = require("../../application/useCases/admin/UpdateReportStatusUseCase");
const GetProductsUseCase_1 = require("../../application/useCases/marketplace/GetProductsUseCase ");
class AdminController {
    constructor(adminRepository, userRepository, postRepository, reportRepository, productRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.reportRepository = reportRepository;
        this.productRepository = productRepository;
        this.adminLoginUseCase = new AdminLoginUseCase_1.AdminLoginUseCase(adminRepository);
        this.getUsersUseCase = new GetUsersUseCase_1.GetUsersUseCase(adminRepository);
        this.getPostsUseCase = new GetPostsUseCase_1.GetPostsUseCase(adminRepository);
        this.blockPostUseCase = new BlockPostUseCase_1.BlockPostUseCase(postRepository);
        this.unblockPostUseCase = new UnblockPostUseCase_1.UnblockPostUseCase(postRepository);
        this.getAllReportsUseCase = new GetAllReportsUseCase_1.GetAllReportsUseCase(reportRepository);
        this.updateReportStatusUseCase = new UpdateReportStatusUseCase_1.UpdateReportStatusUseCase(reportRepository);
        this.getProductsUseCase = new GetProductsUseCase_1.GetProductsUseCase(adminRepository);
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken, admin } = await this.adminLoginUseCase.execute({ email, password });
            res.cookie('adminAccessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
            res.cookie('adminRefreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({ message: 'Admin login successful', admin });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log('message', error.message);
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async logout(req, res) {
        res.clearCookie('adminAccessToken');
        res.clearCookie('adminRefreshToken');
        return res.status(200).json({ message: 'Admin logged out successfully' });
    }
    async getUsers(req, res) {
        try {
            const { page = 1, limit = 10, searchTerm = '', sortField = 'createdAt', sortOrder = 'desc' } = req.query;
            const users = await this.getUsersUseCase.execute({
                page: Number(page),
                limit: Number(limit),
                searchTerm: searchTerm,
                sortField: sortField,
                sortOrder: sortOrder
            });
            return res.status(200).json(users);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async toggleUserBlock(req, res) {
        try {
            const { userId } = req.params;
            const { block } = req.body;
            if (typeof block !== 'boolean') {
                return res.status(400).json({ message: 'Invalid block status' });
            }
            const user = await this.adminRepository.toggleUserBlockStatus(userId, block);
            return res.status(200).json({
                message: block ? 'User blocked successfully' : 'User unblocked successfully',
                user
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getPosts(req, res) {
        try {
            const { page = 1, limit = 10, searchTerm = '', sortField = 'createdAt', sortOrder = 'desc' } = req.query;
            const posts = await this.getPostsUseCase.execute({
                page: Number(page),
                limit: Number(limit),
                searchTerm: searchTerm,
                sortField: sortField,
                sortOrder: sortOrder
            });
            return res.status(200).json(posts);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async togglePostBlock(req, res) {
        try {
            const { postId } = req.params;
            const { block } = req.body;
            console.log(postId, block);
            if (typeof block !== 'boolean') {
                return res.status(400).json({ message: 'Invalid block status' });
            }
            const user = await this.adminRepository.togglePostBlockStatus(postId, block);
            return res.status(200).json({
                message: block ? 'User blocked successfully' : 'User unblocked successfully',
                user
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllReports(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.filter || 'all';
            const search = req.query.search || '';
            const reports = await this.getAllReportsUseCase.execute({
                page,
                limit,
                filter,
                search
            });
            return res.status(200).json(reports);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
    async updateReportStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const report = await this.updateReportStatusUseCase.execute(id, status);
            return res.status(200).json(report);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async getAllProducts(req, res) {
        try {
            const { page, limit, search, sortOrder, category, minPrice, maxPrice } = req.query;
            const products = await this.getProductsUseCase.execute({
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                search: search,
                sortOrder: sortOrder,
                category: category,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
            });
            return res.status(200).json(products);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async approveProduct(req, res) {
        try {
            const { productId } = req.params;
            const product = await this.productRepository.update(productId, { isApproved: true });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async updateProductStatus(req, res) {
        try {
            const { productId } = req.params;
            const { status } = req.body;
            console.log(productId, status);
            if (!['block', 'unblock'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }
            const isBlocked = status === 'block';
            const product = await this.productRepository.updateStatus(productId, isBlocked);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json({
                message: `Product ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
                product
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map