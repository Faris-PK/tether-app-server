import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkUserBlockedMiddleware } from '../middleware/checkUserBlockedMiddleware'; 
import multer from 'multer';

const postRouter = Router();
const postRepository = new PostRepository();
const userRepository = new UserRepository();
const s3Service = new S3Service();
const postController = new PostController(postRepository, s3Service, userRepository);
const upload = multer({ storage: multer.memoryStorage() });

postRouter.post('/create', authMiddleware, checkUserBlockedMiddleware, upload.single('file'), (req, res) => postController.createPost(req, res));
postRouter.get('/', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.getPosts(req, res));
postRouter.delete('/delete/:id', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.deletePost(req, res));
postRouter.put('/update/:id', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.updatePost(req, res));

export default postRouter;