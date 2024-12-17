"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionUseCase = void 0;
const subscriptionUtils_1 = require("../../../shared/utils/subscriptionUtils");
class CreateSubscriptionUseCase {
    constructor(userRepository, stripeService) {
        this.userRepository = userRepository;
        this.stripeService = stripeService;
    }
    async execute({ userId, planType, priceId }) {
        // Find the user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Create the Stripe customer and subscription
        const { clientSecret } = await this.stripeService.createSubscription(user.email, priceId);
        // Update the user's premium status and expiration date
        user.premium_status = true;
        user.premium_expiration = (0, subscriptionUtils_1.getExpirationDate)(planType);
        const updatedUser = await this.userRepository.update(userId, user);
        // Return the Stripe client secret and the updated user
        return { clientSecret, user: updatedUser };
    }
}
exports.CreateSubscriptionUseCase = CreateSubscriptionUseCase;
//# sourceMappingURL=CreateSubscriptionUseCase.js.map