import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { IUser } from '../../../domain/entities/User';
import { StripeService } from '../../../infrastructure/services/StripeService';
export declare class CreateSubscriptionUseCase {
    private userRepository;
    private stripeService;
    constructor(userRepository: UserRepository, stripeService: StripeService);
    execute({ userId, planType, priceId }: {
        userId: string;
        planType: 'monthly' | 'yearly';
        priceId: string;
    }): Promise<{
        clientSecret: string;
        user: IUser;
    }>;
}
