import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Users, Clock, Tag } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import BookingForm from '../../components/BookingForm';

export const revalidate = 0;

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  let event;
  try {
    event = await prisma.event.findUnique({
      where: { id: params.id },
      include: { organizer: { select: { name: true } } },
    });
  } catch {
    event = null;
  }

  if (!event) return notFound();

  const seatsAvailable = event.capacity - event.bookedSeats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left / Main */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden">
            <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 bg-dark-900/80 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 text-accent-400">
              <Tag size={12} /> {event.category}
            </span>
          </div>

          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-4">{event.title}</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-primary-300 text-sm mb-1">
                  <Calendar size={14} /> Date
                </div>
                <p className="text-sm font-medium">{formatDate(event.date)}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-primary-300 text-sm mb-1">
                  <Clock size={14} /> Time
                </div>
                <p className="text-sm font-medium">{event.time}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-primary-300 text-sm mb-1">
                  <MapPin size={14} /> Venue
                </div>
                <p className="text-sm font-medium line-clamp-1">{event.venue}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-primary-300 text-sm mb-1">
                  <Users size={14} /> Seats
                </div>
                <p className="text-sm font-medium">{seatsAvailable} / {event.capacity}</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-display font-semibold text-xl mb-3">About this Event</h2>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </div>

            <div className="glass rounded-2xl p-6 mt-4">
              <h2 className="font-display font-semibold text-xl mb-2">Location</h2>
              <p className="text-gray-300">{event.venue}</p>
              <p className="text-gray-400 text-sm">{event.location}</p>
            </div>

            <div className="glass rounded-2xl p-6 mt-4">
              <h2 className="font-display font-semibold text-xl mb-2">Organizer</h2>
              <p className="text-gray-300">{event.organizer.name}</p>
            </div>
          </div>
        </div>

        {/* Right / Booking */}
        <div className="lg:col-span-1">
          <BookingForm
            eventId={event.id}
            price={event.price}
            seatsAvailable={seatsAvailable}
          />
        </div>
      </div>
    </div>
  );
}
