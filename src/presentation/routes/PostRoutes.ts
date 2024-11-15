import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { ReportRepository } from '../../infrastructure/repositories/ReportRepository';
import { CommentRepository } from '../../infrastructure/repositories/CommentRepository';
import { S3Service } from '../../infrastructure/services/S3Service';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkUserBlockedMiddleware } from '../middleware/checkUserBlockedMiddleware'; 
import multer from 'multer';


const postRouter = Router();
const postRepository = new PostRepository();
const userRepository = new UserRepository();
const reportRepository = new ReportRepository();
const commentRepository = new CommentRepository();
const s3Service = new S3Service();
const postController = new PostController(postRepository, s3Service, userRepository,commentRepository, reportRepository);
const upload = multer({ storage: multer.memoryStorage() });

postRouter.post('/create', authMiddleware, checkUserBlockedMiddleware, upload.single('file'), (req, res) => postController.createPost(req, res));
postRouter.get('/',authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.getPostsForHome(req, res));
postRouter.get('/profile/:userId', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.getPostsForProfile(req, res));
postRouter.delete('/delete/:id', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.deletePost(req, res));
postRouter.put('/update/:id', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.updatePost(req, res));
postRouter.post('/like/:id', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.likePost(req, res));
postRouter.post('/report/:id', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.reportPost(req, res));


postRouter.get('/comments/:postId', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.getComments(req, res));
postRouter.post('/comments/add/:postId', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.createComment(req, res));
postRouter.put('/comments/edit/:postId/:commentId', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.updateComment(req, res));
postRouter.delete('/comments/delete/:postId/:commentId', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.deleteComment(req, res));
postRouter.post('/comments/reply/:postId/:parentCommentId', authMiddleware, checkUserBlockedMiddleware, (req, res) => postController.createReplyComment(req, res));
postRouter.get('/singlePost/:postId',  (req, res) => postController.getSinglePost(req, res) )

export default postRouter;