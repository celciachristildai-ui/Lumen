import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const where: any = {};
    if (category && category !== 'All') where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      select: {
        id: true, title: true, category: true, location: true,
        date: true, price: true, imageUrl: true, capacity: true, bookedSeats: true,
      },
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'You must be signed in to create an event' }, { status: 401 });
    }
    const body = await req.json();
    const { title, description, category, location, venue, date, time, price, capacity, imageUrl } = body;
    if (!title || !description || !location || !venue || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const event = await prisma.event.create({
      data: {
        title, description, category, location, venue,
        date: new Date(date),
        time,
        price: parseFloat(price) || 0,
        capacity: parseInt(capacity) || 100,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
        organizerId: (session.user as any).id,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error('[CREATE_EVENT]', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
