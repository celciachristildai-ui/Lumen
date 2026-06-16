'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, MapPin, Tag, Users, DollarSign, Image as ImageIcon, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Music', 'Technology', 'Art & Culture', 'Food & Drink', 'Sports', 'Business', 'Education', 'Comedy', 'Fashion', 'Health & Wellness'];

export default function HostEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Music',
    location: '', venue: '', date: '', time: '',
    price: '0', capacity: '100',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  });

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-400" size={32} /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-10 text-center max-w-md">
          <h2 className="font-display font-bold text-2xl mb-3">Sign in to Host an Event</h2>
          <p className="text-gray-400 mb-6">Create a free account or sign in to list your event on LUMEN.</p>
          <button
            onClick={() => router.push('/login?callbackUrl=/host-event')}
            className="btn-primary text-white font-semibold px-8 py-3.5 rounded-full w-full"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.venue || !form.date || !form.time) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 0,
          capacity: parseInt(form.capacity) || 100,
          date: new Date(form.date).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');
      toast.success('Event created successfully!');
      router.push(`/events/${data.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field = (label: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">{icon}{label}</label>
      {children}
    </div>
  );

  const input = (props: React.InputHTMLAttributes<HTMLInputElement>, key: string) => (
    <input
      {...props}
      value={(form as any)[key]}
      onChange={e => setForm({ ...form, [key]: e.target.value })}
      className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Host an Event</h1>
        <p className="text-gray-400">Fill in the details below to list your event on LUMEN.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
        {field('Event Title *', <FileText size={14} />,
          input({ placeholder: 'e.g. Neon Nights Music Festival', required: true }, 'title')
        )}

        {field('Description *', <FileText size={14} />,
          <textarea
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your event in detail..."
            rows={4}
            className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {field('Category *', <Tag size={14} />,
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          {field('Cover Image URL', <ImageIcon size={14} />,
            input({ placeholder: 'https://images.unsplash.com/...' }, 'imageUrl')
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {field('City / Location *', <MapPin size={14} />,
            input({ placeholder: 'e.g. Mumbai, India', required: true }, 'location')
          )}
          {field('Venue Name *', <MapPin size={14} />,
            input({ placeholder: 'e.g. NSCI Dome', required: true }, 'venue')
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {field('Event Date *', <Calendar size={14} />,
            input({ type: 'date', required: true, min: new Date().toISOString().split('T')[0] }, 'date')
          )}
          {field('Start Time *', <Calendar size={14} />,
            input({ type: 'time', required: true }, 'time')
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {field('Ticket Price (₹)', <DollarSign size={14} />,
            input({ type: 'number', min: '0', placeholder: '0 for free event' }, 'price')
          )}
          {field('Total Capacity', <Users size={14} />,
            input({ type: 'number', min: '1', placeholder: '100' }, 'capacity')
          )}
        </div>

        <div className="border-t border-white/5 pt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Creating...</> : 'Publish Event'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="glass px-6 py-3.5 rounded-full text-gray-300 hover:bg-white/10 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
