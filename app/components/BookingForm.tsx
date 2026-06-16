'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type BookingFormProps = {
  eventId: string;
  price: number;
  seatsAvailable: number;
};

export default function BookingForm({ eventId, price, seatsAvailable }: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const total = price * quantity;
  const soldOut = seatsAvailable <= 0;

  async function handleBook() {
    if (!session) {
      toast.error('Please log in to book this event');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.success('Booking confirmed!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-2xl p-6 sticky top-24">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">Price per ticket</p>
          <p className="text-2xl font-display font-bold gradient-text">
            {price === 0 ? 'Free' : formatCurrency(price)}
          </p>
        </div>
        <p className="text-sm text-gray-400">{seatsAvailable} seats left</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-300">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 glass rounded-full hover:bg-white/10 transition"
            disabled={soldOut}
          >
            <Minus size={14} />
          </button>
          <span className="font-semibold w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(seatsAvailable, q + 1))}
            className="p-2 glass rounded-full hover:bg-white/10 transition"
            disabled={soldOut}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 border-t border-white/5 pt-4">
        <span className="font-semibold">Total</span>
        <span className="font-display font-bold text-xl">
          {total === 0 ? 'Free' : formatCurrency(total)}
        </span>
      </div>

      <button
        onClick={handleBook}
        disabled={loading || soldOut}
        className="btn-primary w-full text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : soldOut ? (
          'Sold Out'
        ) : price === 0 ? (
          'Reserve Free Ticket'
        ) : (
          'Book Now'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}
