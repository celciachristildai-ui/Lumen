import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { id: true, name: true, email: true, phone: true, city: true, bio: true, image: true, language: true, role: true, createdAt: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, phone, city, bio, image, language } = body;

    const updated = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(city !== undefined && { city }),
        ...(bio !== undefined && { bio }),
        ...(image !== undefined && { image }),
        ...(language && { language }),
      },
      select: { id: true, name: true, email: true, phone: true, city: true, bio: true, image: true, language: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
