"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const CreateSubscriptionUseCase_1 = require("../../application/useCases/user/CreateSubscriptionUseCase");
class PaymentController {
    constructor(userRepository, stripeService) {
        this.userRepository = userRepository;
        this.stripeService = stripeService;
        this.createSubscriptionUseCase = new CreateSubscriptionUseCase_1.CreateSubscriptionUseCase(this.userRepository, this.stripeService);
    }
    async createSubscription(req, res) {
        try {
            const { planType, priceId } = req.body;
            const userId = req.userId; // Assuming you have access to the user ID from the request
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const { clientSecret, user } = await this.createSubscriptionUseCase.execute({
                userId,
                planType,
                priceId
            });
            return res.status(200).json({ clientSecret, user });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=PaymentController.js.map