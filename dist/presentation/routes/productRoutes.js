"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const ProductRepository_1 = require("../../infrastructure/repositories/ProductRepository");
const S3Service_1 = require("../../infrastructure/services/S3Service");
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkUserBlockedMiddleware_1 = require("../middleware/checkUserBlockedMiddleware");
const multer_1 = __importDefault(require("multer"));
const productRouter = (0, express_1.Router)();
const productRepository = new ProductRepository_1.ProductRepository();
const s3Service = new S3Service_1.S3Service();
const productController = new ProductController_1.ProductController(productRepository, s3Service);
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
productRouter.post('/create', authMiddleware_1.authMiddleware, checkUserBlockedMiddleware_1.checkUserBlockedMiddleware, upload.array('images', 10), (req, res) => productController.createProduct(req, res));
productRouter.get('/', authMiddleware_1.authMiddleware, checkUserBlockedMiddleware_1.checkUserBlockedMiddleware, (req, res) => productController.getProducts(req, res));
productRouter.get('/products/:userId', authMiddleware_1.authMiddleware, checkUserBlockedMiddleware_1.checkUserBlockedMiddleware, (req, res) => productController.getUserProducts(req, res));
productRouter.post('/promote/:productId', authMiddleware_1.authMiddleware, checkUserBlockedMiddleware_1.checkUserBlockedMiddleware, (req, res) => productController.createPromotionSession(req, res));
productRouter.get('/promote/success', authMiddleware_1.authMiddleware, (req, res) => productController.handlePromotionSuccess(req, res));
productRouter.put('/update/:productId', authMiddleware_1.authMiddleware, checkUserBlockedMiddleware_1.checkUserBlockedMiddleware, upload.array('images', 10), (req, res) => productController.updateProduct(req, res));
productRouter.delete('/delete/:productId', authMiddleware_1.authMiddleware, checkUserBlockedMiddleware_1.checkUserBlockedMiddleware, (req, res) => productController.deleteProduct(req, res));
exports.default = productRouter;
//# sourceMappingURL=productRoutes.js.map