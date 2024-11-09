import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkUserBlockedMiddleware } from '../middleware/checkUserBlockedMiddleware';
import multer from 'multer';

const productRouter = Router();
const productRepository = new ProductRepository();
const s3Service = new S3Service();
const productController = new ProductController(productRepository, s3Service);
const upload = multer({ storage: multer.memoryStorage() });

productRouter.post('/create', authMiddleware, checkUserBlockedMiddleware, upload.array('images', 10), (req, res) => productController.createProduct(req, res));
productRouter.get('/', authMiddleware, checkUserBlockedMiddleware, (req, res) => productController.getProducts(req, res));

export default productRouter;