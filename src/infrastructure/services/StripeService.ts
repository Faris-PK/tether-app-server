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
        userId: userId,
        priceId: priceId
      }
    });
    

    return session.id;
  }
  async createPromotionCheckoutSession(userId: string, productId: string): Promise<string> {
    const product = await this.stripe.products.create({
      name: '30-Day Product Promotion',
      description: 'Promote your product for 30 days',
    });


    const price = await this.stripe.prices.create({
      product: product.id,
      unit_amount: 99,
      currency: 'usd',
    });

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/user/promotesuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/user/payment/cancel`,
      metadata: {
        userId: userId,
        productId: productId,
        type: 'promotion'
      }
    });
   // console.log(' session : ', session);
    

    return session.id;
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }
  async getSubscriptionDetails(priceId: string): Promise<Stripe.Price> {
    return await this.stripe.prices.retrieve(priceId);
  }
}