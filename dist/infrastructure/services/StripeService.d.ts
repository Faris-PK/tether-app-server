import Stripe from 'stripe';
export declare class StripeService {
    private apiKey;
    private stripe;
    constructor(apiKey: string);
    createCheckoutSession(priceId: string, userId: string): Promise<string>;
    createPromotionCheckoutSession(userId: string, productId: string): Promise<string>;
    retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session>;
    getSubscriptionDetails(priceId: string): Promise<Stripe.Price>;
}
