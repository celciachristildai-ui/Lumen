import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

type EventCardProps = {
  id: string;
  title: string;
  category: string;
  location: string;
  date: Date | string;
  price: number;
  imageUrl: string;
};

export default function EventCard({
  id,
  title,
  category,
  location,
  date,
  price,
  imageUrl,
}: EventCardProps) {
  return (
    <Link
      href={`/events/${id}`}
      className="card-hover glass rounded-2xl overflow-hidden flex flex-col group"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-dark-900/80 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 text-accent-400">
          <Tag size={12} /> {category}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-semibold text-lg line-clamp-2">{title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <Calendar size={14} /> {formatDate(date)}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <MapPin size={14} /> {location}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-semibold text-primary-300">
            {price === 0 ? 'Free' : formatCurrency(price)}
          </span>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary-600/20 text-primary-300 group-hover:bg-primary-600 group-hover:text-white transition">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}
