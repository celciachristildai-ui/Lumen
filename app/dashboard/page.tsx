import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Calendar, MapPin, Ticket, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

const statusIcon = {
  CONFIRMED: <CheckCircle size={14} className="text-green-400" />,
  PENDING: <Clock size={14} className="text-yellow-400" />,
  CANCELLED: <XCircle size={14} className="text-red-400" />,
};

const statusColor = {
  CONFIRMED: 'text-green-400 bg-green-400/10',
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: { userId: (session.user as any).id },
    include: { event: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-1">My Bookings</h1>
        <p className="text-gray-400">
          Welcome back, <span className="text-white font-medium">{session.user?.name}</span>. You have{' '}
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Ticket className="mx-auto mb-4 text-gray-500" size={40} />
          <p className="text-gray-400 mb-4">You haven&apos;t booked any events yet.</p>
          <Link
            href="/events"
            className="btn-primary text-white font-semibold px-6 py-3 rounded-full inline-block"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
              <div className="relative h-24 w-full sm:w-32 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={booking.event.imageUrl}
                  alt={booking.event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-lg truncate">
                    {booking.event.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 ${
                      statusColor[booking.status]
                    }`}
                  >
                    {statusIcon[booking.status]} {booking.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {formatDate(booking.event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {booking.event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ticket size={13} /> {booking.quantity} ticket{booking.quantity !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-lg gradient-text">
                  {booking.totalAmount === 0 ? 'Free' : formatCurrency(booking.totalAmount)}
                </p>
                <Link
                  href={`/events/${booking.eventId}`}
                  className="text-xs text-primary-400 hover:text-primary-300 mt-1 inline-block"
                >
                  View event →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
