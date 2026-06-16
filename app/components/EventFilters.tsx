'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

const categories = [
  'All',
  'Music',
  'Technology',
  'Art & Culture',
  'Food & Drink',
  'Sports',
  'Business',
];

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const activeCategory = searchParams.get('category') ?? 'All';

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/events?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ search });
        }}
        className="relative max-w-xl"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events, venues, cities..."
          className="w-full bg-dark-700 border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </form>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams({ category: cat })}
            className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full transition ${
              activeCategory === cat
                ? 'bg-primary-600 text-white'
                : 'glass text-gray-300 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
