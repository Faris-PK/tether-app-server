import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AdminRepository } from '../../infrastructure/repositories/AdminRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware';
import { ReportRepository } from '../../infrastructure/repositories/ReportRepository';

const adminRouter = Router();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const postRepository = new PostRepository();
const reportRepository = new ReportRepository
const adminController = new AdminController(adminRepository, userRepository, postRepository, reportRepository);


adminRouter.post('/login', (req, res) => adminController.login(req, res));


adminRouter.post('/logout', adminAuthMiddleware, (req, res) => adminController.logout(req, res));
adminRouter.post('/block-user/:userId', adminAuthMiddleware, (req, res) => adminController.blockUser(req, res));
adminRouter.post('/unblock-user/:userId', adminAuthMiddleware, (req, res) => adminController.unblockUser(req, res));
adminRouter.get('/users', adminAuthMiddleware, (req, res) => adminController.getUsers(req, res));


adminRouter.get('/posts', adminAuthMiddleware, (req, res) => adminController.getPosts(req, res));
adminRouter.post('/block-post/:postId', adminAuthMiddleware, (req, res) => adminController.blockPost(req, res));
adminRouter.post('/unblock-post/:postId', adminAuthMiddleware, (req, res) => adminController.unblockPost(req, res));


adminRouter.get('/reports', adminAuthMiddleware, (req, res) => adminController.getAllReports(req, res));
adminRouter.put('/reports/status/:id', adminAuthMiddleware, (req, res) => adminController.updateReportStatus(req, res));
export default adminRouter;