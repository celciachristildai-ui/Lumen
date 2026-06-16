import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';



export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('[STRIPE_WEBHOOK] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, eventId, quantity } = session.metadata || {};

    if (!userId || !eventId || !quantity) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const qty = parseInt(quantity, 10);

    await prisma.$transaction([
      prisma.booking.update({
        where: { stripeSessionId: session.id },
        data: { status: 'CONFIRMED' },
      }),
      prisma.event.update({
        where: { id: eventId },
        data: { bookedSeats: { increment: qty } },
      }),
    ]);

    console.log(`[WEBHOOK] Booking confirmed for event ${eventId}, user ${userId}`);
  }

  return NextResponse.json({ received: true });
}
