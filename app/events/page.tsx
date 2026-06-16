import { prisma } from '@/lib/prisma';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import { Suspense } from 'react';

export const revalidate = 0;

type SearchParams = {
  category?: string;
  search?: string;
};

async function getEvents(searchParams: SearchParams) {
  const where: any = {};

  if (searchParams.category && searchParams.category !== 'All') {
    where.category = searchParams.category;
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { location: { contains: searchParams.search, mode: 'insensitive' } },
      { venue: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  try {
    return await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  } catch {
    return [];
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const events = await getEvents(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Explore Events</h1>
      <p className="text-gray-400 mb-8">
        Browse {events.length} upcoming event{events.length !== 1 ? 's' : ''}
      </p>

      <Suspense fallback={null}>
        <EventFilters />
      </Suspense>

      {events.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-gray-400">
          No events found matching your filters. Try a different search or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              category={event.category}
              location={event.location}
              date={event.date}
              price={event.price}
              imageUrl={event.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
