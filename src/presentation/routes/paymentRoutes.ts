import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { StripeService } from '../../infrastructure/services/StripeService';
import { authMiddleware } from '../middleware/authMiddleware';

const paymentRouter = Router();

const userRepository = new UserRepository();
const stripeService = new StripeService();
const paymentController = new PaymentController(userRepository, stripeService);

paymentRouter.post('/create-subscription',authMiddleware,(req, res) =>
  paymentController.createSubscription(req, res)
);

export default paymentRouter;