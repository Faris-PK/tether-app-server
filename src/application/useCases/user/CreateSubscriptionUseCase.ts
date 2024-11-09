import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { User, IUser } from '../../../domain/entities/User';
import { getExpirationDate } from '../../../shared/utils/subscriptionUtils';
import { StripeService } from '../../../infrastructure/services/StripeService';

export class CreateSubscriptionUseCase {
  constructor(
    private userRepository: UserRepository,
    private stripeService: StripeService
  ) {}

  async execute({
    userId,
    planType,
    priceId
  }: {
    userId: string;
    planType: 'monthly' | 'yearly';
    priceId: string;
  }): Promise<{ clientSecret: string; user: IUser }> {
    // Find the user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create the Stripe customer and subscription
    const { clientSecret } = await this.stripeService.createSubscription(
      user.email,
      priceId
    );

    // Update the user's premium status and expiration date
    user.premium_status = true;
    user.premium_expiration = getExpirationDate(planType);
    const updatedUser = await this.userRepository.update(userId, user);

    // Return the Stripe client secret and the updated user
    return { clientSecret, user: updatedUser };
  }
}
