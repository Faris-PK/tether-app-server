import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor(private apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-10-28.acacia'
    });
  }

  async createCheckoutSession(priceId: string, userId: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/user/paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/user/payment/cancel`,
      metadata: {
        userId: userId
      }
    });
    

    return session.id;
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }
}