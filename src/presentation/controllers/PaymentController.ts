import { Request, Response } from 'express';
import { CreateSubscriptionUseCase } from '../../application/useCases/user/CreateSubscriptionUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { StripeService } from '../../infrastructure/services/StripeService';

export class PaymentController {
  private createSubscriptionUseCase: CreateSubscriptionUseCase;

  constructor(
    private userRepository: UserRepository,
    private stripeService: StripeService
  ) {
    this.createSubscriptionUseCase = new CreateSubscriptionUseCase(
      this.userRepository,
      this.stripeService
    );
  }

  async createSubscription(req: Request, res: Response) {
    try {
      const { planType, priceId } = req.body;
      const userId = req.userId // Assuming you have access to the user ID from the request
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      

      const { clientSecret, user } = await this.createSubscriptionUseCase.execute({
        userId,
        planType,
        priceId
      });

      return res.status(200).json({ clientSecret, user });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
}
