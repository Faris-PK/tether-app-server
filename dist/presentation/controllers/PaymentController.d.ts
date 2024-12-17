import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { StripeService } from '../../infrastructure/services/StripeService';
export declare class PaymentController {
    private userRepository;
    private stripeService;
    private createSubscriptionUseCase;
    constructor(userRepository: UserRepository, stripeService: StripeService);
    createSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
