import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { eventId, quantity } = await req.json();
    const userId = (session.user as any).id;

    if (!eventId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid booking data' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const available = event.capacity - event.bookedSeats;
    if (quantity > available) {
      return NextResponse.json({ error: `Only ${available} seats available` }, { status: 400 });
    }

    const totalAmount = event.price * quantity;

    // Free event — confirm immediately
    if (event.price === 0) {
      const booking = await prisma.$transaction([
        prisma.booking.create({
          data: { userId, eventId, quantity, totalAmount: 0, status: 'CONFIRMED' },
        }),
        prisma.event.update({
          where: { id: eventId },
          data: { bookedSeats: { increment: quantity } },
        }),
      ]);

      return NextResponse.json({ booking: booking[0] });
    }

    // Paid event — create Stripe Checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: event.title,
              description: `${event.venue} — ${new Date(event.date).toDateString()}`,
              images: [event.imageUrl],
            },
            unit_amount: Math.round(event.price * 100),
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/events/${eventId}?cancelled=true`,
      metadata: { userId, eventId, quantity: String(quantity) },
    });

    // Create a PENDING booking
    await prisma.booking.create({
      data: {
        userId,
        eventId,
        quantity,
        totalAmount,
        status: 'PENDING',
        stripeSessionId: stripeSession.id,
      },
    });

    return NextResponse.json({ checkoutUrl: stripeSession.url });
  } catch (err) {
    console.error('[BOOKING_ERROR]', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const bookings = await prisma.booking.findMany({
      where: { userId: (session.user as any).id },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
