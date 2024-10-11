import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AdminRepository } from '../../infrastructure/repositories/AdminRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const adminRouter = Router();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();

const adminController = new AdminController(adminRepository, userRepository);

adminRouter.post('/login', (req, res) => adminController.login(req, res));
adminRouter.post('/logout', (req, res) => adminController.logout(req, res));
adminRouter.post('/block-user/:userId', (req, res) => adminController.blockUser(req, res));
adminRouter.post('/unblock-user/:userId', (req, res) => adminController.unblockUser(req, res));
adminRouter.get('/users', (req, res) => adminController.getUsers(req, res));

export default adminRouter;